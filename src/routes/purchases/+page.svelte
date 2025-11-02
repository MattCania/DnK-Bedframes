<script lang="ts">
	export let data: {
		pending: any[];
		for_delivery: any[];
		completed: any[];
		cancelled: any[];
		estimatedDelivery: string;
	};
	let tab: 'pending' | 'for_delivery' | 'completed' | 'cancelled' = 'for_delivery';

	const tabs = [
		{ id: 'pending', label: 'Pending' },
		{ id: 'for_delivery', label: 'For Delivery' },
		{ id: 'completed', label: 'Completed' },
		{ id: 'cancelled', label: 'Cancelled' }
	] as const;

	function itemsFor(t: typeof tab) {
		return data[t] ?? [];
	}
</script>

<section class="min-h-screen bg-white pt-24">
	<div class="mx-auto max-w-6xl px-4 md:px-6">
		<!-- Tabs -->
		<div class="flex overflow-x-auto rounded-md border border-gray-200 bg-gray-100 text-sm">
			{#each tabs as t}
				<button
					class="min-w-32 flex-1 px-4 py-3 font-medium focus:outline-none {tab === t.id
						? 'bg-white text-gray-900'
						: 'text-gray-600'}"
					onclick={() => (tab = t.id)}
				>
					{t.label}
				</button>
			{/each}
		</div>

		<!-- List -->
		<div class="mt-4 space-y-4">
			{#if itemsFor(tab).length === 0}
				<p class="text-gray-600">No items in this section.</p>
			{:else}
				{#each itemsFor(tab) as item (item.order_id + '-' + item.product_id)}
					<div
						class="flex items-center justify-between gap-4 rounded-md border border-gray-200 p-3"
					>
						<div class="flex items-center gap-3">
							{#if item.image}
								<img
									src={item.image}
									alt={item.name ?? ''}
									class="h-20 w-28 rounded object-cover"
								/>
							{/if}
							<div class="space-y-1">
								<div class="text-base font-semibold text-gray-900">{item.name}</div>
								<div class="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 text-xs">
									<div class="text-gray-500">Color:</div>
									<select class="h-7 w-32 rounded border-gray-300 text-sm" disabled>
										<option selected>{item.colors?.[0] ?? '—'}</option>
									</select>
									<div class="text-gray-500">Quantity:</div>
									<select class="h-7 w-20 rounded border-gray-300 text-sm" disabled>
										<option selected>{item.quantity}</option>
									</select>
								</div>

								{#if tab === 'for_delivery'}
									<div class="mt-1 text-xs text-gray-600">
										Estimated Delivery: {data.estimatedDelivery}
									</div>
								{:else if tab === 'pending'}
									<div class="mt-1 text-xs text-gray-600">Awaiting confirmation</div>
								{:else if tab === 'completed'}
									<div class="mt-1 text-xs text-gray-600">Delivered</div>
								{:else if tab === 'cancelled'}
									<div class="mt-1 text-xs text-gray-600">Cancelled</div>
								{/if}
							</div>
						</div>
						<div class="text-right">
							<div class="text-sm text-green-700">
								PHP {(item.price * item.quantity).toLocaleString('en-PH', {
									minimumFractionDigits: 2
								})}
							</div>
							<!-- Optional original price placeholder: <div class="text-[10px] text-gray-400 line-through">PHP 8,000.00</div> -->
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</section>
