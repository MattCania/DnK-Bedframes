<script lang="ts">
	import { enhance } from '$app/forms';

	export let data: {
		requests: any[]; // pending
		confirmed: any[]; // for_delivery
		denied: any[]; // cancelled
		completed: any[]; // completed
	};

	type Tab = 'requests' | 'confirmed' | 'denied' | 'completed';
	let tab: Tab = 'requests';
	const tabs: { id: Tab; label: string }[] = [
		{ id: 'requests', label: 'Order Requests' },
		{ id: 'confirmed', label: 'Confirmed Requests' },
		{ id: 'denied', label: 'Denied Requests' },
		{ id: 'completed', label: 'Completed Orders' }
	];

	function ordersFor(t: Tab) {
		return (data as any)[t] ?? [];
	}

	function fmtDate(d: any) {
		try {
			const dt = new Date(d);
			return dt.toLocaleString();
		} catch {
			return '';
		}
	}

	const onEnhance =
		() =>
		async ({ result }: any) => {
			if (result.type === 'success') {
				location.reload();
			}
		};
</script>

<section class="min-h-screen bg-white p-6">
	<h1 class="mb-4 text-2xl font-bold text-gray-900">Orders</h1>

	<!-- Tabs -->
	<div class="mb-4 flex overflow-x-auto rounded-md border border-gray-200 bg-gray-100 text-sm">
		{#each tabs as t}
			<button
				class="min-w-40 flex-1 px-4 py-3 font-medium focus:outline-none {tab === t.id
					? 'bg-white text-gray-900'
					: 'text-gray-600'}"
				onclick={() => (tab = t.id)}
			>
				{t.label}
			</button>
		{/each}
	</div>

	{#if (ordersFor(tab)?.length ?? 0) === 0}
		<p class="text-gray-600">No orders in this section.</p>
	{:else}
		<div class="space-y-6">
			{#each ordersFor(tab) as order (order.id)}
				<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
					<div class="mb-3 flex flex-wrap items-center justify-between gap-3">
						<div>
							<div class="text-lg font-semibold text-gray-900">Order #{order.id}</div>
							<div class="text-sm text-gray-600">
								{order.customer} • {fmtDate(order.created_at)}
							</div>
						</div>
						<div class="text-right font-semibold text-green-700">
							PHP {order.total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
						</div>
					</div>

					<div class="space-y-3">
						{#each order.items as item}
							<div
								class="flex items-center justify-between gap-4 rounded-md border border-gray-100 p-3"
							>
								<div class="flex items-center gap-3">
									{#if item.image}
										<img
											src={item.image}
											alt={item.name ?? ''}
											class="h-16 w-16 rounded object-cover"
										/>
									{/if}
									<div>
										<div class="font-medium text-gray-900">{item.name}</div>
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
									</div>
								</div>
								<div class="text-right font-semibold text-green-700">
									PHP {(item.price * item.quantity).toLocaleString('en-PH', {
										minimumFractionDigits: 2
									})}
								</div>
							</div>
						{/each}
					</div>

					{#if tab === 'requests'}
						<div class="mt-4 flex justify-end gap-3">
							<form method="POST" action="?/deny" use:enhance={onEnhance}>
								<input type="hidden" name="order_id" value={order.id} />
								<button
									type="submit"
									class="rounded border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50"
									>Deny</button
								>
							</form>
							<form method="POST" action="?/confirm" use:enhance={onEnhance}>
								<input type="hidden" name="order_id" value={order.id} />
								<button
									type="submit"
									class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
									>Confirm for Delivery</button
								>
							</form>
						</div>
					{:else if tab === 'confirmed'}
						<div class="mt-4 flex justify-end">
							<form method="POST" action="?/complete" use:enhance={onEnhance}>
								<input type="hidden" name="order_id" value={order.id} />
								<button
									type="submit"
									class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
									>Mark as Completed</button
								>
							</form>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>
