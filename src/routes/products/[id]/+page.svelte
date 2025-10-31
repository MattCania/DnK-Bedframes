<script lang="ts">
	import { Button, Input, Select, Rating } from 'flowbite-svelte';
	import Footer from '../../../components/Footer.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { incCartCount } from '$lib/stores/cart';

	export let data: { product: any };

	const product = data.product as any;

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
