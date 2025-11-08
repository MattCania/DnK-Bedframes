import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { payment, order, orderItem } from '$lib/server/db/schema';
import { and, between, eq } from 'drizzle-orm';

function monthRange() {
	const now = new Date();
	const start = new Date(now.getFullYear(), now.getMonth(), 1);
	const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
	return { start, end };
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session || session.role !== 'admin') throw redirect(303, '/');

	const { start, end } = monthRange();

	const payRows = await db
		.select({
			amount: payment.amount,
			method: payment.method,
			date: payment.date,
			status: payment.status
		})
		.from(payment)
		.where(between(payment.date, start, end));

	const toNumber = (v: unknown) => parseFloat((v as any) ?? '0') || 0;

	let totalRevenue = 0;
	let transactions = 0;
	const byDayRevenue = new Map<number, number>();
	const channels = new Map<string, { total: number; count: number }>();

	for (const p of payRows) {
		const amt = toNumber(p.amount);
		totalRevenue += amt;
		transactions++;
		const d = new Date(p.date as any).getDate();
		byDayRevenue.set(d, (byDayRevenue.get(d) ?? 0) + amt);
		const method = (p.method ?? 'Other').toString().toLowerCase();
		const key =
			method.includes('cash') && !method.includes('g')
				? 'Cash'
				: method.includes('g')
					? 'G-Cash'
					: method.includes('bank')
						? 'Bank'
						: method.includes('cheq')
							? 'Cheque'
							: 'Other';
		const entry = channels.get(key) ?? { total: 0, count: 0 };
		entry.total += amt;
		entry.count += 1;
		channels.set(key, entry);
	}

	const completedRows = await db
		.select({ created: order.created_at, price: orderItem.price, qty: orderItem.quantity })
		.from(order)
		.leftJoin(orderItem, eq(orderItem.order_id, order.id))
		.where(and(eq(order.status, 'completed'), between(order.created_at, start, end)));

	let netProfit = 0;
	const byDayProfit = new Map<number, number>();
	for (const r of completedRows) {
		const amt = toNumber(r.price) * Number(r.qty ?? 0);
		netProfit += amt;
		const d = new Date(r.created as any).getDate();
		byDayProfit.set(d, (byDayProfit.get(d) ?? 0) + amt);
	}

	const totalExpenses = totalRevenue * 0.46;
	const profitMargin = totalRevenue ? (netProfit / totalRevenue) * 100 : 0;

	const daysInMonth = end.getDate();
	const revenueSeries = Array.from({ length: daysInMonth }, (_, i) => byDayRevenue.get(i + 1) ?? 0);
	const expenseSeries = revenueSeries.map((v) => v * 0.46);
	const profitSeries = Array.from({ length: daysInMonth }, (_, i) => byDayProfit.get(i + 1) ?? 0);

	const expenseCats = {
		Materials: expenseSeries.map((v) => v * 0.5),
		Labor: expenseSeries.map((v) => v * 0.3),
		Shipping: expenseSeries.map((v) => v * 0.2)
	};

	const oiRows = await db
		.select({ price: orderItem.price, qty: orderItem.quantity, created: order.created_at })
		.from(order)
		.leftJoin(orderItem, eq(orderItem.order_id, order.id))
		.where(between(order.created_at, start, end));
	const byDayProduct = new Map<number, number>();
	for (const r of oiRows) {
		const amt = toNumber(r.price) * Number(r.qty ?? 0);
		const d = new Date(r.created as any).getDate();
		byDayProduct.set(d, (byDayProduct.get(d) ?? 0) + amt);
	}
	const productSeries = Array.from({ length: daysInMonth }, (_, i) => byDayProduct.get(i + 1) ?? 0);

	const channelCards = ['Cash', 'G-Cash', 'Bank', 'Cheque'].map((k) => ({
		label: k + ' Remittance',
		total: channels.get(k)?.total ?? 0,
		count: channels.get(k)?.count ?? 0
	}));

	return {
		metrics: {
			totalRevenue,
			totalExpenses,
			netProfit,
			profitMargin
		},
		remittances: channelCards,
		series: {
			labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
			revenue: revenueSeries,
			expense: expenseSeries,
			profit: profitSeries
		},
		expenseCategories: expenseCats,
		salesByProduct: productSeries
	};
};
