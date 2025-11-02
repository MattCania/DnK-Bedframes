import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { order as orderTable, orderItem, product, accounts } from '$lib/server/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

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
		await db.update(orderTable).set({ status: 'for_delivery' }).where(eq(orderTable.id, orderId));
		return { success: true };
	},
	deny: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session || session.role !== 'admin') return fail(403, { message: 'Forbidden' });
		const fd = await request.formData();
		const orderId = Number(fd.get('order_id'));
		if (!orderId) return fail(400, { message: 'Invalid order id' });
		await db.update(orderTable).set({ status: 'cancelled' }).where(eq(orderTable.id, orderId));
		return { success: true };
	},
	complete: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session || session.role !== 'admin') return fail(403, { message: 'Forbidden' });
		const fd = await request.formData();
		const orderId = Number(fd.get('order_id'));
		if (!orderId) return fail(400, { message: 'Invalid order id' });
		await db.update(orderTable).set({ status: 'completed' }).where(eq(orderTable.id, orderId));
		return { success: true };
	}
};
