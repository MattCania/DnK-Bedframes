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
		insights: { monthlyRevenue: number; topBuyer: string; topCategory: string };
		stock: { lowStock: number; total: number };
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
	let category: 'All' | 'twin' | 'full' | 'queen' | 'king' = 'All';
	let search = '';

	// Client-side pagination
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
	function filtered() {
		return (data.sales || []).filter((s) => {
			const mOk =
				month === 'All' ? true : new Date(s.date).getMonth() + 1 === monthNames.indexOf(month);
			const catOk = category === 'All' ? true : true; // Category filter placeholder (can be wired to server if needed)
			const q = search.trim().toLowerCase();
			const text = `${s.buyer} ${s.item}`.toLowerCase();
			const qOk = q ? text.includes(q) : true;
			return mOk && catOk && qOk;
		});
	}
	function paged() {
		const start = (page - 1) * pageSize;
		return filtered().slice(start, start + pageSize);
	}
	function pageCount() {
		return Math.max(1, Math.ceil(filtered().length / pageSize));
	}

	function printPDF() {
		window.print();
	}

	onMount(() => {
		page = 1;
	});
</script>

<section class="min-h-screen bg-zinc-900 p-4 text-white">
	<h1 class="mb-4 text-2xl font-bold">Customer Reports and Inquiries</h1>

	<!-- Filters -->
	<div class="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
		<div>
			<label for="monthSel" class="mb-1 block text-sm text-zinc-300">Month:</label>
			<select id="monthSel" bind:value={month} class="h-10 w-full rounded-md bg-zinc-800 text-sm">
				{#each monthNames as m}
					<option value={m}>{m}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="categorySel" class="mb-1 block text-sm text-zinc-300">Category:</label>
			<select
				id="categorySel"
				bind:value={category}
				class="h-10 w-full rounded-md bg-zinc-800 text-sm"
			>
				<option>All</option>
				<option value="twin">Twin</option>
				<option value="full">Full</option>
				<option value="queen">Queen</option>
				<option value="king">King</option>
			</select>
		</div>
		<div class="md:col-span-2">
			<label for="searchInput" class="mb-1 block text-sm text-zinc-300">Search:</label>
			<input
				id="searchInput"
				type="search"
				bind:value={search}
				placeholder="Placeholder"
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
					Showing {Math.min(filtered().length, (page - 1) * pageSize + 1)}–{Math.min(
						page * pageSize,
						filtered().length
					)} of {filtered().length}
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
						{#each paged() as r}
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
						{#if paged().length === 0}
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
					<div class="mt-2 rounded bg-zinc-700 p-2 text-xs">
						{data.stock.lowStock} products are low on stock.
					</div>
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
					<div class="text-zinc-400">Monthly Revenue</div>
					<div class="text-right">{fmtCurrency(data.insights.monthlyRevenue)}</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Bottom row -->
	<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
		<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4 md:col-span-2">
			<div class="mb-3 font-semibold">Customer Inquiries</div>
			{#if (data.inquiries?.length ?? 0) === 0}
				<p class="text-sm text-zinc-400">No recent inquiries.</p>
			{:else}
				<ul class="space-y-3">
					{#each data.inquiries as q}
						<li class="rounded border border-zinc-700 p-3">
							<div class="text-sm font-medium">{q.firstname ?? ''} {q.lastname ?? ''}</div>
							<div class="text-xs text-zinc-400">{fmtDate(q.created_at)}</div>
							<div class="mt-2 text-sm">{q.comment}</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
			<div class="mb-3 font-semibold">From Contact Us form</div>
			<p class="text-sm text-zinc-400">
				This section can be wired to your contact form submissions.
			</p>
			<div class="mt-3 flex gap-2">
				<button class="rounded bg-zinc-700 px-3 py-1 text-sm">Reply</button>
				<button class="rounded bg-zinc-700 px-3 py-1 text-sm">Mark as replied</button>
			</div>
		</div>
	</div>

	<div class="mt-4">
		<button on:click={printPDF} class="rounded bg-zinc-700 px-3 py-2 text-sm">Export PDF</button>
	</div>
</section>

<style>
	@media print {
		/* Basic print-friendly theme */
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
