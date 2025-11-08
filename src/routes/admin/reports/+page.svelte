<script lang="ts">
	import { onMount } from 'svelte';

	export let data: {
		sales: Array<{
			orderId: number;
			date: any;
			buyer: string;
			item: string;
			qty: number;
			price: number;
			stockLeft: number;
			status: string;
		}>;
		insights: { monthlyRevenue: number; topBuyer: string; topCategory: string; topProduct: string };
		stock: {
			lowStock: number;
			total: number;
			items: Array<{ id: number; name: string; stock: number }>;
		};
		inquiries: Array<{
			id: number;
			comment: string | null;
			created_at: any;
			firstname: string | null;
			lastname: string | null;
		}>;
	};

	type Month =
		| 'All'
		| 'January'
		| 'February'
		| 'March'
		| 'April'
		| 'May'
		| 'June'
		| 'July'
		| 'August'
		| 'September'
		| 'October'
		| 'November'
		| 'December';
	const monthNames: Month[] = [
		'All',
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	let month: Month = 'All';
	let search = '';

	let page = 1;
	const pageSize = 5;

	function fmtCurrency(n: number) {
		return `₱ ${Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;
	}
	function fmtDate(d: any) {
		try {
			const dt = new Date(d);
			return dt.toLocaleDateString();
		} catch {
			return '';
		}
	}

	// Filter sales
	function filteredSales() {
		return (data.sales || []).filter((s) => {
			const monthOk =
				month === 'All' ? true : new Date(s.date).getMonth() + 1 === monthNames.indexOf(month);
			const q = search.trim().toLowerCase();
			const text = `${s.buyer} ${s.item}`.toLowerCase();
			const queryOk = q ? text.includes(q) : true;
			return monthOk && queryOk;
		});
	}

	// Filter inquiries
	function filteredInquiries() {
		return (data.inquiries || []).filter((q) => {
			const monthOk =
				month === 'All'
					? true
					: new Date(q.created_at).getMonth() + 1 === monthNames.indexOf(month);
			const s = search.trim().toLowerCase();
			const text = `${q.firstname ?? ''} ${q.lastname ?? ''} ${q.comment ?? ''}`.toLowerCase();
			const queryOk = s ? text.includes(s) : true;
			return monthOk && queryOk;
		});
	}

	function pagedSales() {
		const start = (page - 1) * pageSize;
		return filteredSales().slice(start, start + pageSize);
	}

	function pageCount() {
		return Math.max(1, Math.ceil(filteredSales().length / pageSize));
	}

	// Reset pagination when filters change
	$: month, search, (page = 1);

	onMount(() => {
		page = 1;
	});

	let showLowStock = false;

	function openLowStock() {
		if ((data.stock?.lowStock ?? 0) > 0) showLowStock = true;
	}
	function closeLowStock() {
		showLowStock = false;
	}
</script>

<section class="min-h-screen bg-zinc-900 p-4 text-white">
	<h1 class="mb-4 text-2xl font-bold">Customer Reports and Inquiries</h1>

	<!-- Filters -->
	<div class="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
		<div>
			<label for="monthSel" class="mb-1 block text-sm text-zinc-300">Month:</label>
			<select id="monthSel" bind:value={month} class="h-10 w-full rounded-md bg-zinc-800 text-sm">
				{#each monthNames as m}
					<option value={m}>{m}</option>
				{/each}
			</select>
		</div>
		<div class="md:col-span-2">
			<label for="searchInput" class="mb-1 block text-sm text-zinc-300">Search:</label>
			<input
				id="searchInput"
				type="search"
				bind:value={search}
				placeholder="Search buyer, item, or inquiry"
				class="h-10 w-full rounded-md bg-zinc-800 px-3 text-sm"
			/>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<!-- Sales Report -->
		<div class="rounded-lg border border-zinc-700 bg-zinc-800 md:col-span-2">
			<div class="flex items-center justify-between px-4 py-3">
				<div class="font-semibold">Sales Report</div>
				<div class="text-xs text-zinc-400">
					Showing {Math.min(filteredSales().length, (page - 1) * pageSize + 1)}–{Math.min(
						page * pageSize,
						filteredSales().length
					)} of {filteredSales().length}
				</div>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead class="bg-zinc-700 text-xs text-zinc-300 uppercase">
						<tr>
							<th class="px-4 py-2">Buyer</th>
							<th class="px-4 py-2">Item</th>
							<th class="px-4 py-2">Qty</th>
							<th class="px-4 py-2">Price</th>
							<th class="px-4 py-2">Stock Left</th>
							<th class="px-4 py-2">Date</th>
							<th class="px-4 py-2">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each pagedSales() as r}
							<tr class="border-t border-zinc-700">
								<td class="px-4 py-2">{r.buyer}</td>
								<td class="px-4 py-2">{r.item}</td>
								<td class="px-4 py-2">{r.qty}</td>
								<td class="px-4 py-2">{fmtCurrency(r.price)}</td>
								<td class="px-4 py-2">{r.stockLeft}</td>
								<td class="px-4 py-2">{fmtDate(r.date)}</td>
								<td class="px-4 py-2">{r.status}</td>
							</tr>
						{/each}
						{#if pagedSales().length === 0}
							<tr><td class="px-4 py-6 text-center text-zinc-400" colspan="7">No results</td></tr>
						{/if}
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div class="flex items-center justify-center gap-1 px-4 py-3">
				{#each Array(pageCount()) as _, i}
					<button
						on:click={() => (page = i + 1)}
						class="h-8 w-8 rounded bg-zinc-700 text-sm {page === i + 1 ? 'bg-zinc-600' : ''}"
						>{i + 1}</button
					>
				{/each}
			</div>
		</div>

		<!-- Right column cards -->
		<div class="space-y-4">
			<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
				<div class="mb-2 text-sm text-zinc-300">Stock Status</div>
				<div class="text-xs text-zinc-400">
					{data.stock.lowStock > 0 ? 'Low / Out of Stocks Alerts' : 'All stocks are good!'}
				</div>
				{#if data.stock.lowStock > 0}
					<button
						class="mt-2 w-full rounded bg-zinc-700 p-2 text-left text-xs hover:bg-zinc-600"
						on:click={openLowStock}
					>
						{data.stock.lowStock} products are low on stock. Click to view.
					</button>
				{:else}
					<div class="mt-2 rounded bg-zinc-700 p-2 text-xs">All stocks are good!</div>
				{/if}
			</div>

			<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
				<div class="mb-2 text-sm text-zinc-300">Quick Insights</div>
				<div class="grid grid-cols-2 gap-3 text-sm">
					<div class="text-zinc-400">Top Category</div>
					<div class="text-right">{data.insights.topCategory}</div>
					<div class="text-zinc-400">Top Buyer</div>
					<div class="text-right">{data.insights.topBuyer}</div>
					<div class="text-zinc-400">Top Product</div>
					<div class="text-right">{data.insights.topProduct}</div>
					<div class="text-zinc-400">Monthly Revenue</div>
					<div class="text-right">{fmtCurrency(data.insights.monthlyRevenue)}</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-4">
		<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
			<div class="mb-3 font-semibold">Customer Inquiries</div>
			{#if filteredInquiries().length === 0}
				<p class="text-sm text-zinc-400">No inquiries found.</p>
			{:else}
				<ul class="space-y-3">
					{#each filteredInquiries() as q}
						<li class="rounded border border-zinc-700 p-3">
							<div class="text-sm font-medium">{q.firstname ?? ''} {q.lastname ?? ''}</div>
							<div class="text-xs text-zinc-400">{fmtDate(q.created_at)}</div>
							<div class="mt-2 text-sm">{q.comment}</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>

	{#if showLowStock}
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<button
				type="button"
				class="absolute inset-0 bg-black/60"
				aria-label="Close"
				on:click={closeLowStock}
			></button>
			<div
				class="relative z-10 w-full max-w-lg rounded-lg border border-zinc-700 bg-zinc-800 p-4 text-white shadow-xl"
			>
				<div class="mb-2 flex items-center justify-between">
					<div class="font-semibold">Low Stock Products</div>
					<button class="rounded bg-zinc-700 px-2 py-1 text-xs" on:click={closeLowStock}
						>Close</button
					>
				</div>
				{#if (data.stock.items?.length ?? 0) === 0}
					<div class="text-sm text-zinc-400">No low stock products.</div>
				{:else}
					<div class="max-h-80 overflow-y-auto">
						<table class="w-full text-left text-sm">
							<thead class="bg-zinc-700 text-xs text-zinc-300 uppercase">
								<tr>
									<th class="px-3 py-2">Product</th>
									<th class="px-3 py-2">Stock</th>
								</tr>
							</thead>
							<tbody>
								{#each data.stock.items as p}
									<tr class="border-t border-zinc-700">
										<td class="px-3 py-2">{p.name}</td>
										<td class="px-3 py-2">{p.stock}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</section>

<style>
	@media print {
		section {
			background: white !important;
			color: black !important;
		}
		button {
			display: none !important;
		}
		select,
		input {
			border: none !important;
			background: transparent !important;
		}
	}
</style>
