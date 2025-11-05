import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	order as orderTable,
	orderItem,
	product,
	accounts,
	payment,
	review
} from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

function peso(n: number) {
	return Number.isFinite(n) ? n : 0;
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session || session.role !== 'admin') throw redirect(303, '/');

	// Pull recent completed orders with their items and related product/account/payment
	const rows = await db
		.select({
			order_id: orderTable.id,
			created_at: orderTable.created_at,
			buyer_first: accounts.firstname,
			buyer_last: accounts.lastname,
			product_name: product.name,
			product_stock: product.stock,
			category: product.category,
			qty: orderItem.quantity,
			price: orderItem.price,
			status: payment.status,
			pay_date: payment.date
		})
		.from(orderTable)
		.leftJoin(orderItem, eq(orderItem.order_id, orderTable.id))
		.leftJoin(product, eq(product.id, orderItem.product_id))
		.leftJoin(accounts, eq(accounts.id, orderTable.account_id))
		.leftJoin(payment, eq(payment.order_id, orderTable.id))
		// Show both completed and for_delivery in case payments were captured pre-completion
		.where(eq(orderTable.status, 'completed'))
		.orderBy(desc(orderTable.created_at));

	const sales = rows
		.filter((r) => r.product_name && r.qty)
		.map((r) => ({
			orderId: r.order_id,
			date: r.created_at,
			buyer: `${r.buyer_first ?? ''} ${r.buyer_last ?? ''}`.trim() || '—',
			item: r.product_name,
			qty: Number(r.qty ?? 0),
			price: parseFloat((r.price as unknown as string) ?? '0'),
			stockLeft: Number(r.product_stock ?? 0),
			status: (r.status ?? 'Paid').toString()
		}));

	// Insights
	const now = new Date();
	const thisMonth = now.getMonth();
	const thisYear = now.getFullYear();
	let monthlyRevenue = 0;
	const byBuyer = new Map<string, number>();
	const byCategory = new Map<string, number>();
	const byProduct = new Map<string, number>();

	for (const s of sales) {
		const amt = peso(s.price) * s.qty;
		const d = new Date(s.date as any);
		if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) monthlyRevenue += amt;
		byBuyer.set(s.buyer, (byBuyer.get(s.buyer) ?? 0) + amt);
		byProduct.set(s.item || '—', (byProduct.get(s.item || '—') ?? 0) + amt);
		// Match category by the product row in rows array
		const row = rows.find((r) => r.order_id === s.orderId && r.product_name === s.item);
		const cat = (row?.category as unknown as string) ?? '—';
		byCategory.set(cat, (byCategory.get(cat) ?? 0) + amt);
	}

	const topBuyer = Array.from(byBuyer.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
	const topCategory = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
	const topProduct = Array.from(byProduct.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

	// Stock status
	const stocks = await db
		.select({ id: product.id, name: product.name, stock: product.stock })
		.from(product)
		.orderBy(desc(product.stock));
	const lowStockItems = stocks.filter((p) => (p.stock ?? 0) < 5);
	const lowStock = lowStockItems.length;

	// Inquiries: reuse latest product reviews (if any)
	const inquiries = await db
		.select({
			id: review.id,
			comment: review.comment,
			created_at: review.created_at,
			firstname: accounts.firstname,
			lastname: accounts.lastname
		})
		.from(review)
		.leftJoin(accounts, eq(accounts.id, review.account_id))
		.orderBy(desc(review.created_at))
		.limit(5);

	return {
		sales,
		insights: {
			monthlyRevenue,
			topBuyer,
			topCategory,
			topProduct
		},
		stock: {
			lowStock,
			total: stocks.length,
			items: lowStockItems
		},
		inquiries
	};
};
