import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { sendMail } from '$lib/server/mailer';
import {
	order as orderTable,
	orderItem,
	product,
	accounts,
	inventoryLog,
	payment
} from '$lib/server/db/schema';
import { and, eq, gte, inArray, sql } from 'drizzle-orm';

function formatImage(img: unknown) {
	if (!img) return null;
	try {
		return `data:image/jpeg;base64,${Buffer.from(img as any).toString('base64')}`;
	} catch {
		return null;
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session || session.role !== 'admin') throw redirect(303, '/');

	const rows = await db
		.select({
			order_id: orderTable.id,
			created_at: orderTable.created_at,
			status: orderTable.status,
			customer_first: accounts.firstname,
			customer_last: accounts.lastname,
			quantity: orderItem.quantity,
			colors: orderItem.colors,
			price: orderItem.price,
			product_id: product.id,
			name: product.name,
			image: product.image
		})
		.from(orderTable)
		.leftJoin(orderItem, eq(orderItem.order_id, orderTable.id))
		.leftJoin(product, eq(product.id, orderItem.product_id))
		.leftJoin(accounts, eq(accounts.id, orderTable.account_id))
		.where(inArray(orderTable.status, ['pending', 'for_delivery', 'cancelled', 'completed']));

	// Group rows by order id
	const byId = new Map<number, any>();
	for (const r of rows) {
		const id = r.order_id as number;
		const entry = byId.get(id) ?? {
			id,
			created_at: r.created_at,
			status: (r.status ?? 'pending').toLowerCase(),
			customer: `${r.customer_first ?? ''} ${r.customer_last ?? ''}`.trim(),
			items: [],
			total: 0
		};
		const item = {
			product_id: r.product_id,
			name: r.name,
			image: formatImage(r.image),
			colors: r.colors ?? [],
			quantity: Number(r.quantity ?? 0),
			price: parseFloat(r.price as unknown as string)
		};
		entry.items.push(item);
		entry.total += item.price * item.quantity;
		byId.set(id, entry);
	}

	const allOrders = Array.from(byId.values());
	return {
		requests: allOrders.filter((o) => o.status === 'pending'),
		confirmed: allOrders.filter((o) => o.status === 'for_delivery'),
		denied: allOrders.filter((o) => o.status === 'cancelled'),
		completed: allOrders.filter((o) => o.status === 'completed')
	};
};

