<script lang="ts">
	export let data: {
		items: Array<{
			reviewId: string;
			customer: string;
			product: string;
			rating: number;
			comment: string;
			date: any;
			status: 'Approved' | 'Pending' | 'Flagged';
		}>;
		average: number;
		distribution: Array<{ star: number; count: number }>;
	};

	let search = '';
	let ratingStar: 'All' | 1 | 2 | 3 | 4 | 5 = 'All';
	let ratingStatus: 'All' | 'Approved' | 'Pending' | 'Flagged' = 'All';
	let dateFrom: string = '';
	let dateTo: string = '';

	function fmtDate(d: any) {
		try {
			return new Date(d).toLocaleDateString();
		} catch {
			return '';
		}
	}

	function starRow(n: number) {
		return Array.from({ length: 5 }, (_, i) => i < n);
	}

	type Review = {
		reviewId: string;
		customer: string;
		product: string;
		rating: number;
		comment: string;
		date: any;
		status: 'Approved' | 'Pending' | 'Flagged';
	};

	// Core function: filters and sorts reviews
	function filterAndSortReviews(
		reviews: Review[],
		ratingStar: 'All' | 1 | 2 | 3 | 4 | 5,
		dateFrom: string,
		dateTo: string
	): Review[] {
		const from = dateFrom ? new Date(dateFrom + 'T00:00:00') : null;
		const to = dateTo ? new Date(dateTo + 'T23:59:59.999') : null;

		const filtered = reviews.filter((r) => {
			// Filter by rating (if not 'All')
			if (ratingStar !== 'All' && r.rating !== ratingStar) return false;

			// Filter by date range
			const d = new Date(r.date);
			if (isNaN(d.getTime())) return false;
			if (from && d < from) return false;
			if (to && d > to) return false;

			return true;
		});

		// Sort by most recent date (newest first)
		return filtered.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);
	}

	function maxDist() {
		return Math.max(1, ...data.distribution.map((d) => d.count));
	}

	// Reactive derived list
	$: filteredReviews = filterAndSortReviews(data.items, ratingStar, dateFrom, dateTo);
</script>

<section class="min-h-screen bg-zinc-900 p-4 text-white">
	<h1 class="mb-4 text-2xl font-bold">Customer Feedback</h1>

	<div class="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
		<div class="md:col-span-2">
			<label for="search" class="mb-1 block text-sm text-zinc-300">Search</label>
			<input
				id="search"
				bind:value={search}
				class="h-10 w-full rounded-md bg-zinc-800 px-3 text-sm"
				placeholder="Search"
			/>
		</div>
		<div>
			<label for="dateFrom" class="mb-1 block text-sm text-zinc-300">Date From</label>
			<input
				id="dateFrom"
				type="date"
				bind:value={dateFrom}
				class="h-10 w-full rounded-md bg-zinc-800 px-3 text-sm"
			/>
		</div>
		<div>
			<label for="dateTo" class="mb-1 block text-sm text-zinc-300">Date To</label>
			<input
				id="dateTo"
				type="date"
				bind:value={dateTo}
				class="h-10 w-full rounded-md bg-zinc-800 px-3 text-sm"
			/>
		</div>
		<div>
			<label for="ratingStar" class="mb-1 block text-sm text-zinc-300">Rating Star</label>
			<select
				id="ratingStar"
				bind:value={ratingStar}
				class="h-10 w-full rounded-md bg-zinc-800 text-sm"
			>
				<option>All</option>
				<option value={5}>5</option>
				<option value={4}>4</option>
				<option value={3}>3</option>
				<option value={2}>2</option>
				<option value={1}>1</option>
			</select>
		</div>
	</div>

	<div class="rounded-lg border border-zinc-700 bg-zinc-800">
		<div class="px-4 py-3 text-lg font-semibold">Average Rating</div>
		<div class="border-t border-zinc-700 px-4 py-3">
			<div class="mb-3 text-sm text-zinc-300">Total Reviews</div>
			<div class="space-y-2">
				{#each data.distribution as d}
					<div class="flex items-center gap-3 text-sm">
						<div class="w-4 text-right">{d.star}</div>
						<div class="h-2 flex-1 rounded bg-zinc-700">
							<div
								class="h-2 rounded bg-yellow-400"
								style={`width: ${Math.round((d.count / maxDist()) * 100)}%`}
							></div>
						</div>
						<div class="w-10 text-zinc-400">{d.count}</div>
					</div>
				{/each}
			</div>
			<div class="mt-4 text-sm text-zinc-300">Average: {data.average.toFixed(2)} / 5</div>
		</div>
	</div>

	<div class="mt-4 overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-800">
		<table class="w-full text-left text-sm">
			<thead class="bg-zinc-700 text-xs text-zinc-300 uppercase">
				<tr>
					<th class="px-4 py-2">Review ID</th>
					<th class="px-4 py-2">Customer Name</th>
					<th class="px-4 py-2">Product</th>
					<th class="px-4 py-2">Rating</th>
					<th class="px-4 py-2">Comment</th>
					<th class="px-4 py-2">Date</th>
					<th class="px-4 py-2">Status</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredReviews as r}
					<tr class="border-t border-zinc-700">
						<td class="px-4 py-2">{r.reviewId}</td>
						<td class="px-4 py-2">{r.customer}</td>
						<td class="px-4 py-2">{r.product}</td>
						<td class="px-4 py-2">
							<div class="flex items-center gap-1">
								{#each starRow(r.rating) as on}
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill={on ? '#FACC15' : 'none'}
										stroke="#FACC15"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<polygon
											points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2"
										/>
									</svg>
								{/each}
							</div>
						</td>
						<td class="px-4 py-2">{r.comment}</td>
						<td class="px-4 py-2">{fmtDate(r.date)}</td>
						<td class="px-4 py-2">
							<span
								class="rounded px-2 py-1 text-xs"
								class:!bg-green-700={r.status === 'Approved'}
								class:!bg-yellow-700={r.status === 'Pending'}
								class:!bg-red-700={r.status === 'Flagged'}
								style="background-color: rgb(63,63,70);"
							>
								{r.status}
							</span>
						</td>
					</tr>
				{/each}

				{#if filteredReviews.length === 0}
					<tr>
						<td colspan="8" class="px-4 py-6 text-center text-zinc-400">
							No feedback found.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</section>
