<script lang="ts">
	export let data: {
		metrics: {
			totalRevenue: number;
			totalExpenses: number;
			netProfit: number;
			profitMargin: number;
		};
		remittances: { label: string; total: number; count: number }[];
		series: { labels: number[]; revenue: number[]; expense: number[]; profit: number[] };
		expenseCategories: { Materials: number[]; Labor: number[]; Shipping: number[] };
		salesByProduct: number[];
	};

	function money(n: number) {
		return `₱${Number(n || 0).toLocaleString('en-PH')}`;
	}

	function toPoints(values: number[], w: number, h: number, pad = 20) {
		const max = Math.max(1, ...values);
		const stepX = (w - pad * 2) / Math.max(1, values.length - 1);
		return values
			.map((v, i) => {
				const x = pad + i * stepX;
				const y = h - pad - (v / max) * (h - pad * 2);
				return `${x},${y}`;
			})
			.join(' ');
	}

	const colorRevenue = '#FBBF24';
	const colorExpense = '#34D399';
	const colorProfit = '#F87171';
</script>

<section class="min-h-screen bg-zinc-900 p-6 text-white">
	<h1 class="mb-6 text-3xl font-extrabold">Overall Summary</h1>

	<!-- Top KPI cards -->
	<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
		<div class="rounded-lg bg-gradient-to-br from-indigo-700/60 to-indigo-900/40 p-4">
			<div class="text-xs text-zinc-300">Total Revenue</div>
			<div class="mt-2 text-2xl font-semibold">{money(data.metrics.totalRevenue)}</div>
			<div class="mt-1 text-xs text-zinc-400">12% from This Month</div>
		</div>
		<div class="rounded-lg bg-gradient-to-br from-green-700/60 to-green-900/40 p-4">
			<div class="text-xs text-zinc-300">Total Expenses</div>
			<div class="mt-2 text-2xl font-semibold">{money(data.metrics.totalExpenses)}</div>
			<div class="mt-1 text-xs text-zinc-400">8% from This Month</div>
		</div>
		<div class="rounded-lg bg-gradient-to-br from-rose-700/60 to-rose-900/40 p-4">
			<div class="text-xs text-zinc-300">Net Profit</div>
			<div class="mt-2 text-2xl font-semibold">{money(data.metrics.netProfit)}</div>
			<div class="mt-1 text-xs text-zinc-400">12% from This Month</div>
		</div>
		<!-- <div class="rounded-lg bg-gradient-to-br from-purple-700/60 to-purple-900/40 p-4">
			<div class="text-xs text-zinc-300">Cash Remittance</div>
			<div class="mt-2 text-2xl font-semibold">{data.metrics.profitMargin.toFixed(0)}%</div>
			<div class="mt-1 text-xs text-zinc-400"> Transactions</div>
		</div> -->
	</div>

	<!-- Remittance summary cards -->
	<!-- <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
		{#each data.remittances as r}
			<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
				<div class="text-xs text-zinc-400">{r.label}</div>
				<div class="mt-2 text-xl font-semibold">{money(r.total)}</div>
				<div class="text-xs text-zinc-400">{r.count} Transactions</div>
			</div>
		{/each}
	</div> -->

	<!-- Charts grid -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
			<div class="mb-2 flex items-center justify-between">
				<div class="font-semibold">Monthly Overview</div>
			</div>
			<svg viewBox="0 0 700 320" class="w-full rounded bg-zinc-900/40">
				<line x1="20" y1="300" x2="680" y2="300" stroke="#3f3f46" stroke-width="1" />
				<line x1="20" y1="20" x2="20" y2="300" stroke="#3f3f46" stroke-width="1" />
				<polyline
					fill="none"
					stroke={colorRevenue}
					stroke-width="2"
					points={toPoints(data.series.revenue, 700, 320)}
				/>
				<polyline
					fill="none"
					stroke={colorExpense}
					stroke-width="2"
					points={toPoints(data.series.expense, 700, 320)}
				/>
				<polyline
					fill="none"
					stroke={colorProfit}
					stroke-width="2"
					points={toPoints(data.series.profit, 700, 320)}
				/>
			</svg>
			<div class="mt-2 flex items-center justify-center gap-4 text-xs">
				<div class="flex items-center gap-1">
					<span class="h-2 w-2 rounded-full" style={`background:${colorRevenue}`}></span>Revenue
				</div>
				<div class="flex items-center gap-1">
					<span class="h-2 w-2 rounded-full" style={`background:${colorExpense}`}></span>Expenses
				</div>
				<div class="flex items-center gap-1">
					<span class="h-2 w-2 rounded-full" style={`background:${colorProfit}`}></span>Profit
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
				<div class="mb-2 font-semibold">Expense Categories</div>
				<svg viewBox="0 0 700 200" class="w-full rounded bg-zinc-900/40">
					<line x1="20" y1="180" x2="680" y2="180" stroke="#3f3f46" stroke-width="1" />
					<line x1="20" y1="20" x2="20" y2="180" stroke="#3f3f46" stroke-width="1" />
					<polyline
						fill="none"
						stroke="#60A5FA"
						stroke-width="2"
						points={toPoints(data.expenseCategories.Materials, 700, 200)}
					/>
					<polyline
						fill="none"
						stroke="#A78BFA"
						stroke-width="2"
						points={toPoints(data.expenseCategories.Labor, 700, 200)}
					/>
					<polyline
						fill="none"
						stroke="#F472B6"
						stroke-width="2"
						points={toPoints(data.expenseCategories.Shipping, 700, 200)}
					/>
				</svg>
			</div>
			<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
				<div class="mb-2 font-semibold">Sales by Product</div>
				<svg viewBox="0 0 700 200" class="w-full rounded bg-zinc-900/40">
					<line x1="20" y1="180" x2="680" y2="180" stroke="#3f3f46" stroke-width="1" />
					<line x1="20" y1="20" x2="20" y2="180" stroke="#3f3f46" stroke-width="1" />
					<polyline
						fill="none"
						stroke="#FBBF24"
						stroke-width="2"
						points={toPoints(data.salesByProduct, 700, 200)}
					/>
				</svg>
			</div>
		</div>
	</div>
</section>
