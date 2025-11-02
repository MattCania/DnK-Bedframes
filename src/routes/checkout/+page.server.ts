import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { accounts, cart, product, order as orderTable, orderItem } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

const FLAT_SHIPPING_FEE = 36;

function formatImage(img: unknown) {
	if (!img) return null;
	try {
		return `data:image/jpeg;base64,${Buffer.from(img as any).toString('base64')}`;
	} catch {
		return null;
	}
}

function estimatedRange() {
	const now = new Date();
	const start = new Date(now);
	start.setDate(start.getDate() + 3);
	const end = new Date(now);
	end.setDate(end.getDate() + 7);
	const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
	return `${start.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', opts)}`;
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session) throw redirect(303, '/login');

	// Load account info
	let account: typeof accounts.$inferSelect | null = null;
	try {
		const [row] = await db
			.select()
			.from(accounts)
			.where(eq(accounts.id, Number(session.userId)));
		account = row ?? null;
	} catch {
		account = null;
	}

	const rows = await db
		.select({
			id: cart.id,
			quantity: cart.quantity,
			colors: cart.colors,
			category: cart.category,
			product_id: cart.product_id,
			name: product.name,
			price: product.price,
			image: product.image
		})
		.from(cart)
		.leftJoin(product, eq(product.id, cart.product_id))
		.where(eq(cart.account_id, Number(session.userId)));

	const items = rows.map((r) => ({
		id: r.id,
		product_id: r.product_id,
		name: r.name,
		price: parseFloat(r.price as unknown as string),
		quantity: r.quantity ?? 0,
		colors: r.colors ?? [],
		category: r.category,
		image: formatImage(r.image)
	}));

	const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
	const shippingFee = items.length > 0 ? FLAT_SHIPPING_FEE : 0;
	const totalAmount = itemsTotal + shippingFee;

	return {
		items,
		itemsTotal,
		shippingFee,
		totalAmount,
		estimatedDelivery: estimatedRange(),
		account: account
	};
};

export const actions: Actions = {
	purchase: async ({ locals }) => {
		const session = await locals.auth();
		if (!session) return fail(401, { message: 'Not logged in' });

		const rows = await db
			.select({
				id: cart.id,
				quantity: cart.quantity,
				colors: cart.colors,
				product_id: cart.product_id,
				price: product.price
			})
			.from(cart)
			.leftJoin(product, eq(product.id, cart.product_id))
			.where(eq(cart.account_id, Number(session.userId)));

		if (!rows.length) return fail(400, { message: 'Cart is empty' });

		const inserted = await db
			.insert(orderTable)
			.values({ status: 'pending', account_id: Number(session.userId) })
			.returning({ id: orderTable.id });
		const orderId = inserted[0]?.id;
		if (!orderId) return fail(500, { message: 'Failed to create order' });

		for (const r of rows) {
			await db.insert(orderItem).values({
				colors: r.colors ?? [],
				quantity: Number(r.quantity ?? 0),
				price: r.price as any,
				order_id: orderId,
				product_id: Number(r.product_id)
			});
		}

		await db.delete(cart).where(eq(cart.account_id, Number(session.userId)));

		throw redirect(303, '/account');
	}
};
