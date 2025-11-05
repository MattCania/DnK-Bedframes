import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { payment, order as orderTable, orderItem } from '$lib/server/db/schema';
import { and, between, eq } from 'drizzle-orm';

function startEndOfThisMonth() {
	const now = new Date();
	const start = new Date(now.getFullYear(), now.getMonth(), 1);
	const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
	return { start, end };
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session || session.role !== 'admin') throw redirect(303, '/');

	const { start, end } = startEndOfThisMonth();
	const rows = await db
		.select({
			amount: payment.amount,
			method: payment.method,
			date: payment.date,
			status: payment.status
		})
		.from(payment)
		.where(between(payment.date, start, end));

	const toNumber = (v: unknown) => parseFloat((v as any) ?? '0') || 0;

	// Payment-derived helpers for revenue chart and channels
	const channels = new Map<string, number>();
	const byDay = new Map<number, number>();
	for (const r of rows) {
		const amt = toNumber(r.amount);
		channels.set(r.method ?? 'Unknown', (channels.get(r.method ?? 'Unknown') ?? 0) + amt);
		const d = new Date(r.date as any).getDate();
		byDay.set(d, (byDay.get(d) ?? 0) + amt);
	}

	const daysInMonth = end.getDate();
	const revenue = Array.from({ length: daysInMonth }, (_, i) => byDay.get(i + 1) ?? 0);

	// Profit: only from COMPLETED orders, sum of order items (price * qty) this month
	const completedRows = await db
		.select({
			orderId: orderTable.id,
			created: orderTable.created_at,
			price: orderItem.price,
			qty: orderItem.quantity
		})
		.from(orderTable)
		.leftJoin(orderItem, eq(orderItem.order_id, orderTable.id))
		.where(and(eq(orderTable.status, 'completed'), between(orderTable.created_at, start, end)));

	const byDayProfit = new Map<number, number>();
	for (const r of completedRows) {
		const amt = toNumber(r.price) * Number(r.qty ?? 0);
		const d = new Date(r.created as any).getDate();
		byDayProfit.set(d, (byDayProfit.get(d) ?? 0) + amt);
	}
	const profit = Array.from({ length: daysInMonth }, (_, i) => byDayProfit.get(i + 1) ?? 0);

	// Metrics from COMPLETED orders: total sales, number of transactions, and average order value
	const orderTotals = new Map<number, number>();
	for (const r of completedRows) {
		const amt = toNumber(r.price) * Number(r.qty ?? 0);
		orderTotals.set(r.orderId as number, (orderTotals.get(r.orderId as number) ?? 0) + amt);
	}
	const totalSales = Array.from(orderTotals.values()).reduce((a, b) => a + b, 0);
	const numTransactions = orderTotals.size;
	const averageOrderValue = numTransactions ? totalSales / numTransactions : 0;

	// Simple visual expense placeholder unrelated to profit constraint
	const expense = revenue.map((v) => v * 0.3);

	const channelBreakdown = Array.from(channels.entries()).map(([label, value]) => ({
		label,
		value
	}));
	const topChannel = channelBreakdown.sort((a, b) => b.value - a.value)[0]?.label ?? '—';

	return {
		metrics: {
			totalSales,
			numTransactions,
			averageOrderValue,
			topChannel
		},
		series: {
			labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
			revenue,
			expense,
			profit
		},
		channels: channelBreakdown
	};
};
