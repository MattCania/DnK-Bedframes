<script lang="ts">
	import { Button, Input, Select, Rating } from 'flowbite-svelte';
	import Footer from '../../../components/Footer.svelte';
	import { enhance } from '$app/forms'; // enables progressive enhancement

	export let data;

	const product = data.product;

	let quantity = 1;
	let selectedColor = product.colors?.[0] || 'Black';
	let selectedSize = product.sizes?.[0] || 'Queen-Size';

	const colorOptions = product.colors.map(c => ({ value: c, name: c }));
	const sizeOptions = (Array.isArray(product.sizes) ? product.sizes : [product.sizes])
		.map(s => ({ value: s, name: s }));

	let formAction = 'addToCart'; // default action
</script>

<div class="bg-white min-h-screen pt-28">
	<div class="max-w-6xl mx-auto p-6">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
			<div>
				<div class="border-2 border-gray-300 rounded-lg p-4 bg-white">
					<img src={product.image} alt={product.name} class="w-full h-auto object-cover rounded" />
				</div>
			</div>

			<div>
				<h1 class="text-2xl font-bold text-gray-900 mb-3">{product?.name}</h1>

				<div class="flex items-baseline gap-3 mb-4">
					<span class="text-3xl font-bold text-green-600">
						PHP {product?.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
					</span>
				</div>

				<form
					method="POST"
					use:enhance
					action="?/add-to-cart"
					on:submit={() => (formAction = 'addToCart')}
					class="space-y-4"
				>
					<input type="hidden" name="product_id" value={product.id} />
					<input type="hidden" name="quantity" value={quantity} />
					<input type="hidden" name="color" value={selectedColor} />
					<input type="hidden" name="size" value={selectedSize} />
					<input type="hidden" name="action" value={formAction} />

					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
						<Select bind:value={selectedColor} items={colorOptions} class="w-full" />
					</div>

					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
						<Input type="number" min="1" bind:value={quantity} class="w-full" />
					</div>

					<div class="mb-6">
						<label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
						<Select bind:value={selectedSize} items={sizeOptions} class="w-full" />
					</div>

					<div class="space-y-3">
						<Button type="submit" color="blue" class="w-full">Add to Cart</Button>
						<Button
							type="submit"
							color="green"
							class="w-full"
							on:click={() => (formAction = 'buyNow')}
						>
							Buy Now
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>

	<Footer />
</div>
