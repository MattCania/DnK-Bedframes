<script lang="ts">
	import { Button, Input, Select, Rating } from 'flowbite-svelte';
	import Footer from '../../../components/Footer.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { incCartCount } from '$lib/stores/cart';

	export let data: {
		product: any;
		reviews: Array<any>;
		ratingStats: { average: number; total: number; counts: Record<number, number> };
	};

	const product = data.product as any;
	const reviews: Array<any> = data.reviews || [];
	const stats = data.ratingStats || {
		average: 0,
		total: 0,
		counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
	};

	const starsArray = (n: number) => Array.from({ length: 5 }, (_, i) => i < Math.round(n));
	const barPercent = (n: number) => (stats.total ? Math.round((n / stats.total) * 100) : 0);

	let quantity = 1;
	let selectedColor = product.colors?.[0] || 'Black';
	let selectedSize = product.sizes?.[0] || 'queen';

	const colorOptions = product.colors.map((c: string) => ({ value: c, name: c }));
	const sizeOptions = (Array.isArray(product.sizes) ? product.sizes : [product.sizes]).map(
		(s: string) => ({ value: s, name: s })
	);

	let statusMessage: string | null = null;
	let statusError: string | null = null;

	const onEnhance = (_event: any) => {
		statusMessage = null;
		statusError = null;
		return async ({ result }: any) => {
			if (result.type === 'success') {
				statusMessage = 'Added to cart.';
				const payload = await result.data;
				const added = Number(payload?.added ?? quantity ?? 1) || 1;
				incCartCount(added);
				void invalidateAll();
			} else if (result.type === 'failure') {
				const data = await result.data;
				statusError = data?.message ?? 'Failed to add to cart.';
			} else if (result.type === 'redirect') {
			}
		};
	};
</script>

<div class="min-h-screen bg-white pt-28">
	<div class="mx-auto max-w-6xl p-6">
		<div class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
			<div>
				<div class="rounded-lg border-2 border-gray-300 bg-white p-4">
					<img src={product.image} alt={product.name} class="h-auto w-full rounded object-cover" />
				</div>

				<div class="mx-auto max-w-6xl p-6">
					<h2 class="mb-4 text-xl font-bold text-gray-900">Ratings</h2>
					<div
						class="grid grid-cols-1 gap-30 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-3"
					>
						<div class="flex items-center gap-3">
							<div class="text-3xl font-semibold">{stats.average.toFixed(1)}</div>
							<div class="flex items-center gap-1 text-yellow-400">
								{#each starsArray(stats.average) as filled}
									<svg
										class="h-5 w-5 {filled ? 'fill-yellow-400' : 'fill-gray-300'}"
										viewBox="0 0 20 20"
										><path
											d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.563-.954L10 0l2.947 5.956 6.563.954-4.755 4.635 1.123 6.545z"
										/></svg
									>
								{/each}
							</div>
						</div>
						<div class="col-span-2 grid grid-cols-1 gap-2">
							{#each [5, 4, 3, 2, 1] as s}
								<div class="flex items-center gap-3">
									<div class="w-6 text-sm">{s}</div>
									<div class="relative h-2 flex-1 rounded bg-gray-200">
										<div
											class="absolute top-0 left-0 h-2 rounded bg-gray-600"
											style={`width:${barPercent(stats.counts[s] || 0)}%`}
										></div>
									</div>
									<div class="w-10 text-right text-xs text-gray-600">
										{barPercent(stats.counts[s] || 0)}%
									</div>
								</div>
							{/each}
						</div>
					</div>

					<div class="mt-6 space-y-4">
						{#each reviews as r}
							<div class="rounded-lg border border-gray-200 bg-white p-4">
								<div class="mb-1 flex items-center gap-2 text-yellow-400">
									{#each Array.from({ length: 5 }, (_, i) => i < r.rating) as filled}
										<svg
											class="h-4 w-4 {filled ? 'fill-yellow-400' : 'fill-gray-300'}"
											viewBox="0 0 20 20"
											><path
												d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.563-.954L10 0l2.947 5.956 6.563.954-4.755 4.635 1.123 6.545z"
											/></svg
										>
									{/each}
								</div>
								<div class="mb-2 text-sm text-gray-700">
									Reviews by: <span class="font-medium">{r.reviewer || 'Anonymous'}</span>
								</div>
								{#if r.comment}
									<p class="text-sm text-gray-800">{r.comment}</p>
								{/if}
							</div>
						{/each}
						{#if reviews.length === 0}
							<p class="text-sm text-gray-600">No reviews yet.</p>
						{/if}
					</div>
				</div>
			</div>

			<div>
				<h1 class="mb-3 text-2xl font-bold text-gray-900">{product?.name}</h1>

				<div class="mb-4 flex items-baseline gap-3">
					<span class="text-3xl font-bold text-green-600">
						PHP {product?.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
					</span>
				</div>

				{#if product?.description}
					<p class="mb-2 text-gray-700">{product.description}</p>
				{/if}
				<p class="mb-6 text-sm text-gray-600">
					{#if typeof product?.stock === 'number'}
						{product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
					{:else}
						In stock: N/A
					{/if}
				</p>

				<form method="POST" use:enhance={onEnhance} action="?/add-to-cart" class="space-y-4">
					<input type="hidden" name="product_id" value={product.id} />

					<div class="mb-4">
						<label for="color" class="mb-2 block text-sm font-medium text-gray-700">Color</label>
						<Select
							id="color"
							name="color"
							bind:value={selectedColor}
							items={colorOptions}
							class="w-full"
						/>
					</div>

					<div class="mb-4">
						<label for="quantity" class="mb-2 block text-sm font-medium text-gray-700"
							>Quantity</label
						>
						<Input
							id="quantity"
							name="quantity"
							type="number"
							min="1"
							max={product.stock}
							bind:value={quantity}
							class="w-full"
						/>
					</div>

					<div class="mb-6">
						<label for="size" class="mb-2 block text-sm font-medium text-gray-700">Size</label>
						<Select
							id="size"
							name="size"
							bind:value={selectedSize}
							items={sizeOptions}
							class="w-full"
						/>
					</div>

					<div class="space-y-3">
						<Button
							type="submit"
							color="blue"
							class="w-full"
							disabled={!product.stock || product.stock <= 0}>Add to Cart</Button
						>
						<Button type="submit" color="green" class="w-full" formaction="?/buyNow">Buy Now</Button
						>
					</div>

					{#if statusMessage}
						<p class="text-sm text-green-700">{statusMessage}</p>
					{/if}
					{#if statusError}
						<p class="text-sm text-red-600">{statusError}</p>
					{/if}
				</form>
			</div>
		</div>
	</div>

	<Footer />
</div>
