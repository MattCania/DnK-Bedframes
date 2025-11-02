import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { payment } from '$lib/server/db/schema';
import { and, between } from 'drizzle-orm';

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

	// Metrics
	let totalSales = 0;
	const channels = new Map<string, number>();
	const byDay = new Map<number, number>();
	for (const r of rows) {
		const amt = toNumber(r.amount);
		totalSales += amt;
		channels.set(r.method ?? 'Unknown', (channels.get(r.method ?? 'Unknown') ?? 0) + amt);
		const d = new Date(r.date as any).getDate();
		byDay.set(d, (byDay.get(d) ?? 0) + amt);
	}
	const numTransactions = rows.length;
	const averageOrderValue = numTransactions ? totalSales / numTransactions : 0;

	const daysInMonth = end.getDate();
	const revenue = Array.from({ length: daysInMonth }, (_, i) => byDay.get(i + 1) ?? 0);
	// Placeholder series (no expenses table). Profit = Revenue, Expense = Revenue * 0.3 for visuals.
	const expense = revenue.map((v) => v * 0.3);
	const profit = revenue.map((v) => v - v * 0.3);

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
