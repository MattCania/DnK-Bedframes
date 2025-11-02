<script lang="ts">
	export let data: {
		items: Array<{
			id: number;
			product_id: number | null;
			name: string | null;
			price: number;
			quantity: number;
			colors: string[];
			category: string | null;
			image: string | null;
		}>;
		itemsTotal: number;
		shippingFee: number;
		totalAmount: number;
		estimatedDelivery: string;
		account: any;
	};

	const items = data.items ?? [];
	const itemsTotal = data.itemsTotal ?? 0;
	const shippingFee = data.shippingFee ?? 0;
	const totalAmount = data.totalAmount ?? 0;
	const estimatedDelivery = data.estimatedDelivery ?? '';
	const account = data.account;

	const fullname = account ? `${account.firstname ?? ''} ${account.lastname ?? ''}`.trim() : '';
</script>

<section class="min-h-screen bg-gray-50 pt-24">
	<div class="mx-auto max-w-6xl px-4 md:px-6">
		<h1 class="mb-6 text-center text-3xl font-bold text-gray-900">Checkout</h1>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Delivery Details -->
			<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
				<h2 class="mb-4 text-xl font-semibold text-gray-900">Delivery Details:</h2>

				<div class="space-y-3 text-sm">
					<div>
						<div class="text-gray-500">Customer:</div>
						<div class="font-medium text-gray-900">{fullname || '—'}</div>
					</div>
					<div class="flex items-start justify-between gap-3">
						<div>
							<div class="text-gray-500">Address:</div>
							<div class="max-w-[36ch] break-words text-gray-900">{account?.address ?? '—'}</div>
						</div>
						<a href="/account" class="text-blue-600 hover:underline">Change</a>
					</div>

					<div>
						<div class="text-gray-500">Payment Method:</div>
						<label class="mt-1 inline-flex items-center gap-2 text-gray-900">
							<input
								type="radio"
								checked
								disabled
								class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-600"
							/>
							<span>Cash on Delivery</span>
						</label>
					</div>

					<div class="pt-2">
						<div class="mb-2 text-gray-900">Total:</div>
						<div class="space-y-2 rounded-md border border-gray-100 p-3">
							<div class="flex items-center justify-between">
								<span class="text-gray-600">Items Total:</span>
								<span class="font-semibold text-green-700"
									>PHP {itemsTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span
								>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-gray-600">Shipping Fee:</span>
								<span class="font-semibold text-green-700"
									>PHP {shippingFee.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span
								>
							</div>
							<hr />
							<div class="flex items-center justify-between text-base">
								<span class="font-medium text-gray-900">Total Amount:</span>
								<span class="font-bold text-green-700"
									>PHP {totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span
								>
							</div>
						</div>
					</div>

					<div class="pt-3 text-xs text-gray-600">Estimated Delivery Date: {estimatedDelivery}</div>
				</div>
			</div>

			<!-- Orders -->
			<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
				<h2 class="mb-4 text-xl font-semibold text-gray-900">Orders:</h2>
				<div class="space-y-4">
					{#if items.length === 0}
						<p class="text-gray-600">Your cart is empty.</p>
					{:else}
						{#each items as item}
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
										<div class="text-sm text-gray-500">{item.category}</div>
										<div class="mt-1 text-sm text-gray-700">Quantity: {item.quantity}</div>
										<div class="text-sm text-gray-700">Color: {item.colors?.[0] ?? '—'}</div>
									</div>
								</div>
								<div class="text-right font-semibold text-green-700">
									PHP {(item.price * item.quantity).toLocaleString('en-PH', {
										minimumFractionDigits: 2
									})}
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<!-- Purchase button -->
		<div class="mt-6 flex justify-center">
			<form method="POST" action="?/purchase">
				<button
					type="submit"
					class="rounded-md bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
					disabled={items.length === 0}
				>
					Purchase
				</button>
			</form>
		</div>
	</div>
</section>
