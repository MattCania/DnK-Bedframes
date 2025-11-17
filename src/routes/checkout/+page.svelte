<script lang="ts">
	import { onMount } from 'svelte';

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
	const estimatedDelivery = data.estimatedDelivery ?? '';
	const account = data.account;

	const fullname = account ? `${account.firstname ?? ''} ${account.lastname ?? ''}`.trim() : '';

	const STORE_LAT = 14.76741;
	const STORE_LNG = 121.04385;
	const STORE_ADDRESS =
		'Zabarte Road, Barangay 175, Zone 15, Camarin, District 1, Caloocan, Northern Manila District, Metro Manila, 1428, Philippines';

	const BASE_FEE = 200;
	const RATE_PER_KM = 15;
	// const FREE_SHIPPING_THRESHOLD = 2000;

	let calculatedDistance: number | null = null;
	let calculatedShippingFee = data.shippingFee ?? 0;
	let calculatedTotal = data.totalAmount ?? 0;
	let isCalculating = false;
	let calculationError = '';

	function parseCoordinates(address: string | null): { lat: number; lng: number } | null {
		if (!address) return null;

		const coordMatch = address.match(/\((-?\d+\.\d+),\s*(-?\d+\.\d+)\)\s*$/);
		if (coordMatch) {
			return {
				lat: parseFloat(coordMatch[1]),
				lng: parseFloat(coordMatch[2])
			};
		}

		return null;
	}

	function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const R = 6371;
		const dLat = toRad(lat2 - lat1);
		const dLon = toRad(lon2 - lon1);

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c; 

		return distance;
	}

	function toRad(degrees: number): number {
		return degrees * (Math.PI / 180);
	}

	function calculateShippingFee(distanceKm: number): number {
		// if (itemsTotal >= FREE_SHIPPING_THRESHOLD) {
		// 	return 0;
		// }
		const fee = BASE_FEE + distanceKm * RATE_PER_KM;
		return Math.round(fee * 100) / 100;
	}

	function performCalculation() {
		isCalculating = true;
		calculationError = '';

		try {
			const customerCoords = parseCoordinates(account?.address);

			if (!customerCoords) {
				calculationError =
					'Please set your delivery address with coordinates in your account settings.';
				calculatedDistance = null;
				calculatedShippingFee = data.shippingFee ?? 50;
				calculatedTotal = itemsTotal + calculatedShippingFee;
				return;
			}

			const distance = calculateDistance(
				STORE_LAT,
				STORE_LNG,
				customerCoords.lat,
				customerCoords.lng
			);

			calculatedDistance = Math.round(distance * 100) / 100;
			calculatedShippingFee = calculateShippingFee(distance);
			calculatedTotal = itemsTotal + calculatedShippingFee;
		} catch (err) {
			console.error('Distance calculation error:', err);
			calculationError = 'Error calculating distance. Using default shipping fee.';
			calculatedShippingFee = data.shippingFee ?? 50;
			calculatedTotal = itemsTotal + calculatedShippingFee;
		} finally {
			isCalculating = false;
		}
	}

	onMount(() => {
		performCalculation();
	});

	$: if (account?.address || itemsTotal) {
		performCalculation();
	}
</script>

<section class="min-h-screen bg-gray-50 pt-24">
	<div class="mx-auto max-w-6xl px-4 md:px-6">
		<h1 class="mb-6 text-center text-3xl font-bold text-gray-900">Checkout</h1>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
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

					{#if calculatedDistance !== null}
						<div class="rounded-md border border-blue-100 bg-blue-50 p-3">
							<div class="mb-1 font-medium text-gray-700">📍 Delivery Distance</div>
							<div class="font-semibold text-gray-900">{calculatedDistance} km</div>
							<div class="mt-1 text-xs text-gray-600">From: Zabarte Road, Camarin, Caloocan</div>
						</div>
					{/if}

					{#if calculationError}
						<div
							class="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800"
						>
							⚠️ {calculationError}
						</div>
					{/if}

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
								<div class="flex flex-col">
									<span class="text-gray-600">Shipping Fee:</span>
									{#if calculatedDistance !== null}
										<span class="text-xs text-gray-500">
											{#if calculatedShippingFee === 0}
												🎉 Free shipping!
											{:else}
												₱{BASE_FEE} base + ₱{RATE_PER_KM}/km × {calculatedDistance}km
											{/if}
										</span>
									{/if}
								</div>
								<span class="font-semibold text-green-700">
									{#if isCalculating}
										<span class="text-gray-400">Calculating...</span>
									{:else if calculatedShippingFee === 0}
										<span class="text-green-600">FREE</span>
									{:else}
										PHP {calculatedShippingFee.toLocaleString('en-PH', {
											minimumFractionDigits: 2
										})}
									{/if}
								</span>
							</div>

							<!-- {#if itemsTotal < FREE_SHIPPING_THRESHOLD && FREE_SHIPPING_THRESHOLD - itemsTotal < 500}
								<div class="text-xs text-blue-600">
									Add PHP {(FREE_SHIPPING_THRESHOLD - itemsTotal).toFixed(2)} more for free shipping!
								</div>
							{/if} -->

							<hr />
							<div class="flex items-center justify-between text-base">
								<span class="font-medium text-gray-900">Total Amount:</span>
								<span class="font-bold text-green-700">
									{#if isCalculating}
										<span class="text-gray-400">...</span>
									{:else}
										PHP {calculatedTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
									{/if}
								</span>
							</div>
						</div>
					</div>

					<div class="pt-3 text-xs text-gray-600">Estimated Delivery Date: {estimatedDelivery}</div>
				</div>
			</div>

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

		<div class="mt-6 flex justify-center">
			<form method="POST" action="?/purchase">
				<input type="hidden" name="shipping_fee" value={calculatedShippingFee} />
				<input type="hidden" name="distance_km" value={calculatedDistance ?? 0} />
				<input type="hidden" name="total_amount" value={calculatedTotal} />

				<input
					type="hidden"
					name="product_ids"
					value={JSON.stringify(items.map((i) => i.product_id).filter((id) => id != null))}
				/>
				<input
					type="hidden"
					name="quantities"
					value={JSON.stringify(items.map((i) => i.quantity))}
				/>
				<input
					type="hidden"
					name="colors"
					value={JSON.stringify(items.map((i) => i.colors?.[0] ?? null))}
				/>
				<input type="hidden" name="items_total" value={itemsTotal} />

				<button
					type="submit"
					class="rounded-md bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={items.length === 0 || isCalculating || !!calculationError}
				>
					{#if isCalculating}
						Calculating...
					{:else}
						Purchase (PHP {calculatedTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })})
					{/if}
				</button>
			</form>
		</div>

		<div class="mt-8 mb-6 rounded-lg bg-gray-100 p-4 text-sm text-gray-700">
			<h3 class="mb-2 font-semibold">📦 Shipping Information</h3>
			<ul class="space-y-1 text-xs">
				<li>• Base shipping fee: PHP {BASE_FEE}</li>
				<li>• Additional: PHP {RATE_PER_KM} per kilometer</li>
				<!-- <li>• Free shipping on orders PHP {FREE_SHIPPING_THRESHOLD.toLocaleString('en-PH')} and above</li> -->
				<li>• Distance calculated from: Zabarte Road, Camarin, Caloocan</li>
			</ul>
		</div>
	</div>
</section>
