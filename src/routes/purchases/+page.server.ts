import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { order as orderTable, orderItem, product } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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

	const rows = await db
		.select({
			order_id: orderTable.id,
			status: orderTable.status,
			created_at: orderTable.created_at,
			quantity: orderItem.quantity,
			colors: orderItem.colors,
			price: orderItem.price,
			product_id: product.id,
			name: product.name,
			image: product.image,
			category: product.category
		})
		.from(orderTable)
		.leftJoin(orderItem, eq(orderItem.order_id, orderTable.id))
		.leftJoin(product, eq(product.id, orderItem.product_id))
		.where(eq(orderTable.account_id, Number(session.userId)));

	const byOrder = new Map<number, any>();
	for (const r of rows) {
		const id = Number(r.order_id);
		const status = (r.status ?? 'pending').toLowerCase();
		const entry = byOrder.get(id) ?? {
			id,
			status,
			created_at: r.created_at,
			items: [] as Array<any>,
			itemsTotal: 0,
			shippingFee: 36,
			totalAmount: 0
		};
		const item = {
			product_id: r.product_id,
			name: r.name,
			image: formatImage(r.image),
			colors: r.colors ?? [],
			quantity: Number(r.quantity ?? 0),
			price: parseFloat(r.price as unknown as string),
			category: r.category
		};
		entry.items.push(item);
		entry.itemsTotal += item.price * item.quantity;
		entry.totalAmount = entry.itemsTotal + entry.shippingFee;
		byOrder.set(id, entry);
	}

	const orders = Array.from(byOrder.values());
	return {
		pending: orders.filter((o) => o.status === 'pending'),
		for_delivery: orders.filter((o) => o.status === 'for_delivery'),
		completed: orders.filter((o) => o.status === 'completed'),
		cancelled: orders.filter((o) => o.status === 'cancelled'),
		estimatedDelivery: estimatedRange()
	};
};
