<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { incCartCount } from '$lib/stores/cart';
	import { Button, Heading, P, Modal } from 'flowbite-svelte';
	import { CloseCircleSolid, CheckCircleSolid } from 'flowbite-svelte-icons';

	export let data: { items: Array<any>; total: number };
	let items = data.items || [];
	let total = data.total || 0;

	// Modal state
	let showModal = false;
	let modalMessage = '';
	let modalSuccess = false;

	const onEnhance = (input?: any) => {
		const submittedAction: string = input?.action?.pathname ?? '';
		const fd: FormData | undefined = input?.formData;
		return async ({ result }: any) => {
			if (result.type === 'success' && result.data?.success) {
				// Set appropriate message based on action
				if (submittedAction.endsWith('/increment')) {
					modalMessage = 'Item quantity increased successfully!';
					incCartCount(1);
				} else if (submittedAction.endsWith('/decrement')) {
					modalMessage = 'Item quantity decreased successfully!';
					incCartCount(-1);
				} else if (submittedAction.endsWith('/remove')) {
					modalMessage = 'Item removed from cart successfully!';
					const qty = Number(fd?.get('qty') ?? 0);
					if (qty) incCartCount(-qty);
				}
				
				modalSuccess = true;
				showModal = true;
				
				// Auto-close after 2 seconds
				setTimeout(() => {
					showModal = false;
				}, 2000);

				void invalidateAll();
			} else if (result.type === 'success' && result.data?.success === false) {
				modalMessage = result.data?.message || 'An error occurred. Please try again.';
				modalSuccess = false;
				showModal = true;
			}
		};
	};
</script>

<!-- Success/Error Modal -->
<Modal bind:open={showModal} size="xs" autoclose outsideclose>
	<div class="text-center">
		{#if modalSuccess}
			<CheckCircleSolid class="mx-auto mb-4 h-14 w-14 text-green-500" />
		{:else}
			<CloseCircleSolid class="mx-auto mb-4 h-14 w-14 text-red-500" />
		{/if}
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			{modalMessage}
		</h3>
		<Button color={modalSuccess ? 'green' : 'red'} onclick={() => (showModal = false)}>
			OK
		</Button>
	</div>
</Modal>

<section class="min-h-screen bg-white pt-22">
	<div class="flex flex-col justify-between mx-auto max-w-6xl p-0 md:p-6 bg-gray-100 h-full">
		{#if items.length === 0}
			<P class="text-gray-600">Your cart is empty.</P>
		{:else}
			<div class="h-full overflow-x-auto rounded-lg border border-gray-200 bg-gray-200">
				<table class="table-fixed md:table-auto w-full divide-y divide-gray-200 bg-zinc-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								class="md:px-6 px-4 py-3 text-center text-xs md:text-sm font-medium md:tracking-wider text-gray-800 uppercase"
								>Product</th
							>
							<th
								class="md:px-6 px-4 py-3 text-center text-xs md:text-sm font-medium md:tracking-wider text-gray-800 uppercase"
								>Options</th
							>
							<th
								class="md:px-6 px-4 py-3 text-center text-xs md:text-sm font-medium md:tracking-wider text-gray-800 uppercase"
								>Price</th
							>
							<th
								class="md:px-6 px-4 py-3 text-center text-xs md:text-sm font-medium md:tracking-wider text-gray-800 uppercase"
								>Qty</th
							>
							<th
								class="md:px-6 px-4 py-3 text-center text-xs md:text-sm font-medium md:tracking-wider text-gray-800 uppercase"
								>Subtotal</th
							>
							<th
								class="md:px-6 px-4 py-3 text-center text-xs md:text-sm font-medium md:tracking-wider text-gray-800 uppercase"
								>Action</th
							>
						</tr>
					</thead>
					<tbody class="table-fixed md:table-auto divide-y divide-gray-200 bg-white">
						{#each items as item}
							<tr class="">
								<td class="text-xs md:text-sm w-full text-center px-0 md:px-6 py-4 md:whitespace-nowrap">
									<div class="flex items-center gap-3">
										{#if item.image}
											<img
												src={item.image}
												alt={item.name}
												class="h-12 w-12 hidden md:flex rounded object-cover"
											/>
										{/if}
										<div class="flex flex-col">
											<a
												href={`/products/${item.product_id}`}
												class="font-medium text-gray-900 hover:underline wrap-normal">{item.name}</a
											>
										</div>
									</div>
								</td>
								<td class="text-xs md:text-sm w-full text-center px-6 py-4 md:whitespace-nowrap text-gray-500">
									<div>Color: {item.colors?.[0] ?? '—'}</div>
									<div>Size: {item.category}</div>
								</td>
								<td class="text-xs md:text-sm w-full text-center px-6 py-4 md:whitespace-nowrap text-gray-900">
									PHP {item.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
								</td>
								<td class="text-xs md:text-sm w-full text-center px-6 py-4 md:whitespace-nowrap text-gray-900">
									<div class="flex flex-col md:flex-row md:inline-flex items-center gap-2">
										<form method="POST" action="?/increment" use:enhance={onEnhance}>
											<input type="hidden" name="id" value={item.id} />
											<button
												type="submit"
												class="rounded border px-2 py-1 hover:bg-gray-50 disabled:opacity-50"
												aria-label="Increase quantity"
												disabled={item.quantity >= item.stock}>+</button
											>
										</form>
										<span class="min-w-[2ch] text-center">{item.quantity}</span>
										<form method="POST" action="?/decrement" use:enhance={onEnhance}>
											<input type="hidden" name="id" value={item.id} />
											<button
												type="submit"
												class="rounded border px-2 py-1 hover:bg-gray-50"
												aria-label="Decrease quantity">-</button
											>
										</form>
									</div>
								</td>
								<td class="text-xs md:text-sm w-full text-center px-6 py-4 md:whitespace-nowrap text-gray-900">
									PHP {item.subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
								</td>
								<td class="text-xs md:text-sm w-full text-center px-6 py-4 md:whitespace-nowrap text-gray-900">
									<form method="POST" action="?/remove" use:enhance={onEnhance}>
										<input type="hidden" name="id" value={item.id} />
										<input type="hidden" name="qty" value={item.quantity} />
										<button
											type="submit"
											class="hidden md:block rounded border border-red-600 px-3 py-1 text-red-600 hover:bg-red-200"
											>Remove</button
										>
										<CloseCircleSolid type="submit" class="w-8 h-8 text-center text-red-600 hover:text-red-200 text-2xl md:hidden"/>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="my-4 flex items-center justify-between p-2">
				<Button href="/" class="text-white bg-blue-600">Continue Shopping</Button>
				<div class="text-right">
					<div class="text-lg font-semibold text-gray-900">
						Total: PHP {total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
					</div>
					<Button
						href="/checkout"
						class="mt-3 inline-block rounded bg-green-600 px-5 py-2 text-white hover:bg-green-700"
						>Proceed to Checkout</Button
					>
				</div>
			</div>
		{/if}
	</div>
</section>