export const actions: Actions = {
	confirm: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session || session.role !== 'admin') return fail(403, { message: 'Forbidden' });
		const fd = await request.formData();
		const orderId = Number(fd.get('order_id'));
		if (!orderId) return fail(400, { message: 'Invalid order id' });

		try {
			await db.transaction(async (tx) => {
				const [ord] = await tx
					.select({ id: orderTable.id, status: orderTable.status })
					.from(orderTable)
					.where(eq(orderTable.id, orderId));
				if (!ord) throw new Error('ORDER_NOT_FOUND');
				if ((ord.status ?? '').toLowerCase() !== 'pending') throw new Error('ORDER_NOT_PENDING');

				const items = await tx
					.select({ product_id: orderItem.product_id, quantity: orderItem.quantity })
					.from(orderItem)
					.where(eq(orderItem.order_id, orderId));

				if (!items.length) throw new Error('NO_ITEMS');

				for (const it of items) {
					const updated = await tx
						.update(product)
						.set({ stock: sql`${product.stock} - ${it.quantity}` })
						.where(and(eq(product.id, it.product_id), gte(product.stock, it.quantity)))
						.returning({ id: product.id });

					if (updated.length === 0) {
						throw new Error(`INSUFFICIENT_STOCK:${it.product_id}`);
					}

					await tx.insert(inventoryLog).values({
						type: 'order_confirmed',
						quantity_change: -it.quantity,
						product_id: it.product_id
					});
				}

				await tx
					.update(orderTable)
					.set({ status: 'for_delivery' })
					.where(eq(orderTable.id, orderId));
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
			if (message.startsWith('INSUFFICIENT_STOCK')) {
				return fail(400, { message: 'Insufficient stock for one or more items.' });
			}
			if (message === 'ORDER_NOT_FOUND') return fail(404, { message: 'Order not found' });
			if (message === 'ORDER_NOT_PENDING') return fail(400, { message: 'Order is not pending' });
			if (message === 'NO_ITEMS') return fail(400, { message: 'Order has no items' });
			return fail(500, { message: 'Failed to confirm order' });
		}

		// Notify user via email (best-effort)
		try {
			const [row] = await db
				.select({ email: accounts.email, first: accounts.firstname, last: accounts.lastname })
				.from(orderTable)
				.leftJoin(accounts, eq(accounts.id, orderTable.account_id))
				.where(eq(orderTable.id, orderId));
			if (row?.email) {
				const name = `${row.first ?? ''} ${row.last ?? ''}`.trim();
				await sendMail({
					to: row.email,
					subject: `Your Order #${orderId} is Confirmed`,
					text: `Hello ${name || 'Customer'}, your order #${orderId} has been confirmed and is now for delivery.`
				});
			}
		} catch {}

		return { success: true };
	},
	deny: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session || session.role !== 'admin') return fail(403, { message: 'Forbidden' });
		const fd = await request.formData();
		const orderId = Number(fd.get('order_id'));
		if (!orderId) return fail(400, { message: 'Invalid order id' });
		await db.update(orderTable).set({ status: 'cancelled' }).where(eq(orderTable.id, orderId));

		// Notify user via email (best-effort)
		try {
			const [row] = await db
				.select({ email: accounts.email, first: accounts.firstname, last: accounts.lastname })
				.from(orderTable)
				.leftJoin(accounts, eq(accounts.id, orderTable.account_id))
				.where(eq(orderTable.id, orderId));
			if (row?.email) {
				const name = `${row.first ?? ''} ${row.last ?? ''}`.trim();
				await sendMail({
					to: row.email,
					subject: `Your Order #${orderId} has been Denied`,
					text: `Hello ${name || 'Customer'}, unfortunately your order #${orderId} was denied. Please contact support for details.`
				});
			}
		} catch {}

		return { success: true };
	},
	complete: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session || session.role !== 'admin') return fail(403, { message: 'Forbidden' });
		const fd = await request.formData();
		const orderId = Number(fd.get('order_id'));
		if (!orderId) return fail(400, { message: 'Invalid order id' });

		try {
			await db.transaction(async (tx) => {
				// Mark order as completed
				await tx.update(orderTable).set({ status: 'completed' }).where(eq(orderTable.id, orderId));

				// Compute order total from items
				const items = await tx
					.select({ qty: orderItem.quantity, price: orderItem.price })
					.from(orderItem)
					.where(eq(orderItem.order_id, orderId));

				const toNumber = (v: unknown) => parseFloat((v as any) ?? '0') || 0;
				const total = items.reduce((sum, it) => sum + toNumber(it.price) * Number(it.qty ?? 0), 0);

				// Upsert payment record for this order
				const existing = await tx
					.select({ id: payment.id })
					.from(payment)
					.where(eq(payment.order_id, orderId));

				if (existing.length) {
					await tx
						.update(payment)
						.set({ amount: String(total), status: 'Paid', date: new Date() })
						.where(eq(payment.id, existing[0].id));
				} else {
					await tx.insert(payment).values({
						order_id: orderId,
						amount: String(total),
						method: 'Cash',
						status: 'Paid',
						date: new Date()
					});
				}
			});
		} catch (e) {
			return fail(500, { message: 'Failed to complete order' });
		}

		// Notify user via email (best-effort)
		try {
			const [row] = await db
				.select({ email: accounts.email, first: accounts.firstname, last: accounts.lastname })
				.from(orderTable)
				.leftJoin(accounts, eq(accounts.id, orderTable.account_id))
				.where(eq(orderTable.id, orderId));
			if (row?.email) {
				const name = `${row.first ?? ''} ${row.last ?? ''}`.trim();
				await sendMail({
					to: row.email,
					subject: `Your Order #${orderId} is Completed`,
					text: `Hello ${name || 'Customer'}, your order #${orderId} has been completed. Thank you for shopping with us!`
				});
			}
		} catch {}

		return { success: true };
	}
};
