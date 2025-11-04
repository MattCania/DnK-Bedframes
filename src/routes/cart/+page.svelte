<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { incCartCount } from '$lib/stores/cart';
	import { Button, Heading, P } from 'flowbite-svelte';

	export let data: { items: Array<any>; total: number };
	let items = data.items || [];
	let total = data.total || 0;

	const onEnhance = (input?: any) => {
		const submittedAction: string = input?.action?.pathname ?? '';
		const fd: FormData | undefined = input?.formData;
		return async ({ result }: any) => {
			if (result.type === 'success') {
				if (submittedAction.endsWith('/increment')) {
					incCartCount(1);
				} else if (submittedAction.endsWith('/decrement')) {
					incCartCount(-1);
				} else if (submittedAction.endsWith('/remove')) {
					const qty = Number(fd?.get('qty') ?? 0);
					if (qty) incCartCount(-qty);
				}
				void invalidateAll();
			}
		};
	};
</script>

<section class="min-h-screen bg-white pt-22">
	<div class="flex flex-col justify-between mx-auto max-w-6xl p-6 bg-gray-100 h-full">
			{#if items.length === 0}
			<P class="text-gray-600">Your cart is empty.</P>
		{:else}
			<div class="h-full overflow-x-auto rounded-lg border border-gray-200 bg-gray-200">
				<table class="table-fixed md:table-auto w-full divide-y divide-gray-200 bg-zinc-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								class="md:px-6 px-4 py-3 text-left text-xs font-medium md:tracking-wider text-gray-800 uppercase"
								>Product</th
							>
							<th
								class="md:px-6 px-4 py-3 text-left text-xs font-medium md:tracking-wider text-gray-800 uppercase"
								>Options</th
							>
							<th
								class="md:px-6 px-4 py-3 text-right text-xs font-medium md:tracking-wider text-gray-800 uppercase"
								>Price</th
							>
							<th
								class="md:px-6 px-4 py-3 text-right text-xs font-medium md:tracking-wider text-gray-800 uppercase"
								>Qty</th
							>
							<th
								class="md:px-6 px-4 py-3 text-right text-xs font-medium md:tracking-wider text-gray-800 uppercase"
								>Subtotal</th
							>
							<th
								class="md:px-6 px-4 py-3 text-right text-xs font-medium md:tracking-wider text-gray-800 uppercase"
								>Action</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each items as item}
							<tr class="">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center gap-3">
										{#if item.image}
											<img
												src={item.image}
												alt={item.name}
												class="h-12 w-12 rounded object-cover"
											/>
										{/if}
										<div class="flex flex-col">
											<a
												href={`/products/${item.product_id}`}
												class="font-medium text-gray-900 hover:underline">{item.name}</a
											>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
									<div>Color: {item.colors?.[0] ?? '—'}</div>
									<div>Size: {item.category}</div>
								</td>
								<td class="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
									PHP {item.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
								</td>
								<td class="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
									<div class="inline-flex items-center gap-2">
										<form method="POST" action="?/decrement" use:enhance={onEnhance}>
											<input type="hidden" name="id" value={item.id} />
											<button
												type="submit"
												class="rounded border px-2 py-1 hover:bg-gray-50"
												aria-label="Decrease quantity">-</button
											>
										</form>
										<span class="min-w-[2ch] text-center">{item.quantity}</span>
										<form method="POST" action="?/increment" use:enhance={onEnhance}>
											<input type="hidden" name="id" value={item.id} />
											<button
												type="submit"
												class="rounded border px-2 py-1 hover:bg-gray-50 disabled:opacity-50"
												aria-label="Increase quantity"
												disabled={item.quantity >= item.stock}>+</button
											>
										</form>
									</div>
								</td>
								<td class="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
									PHP {item.subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
								</td>
								<td class="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
									<form method="POST" action="?/remove" use:enhance={onEnhance}>
										<input type="hidden" name="id" value={item.id} />
										<input type="hidden" name="qty" value={item.quantity} />
										<button
											type="submit"
											class="rounded border border-red-600 px-3 py-1 text-red-600 hover:bg-red-50"
											>Remove</button
										>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="my-4 flex items-center justify-between">
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
