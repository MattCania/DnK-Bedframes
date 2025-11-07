<script lang="ts">
	import { enhance } from '$app/forms';
	export let data: {
		pending: Array<any>;
		for_delivery: Array<any>;
		completed: Array<any>;
		cancelled: Array<any>;
		estimatedDelivery: string;
	};

	type Tab = 'pending' | 'for_delivery' | 'completed' | 'cancelled';
	let tab: Tab = 'for_delivery';
	let selected: any = null;

	const tabs = [
		{ id: 'pending', label: 'Pending' },
		{ id: 'for_delivery', label: 'For Delivery' },
		{ id: 'completed', label: 'Completed' },
		{ id: 'cancelled', label: 'Cancelled' }
	] as const;

	function ordersFor(t: Tab) {
		return (data as any)[t] ?? [];
	}

	const fmtPHP = (n: number) =>
		`PHP ${Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

	function txNumber(order: any) {
		const d = new Date(order.created_at ?? Date.now());
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}${m}${day}${String(order.id).padStart(2, '0')}`;
	}

	function orderedDate(order: any) {
		return new Date(order.created_at).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function receivedDate(order: any) {
		const d = new Date(order.created_at ?? Date.now());
		d.setDate(d.getDate() + 4);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	const onEnhance =
		() =>
		async ({ result }: any) => {
			if (result.type === 'success') {
				location.reload();
			} else if (result.type === 'failure') {
				const msg = result.data?.message ?? 'Operation failed.';
				alert(msg);
			}
		};
</script>

<section class="min-h-screen bg-white pt-22">
	<div class="h-full mx-auto max-w-6xl md:px-0 px-2 bg-gray-50">
		<div class="flex overflow-x-auto rounded-md border border-gray-200 bg-gray-100 text-sm">
			{#each tabs as t}
				<button
					class="min-w-32 flex-1 px-4 py-3 font-medium focus:outline-none {tab === t.id
						? 'bg-white text-gray-900'
						: 'text-gray-600'}"
					on:click={() => (tab = t.id)}
				>
					{t.label}
				</button>
			{/each}
		</div>

		<div class="mt-4 space-y-6 mx-4">
			{#if ordersFor(tab).length === 0}
				<p class="text-gray-600">No orders in this section.</p>
			{:else}
				{#each ordersFor(tab) as order (order.id)}
					<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
						<button
							type="button"
							class="mb-3 flex w-full flex-wrap items-center justify-between gap-3 text-left focus:outline-none"
							on:click={() => (selected = order)}
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									selected = order;
								}
							}}
						>
							<div>
								<div class="text-lg font-semibold text-gray-900">Order #{order.id}</div>
								<div class="text-sm text-gray-600">
									{new Date(order.created_at).toLocaleString()}
								</div>
							</div>
							<div class="text-right font-semibold text-green-700">{fmtPHP(order.totalAmount)}</div>
						</button>

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
												class="h-16 w-24 rounded object-cover"
											/>
										{/if}
										<div class="space-y-1">
											<div class="text-base font-semibold text-gray-900">{item.name}</div>
											<div class="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 text-xs">
												<div class="text-gray-500">Color:</div>
												<span class="text-sm font-medium">{item.colors?.[0] ?? '—'}</span>
												<div class="text-gray-500">Quantity:</div>
												{#if tab === 'pending'}
														<span class="w-8 text-start text-sm font-medium">{item.quantity}</span>
												{:else}
													<!-- <select class="h-auto w-20 rounded border-gray-300 text-sm" disabled> -->
														<span class="w-8 text-start text-sm font-medium">{item.quantity}</span>
													<!-- </select> -->
												{/if}
											</div>
										</div>
									</div>
									<div class="text-right text-sm font-semibold text-green-700">
										{fmtPHP(item.price * item.quantity)}
									</div>
								</div>

								{#if tab === 'completed'}
									<div class="mt-2 rounded-md border border-gray-100 p-3 text-sm">
										{#if item.review}
											<div>
												<div class="font-medium">Your review</div>
												<div class="text-gray-700">Rating: {item.review.rating}/5</div>
												{#if item.review.comment}
													<div class="mt-1 whitespace-pre-line text-gray-600">
														{item.review.comment}
													</div>
												{/if}
											</div>
										{:else}
											<form
												method="POST"
												action="?/review"
												use:enhance={onEnhance}
												class="space-y-2"
											>
												<input type="hidden" name="product_id" value={item.product_id} />
												<div class="flex items-center gap-3">
													<label class="text-gray-700" for={'rating-' + item.product_id}
														>Rating</label
													>
													<select
														id={'rating-' + item.product_id}
														name="rating"
														class="h-8 rounded border-gray-300"
														required
													>
														<option value="">Select</option>
														<option>1</option>
														<option>2</option>
														<option>3</option>
														<option>4</option>
														<option>5</option>
													</select>
												</div>
												<textarea
													name="comment"
													rows="2"
													placeholder="Share your thoughts (optional)"
													aria-label="Review comment"
													class="w-full rounded border-gray-300 p-2"
												></textarea>
												<button type="submit" class="rounded bg-blue-600 px-3 py-1 text-white"
													>Submit review</button
												>
											</form>
										{/if}
									</div>
								{/if}
							{/each}
						</div>

						{#if tab === 'pending'}
							<div class="mt-3 flex items-center justify-between">
								<div class="text-xs text-gray-600">Awaiting confirmation</div>
								<form method="POST" action="?/cancel" use:enhance={onEnhance}>
									<input type="hidden" name="order_id" value={order.id} />
									<!-- <button
										type="submit"
										class="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
										>Cancel Order</button
									> -->
								</form>
							</div>
						{:else if tab === 'for_delivery'}
							<div class="mt-2 text-xs text-gray-600">
								Estimated Delivery: {data.estimatedDelivery}
							</div>
						{:else if tab === 'completed'}
							<div class="mt-2 text-xs text-gray-600">Delivered</div>
						{:else if tab === 'cancelled'}
							<div class="mt-2 text-xs text-gray-600">Cancelled</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>

		{#if selected}
			<div
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
				role="dialog"
				aria-modal="true"
			>
				<div class="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
					<h2 class="mb-3 text-center text-xl font-bold">Transaction #{txNumber(selected)}</h2>
					<div class="space-y-2">
						{#each selected.items as it}
							<div
								class="flex items-center justify-between gap-3 rounded border border-gray-100 p-2"
							>
								<div class="flex items-center gap-2">
									{#if it.image}
										<img
											src={it.image}
											alt={it.name ?? ''}
											class="h-12 w-12 rounded object-cover"
										/>
									{/if}
									<div class="text-sm">
										<div class="font-medium">{it.name}</div>
										<div>Quantity: {it.quantity}</div>
										<div>Color: {it.colors?.[0] ?? '—'}</div>
									</div>
								</div>
								<div class="text-sm font-semibold text-green-700">{fmtPHP(it.price)}</div>
							</div>
						{/each}
					</div>

					<div class="mt-3 text-sm">
						<div class="font-semibold">Payment Method:</div>
						<label class="mt-1 inline-flex items-center gap-2"
							><input type="radio" checked disabled class="h-4 w-4" /><span>Cash on Delivery</span
							></label
						>
						<div class="mt-2">Ordered: {orderedDate(selected)}</div>
						{#if selected.status === 'completed'}
							<div>Received: {receivedDate(selected)}</div>
						{/if}
					</div>

					<div class="mt-3">
						<div class="mb-1 font-semibold">Total:</div>
						<div class="space-y-1 rounded border p-2 text-sm">
							<div class="flex items-center justify-between">
								<span class="text-gray-600">Items Total:</span><span
									class="font-semibold text-green-700">{fmtPHP(selected.itemsTotal)}</span
								>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-gray-600">Shipping Fee:</span><span
									class="font-semibold text-green-700">{fmtPHP(selected.shippingFee)}</span
								>
							</div>
							<hr />
							<div class="flex items-center justify-between">
								<span class="font-medium">Total Amount:</span><span class="font-bold text-green-700"
									>{fmtPHP(selected.totalAmount)}</span
								>
							</div>
						</div>
					</div>

					<div class="mt-4 flex items-center justify-end">
						<button
							type="button"
							class="rounded bg-gray-700 px-4 py-2 text-white"
							on:click={() => (selected = null)}>Close</button
						>
					</div>

					<div class="mt-3 flex justify-center">
						<img src="/logo.png" class="h-14 w-14 rounded bg-white p-1" alt="D&K" />
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>