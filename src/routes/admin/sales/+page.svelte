<script lang="ts">
	export let data: {
		metrics: {
			totalSales: number;
			numTransactions: number;
			averageOrderValue: number;
			topChannel: string;
		};
		series: { labels: number[]; revenue: number[]; expense: number[]; profit: number[] };
		channels: { label: string; value: number }[];
	};

	let range: 'This Month' = 'This Month';

	function fmt(n: number) {
		return `₱${Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;
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

	function pieArcs(data: { label: string; value: number }[], cx: number, cy: number, r: number) {
		const total = data.reduce((a, b) => a + b.value, 0) || 1;
		let angle = -Math.PI / 2;
		const arcs: { d: string; label: string; percent: number }[] = [];
		for (const item of data) {
			const theta = (item.value / total) * Math.PI * 2;
			const x1 = cx + r * Math.cos(angle);
			const y1 = cy + r * Math.sin(angle);
			const x2 = cx + r * Math.cos(angle + theta);
			const y2 = cy + r * Math.sin(angle + theta);
			const large = theta > Math.PI ? 1 : 0;
			const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
			arcs.push({ d, label: item.label, percent: Math.round((item.value / total) * 100) });
			angle += theta;
		}
		return arcs;
	}

	const pieColors = ['#60A5FA', '#34D399', '#FBBF24', '#F472B6', '#A78BFA', '#F87171'];
</script>

<section class="min-h-screen bg-zinc-900 p-6 text-white">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Summary of Sales and Revenues</h1>
	</div>

	<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
		<div class="rounded-lg bg-gradient-to-br from-indigo-700/60 to-indigo-900/40 p-4">
			<div class="text-xs text-zinc-300">Total Sales</div>
			<div class="mt-2 text-2xl font-semibold">{fmt(data.metrics.totalSales)}</div>
			<div class="mt-1 text-xs text-zinc-400">vs Last Month</div>
		</div>
		<div class="rounded-lg bg-gradient-to-br from-green-700/60 to-green-900/40 p-4">
			<div class="text-xs text-zinc-300">No. of Transactions</div>
			<div class="mt-2 text-2xl font-semibold">{data.metrics.numTransactions}</div>
			<div class="mt-1 text-xs text-zinc-400">vs Last Month</div>
		</div>
		<div class="rounded-lg bg-gradient-to-br from-rose-700/60 to-rose-900/40 p-4">
			<div class="text-xs text-zinc-300">Average Order Value</div>
			<div class="mt-2 text-2xl font-semibold">{fmt(data.metrics.averageOrderValue)}</div>
			<div class="mt-1 text-xs text-zinc-400">vs Last Month</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
			<div class="mb-2 font-semibold">Monthly Overview</div>
			<svg viewBox="0 0 700 320" class="w-full rounded bg-zinc-900/40">
				<line x1="20" y1="300" x2="680" y2="300" stroke="#3f3f46" stroke-width="1" />
				<line x1="20" y1="20" x2="20" y2="300" stroke="#3f3f46" stroke-width="1" />
				<polyline
					fill="none"
					stroke="#FBBF24"
					stroke-width="2"
					points={toPoints(data.series.revenue, 700, 320)}
				/>
				<polyline
					fill="none"
					stroke="#34D399"
					stroke-width="2"
					points={toPoints(data.series.expense, 700, 320)}
				/>
				<polyline
					fill="none"
					stroke="#F87171"
					stroke-width="2"
					points={toPoints(data.series.profit, 700, 320)}
				/>
			</svg>
			<div class="mt-2 flex items-center justify-center gap-4 text-xs">
				<div class="flex items-center gap-1">
					<span class="h-2 w-2 rounded-full" style="background:#FBBF24"></span>Revenue
				</div>
				<div class="flex items-center gap-1">
					<span class="h-2 w-2 rounded-full" style="background:#34D399"></span>Expense
				</div>
				<div class="flex items-center gap-1">
					<span class="h-2 w-2 rounded-full" style="background:#F87171"></span>Profit
				</div>
			</div>
		</div>

		<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
			<div class="mb-2 font-semibold">Sales by Channel</div>
			<svg viewBox="0 0 360 320" class="mx-auto block w-80">
				{#each pieArcs(data.channels, 160, 150, 120) as arc, i}
					<path
						d={arc.d}
						fill={pieColors[i % pieColors.length]}
						stroke="#111827"
						stroke-width="1"
					/>
				{/each}
			</svg>
			<div class="mt-2 grid grid-cols-2 gap-2 text-xs">
				{#each data.channels as c, i}
					<div class="flex items-center gap-2">
						<span class="h-2 w-2 rounded-sm" style={`background:${pieColors[i % pieColors.length]}`}
						></span>
						<span>{c.label}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
