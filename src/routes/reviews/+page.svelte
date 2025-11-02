<script lang="ts">
	export let data: {
		items: Array<{ id: number; product: string; rating: number; comment: string; date: any }>;
	};

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
</script>

<section class="min-h-screen bg-white pt-24">
	<div class="mx-auto max-w-5xl px-4 md:px-6">
		<h1 class="mb-4 text-2xl font-bold text-gray-900">My Reviews</h1>

		{#if data.items.length === 0}
			<p class="text-gray-600">You haven't written any reviews yet.</p>
		{:else}
			<div class="space-y-4">
				{#each data.items as r (r.id)}
					<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
						<div class="flex flex-wrap items-center justify-between gap-3">
							<div class="text-lg font-semibold text-gray-900">{r.product}</div>
							<div class="flex items-center gap-1">
								{#each starRow(r.rating) as on}
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill={on ? '#F59E0B' : 'none'}
										stroke="#F59E0B"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><polygon
											points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2"
										/></svg
									>
								{/each}
							</div>
						</div>
						{#if r.comment}
							<div class="mt-2 whitespace-pre-line text-gray-700">{r.comment}</div>
						{/if}
						<div class="mt-2 text-sm text-gray-500">{fmtDate(r.date)}</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
	<div class="h-8"></div>
	<img src="/logo.png" alt="D&K" class="mx-auto mb-8 h-14 w-14 rounded bg-white p-1" />
</section>
