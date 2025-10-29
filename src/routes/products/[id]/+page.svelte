<script lang="ts">
	import { Button, Input, Select, Rating } from 'flowbite-svelte';
	import Footer from '../../../components/Footer.svelte';
	export let data;

	const product = data.product;

	let quantity = 1;
	let selectedColor = product.colors?.[0] || 'Black';
	let selectedSize = product.sizes?.[0] || 'Queen-Size';

	const reviews = [
		{
			id: 1,
			author: "John R.",
			rating: 4,
			date: "June 12",
			text: "Good bed frame for the price. It's spacious enough for my teenagers and looks modern."
		},
		{
			id: 2,
			author: "Carlo",
			rating: 5,
			date: "May 28",
			text: "I'm very impressed with the sturdiness of this bunk bed!"
		}
	];

	const ratingStats = [
		{ stars: 5, count: 150, percentage: 85 },
		{ stars: 4, count: 70, percentage: 40 },
		{ stars: 3, count: 30, percentage: 17 },
		{ stars: 2, count: 10, percentage: 6 },
		{ stars: 1, count: 5, percentage: 3 }
	];

	const colorOptions = product.colors.map(c => ({ value: c, name: c }));
	const sizeOptions = product.sizes.map(s => ({ value: s, name: s }));

	function handleAddToCart() {
		console.log('Added to cart:', { product: product.name, quantity, color: selectedColor, size: selectedSize });
		alert('Product added to cart!');
	}

	function handleBuyNow() {
		console.log('Buy now:', { product: product.name, quantity, color: selectedColor, size: selectedSize });
		alert('Proceeding to checkout...');
	}
</script>

<div class="bg-white min-h-screen pt-28">
	<div class="max-w-6xl mx-auto p-6">
		<!-- Main Product Section -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
			<!-- Left Side - Product Image -->
			<div>
				<div class="border-2 border-gray-300 rounded-lg p-4 bg-white">
					<img 
						src={product.image}
						alt={product.name}
						class="w-full h-auto object-cover rounded"
					/>
				</div>
				<div class="mt-4 flex justify-end">
					<button aria-label="Share" class="text-gray-600 hover:text-gray-900">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
						</svg>
					</button>
				</div>
			</div>

			<!-- Right Side - Product Details -->
			<div>
				<h1 class="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
				
				<div class="flex items-baseline gap-3 mb-4">
					<span class="text-3xl font-bold text-green-600">
						PHP {product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
					</span>
					<span class="text-sm text-gray-500 line-through">
						PHP {product.originalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
					</span>
				</div>

				<!-- Color -->
				<div class="mb-4">
					<label for="color" class="block text-sm font-medium text-gray-700 mb-2">Color</label>
					<Select id="color" bind:value={selectedColor} items={colorOptions} class="w-full" />
				</div>

				<!-- Quantity -->
				<div class="mb-4">
					<label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
					<Input id="quantity" type="number" min="1" bind:value={quantity} class="w-full" />
				</div>

				<!-- Size -->
				<div class="mb-6">
					<label for="size" class="block text-sm font-medium text-gray-700 mb-2">Size</label>
					<Select id="size" bind:value={selectedSize} items={sizeOptions} class="w-full" />
				</div>

				<!-- Buttons -->
				<div class="space-y-3">
					<Button on:click={handleAddToCart} color="blue" class="w-full">Add to Cart</Button>
					<Button on:click={handleBuyNow} color="green" class="w-full">Buy Now</Button>
				</div>
			</div>
		</div>

		<!-- Description -->
		<div class="border-b-2 py-6 mb-8">
			<h2 class="text-lg font-bold text-gray-900 mb-3">Description:</h2>
			<p class="text-sm text-gray-700 leading-relaxed">{product.description}</p>
		</div>

		<!-- Ratings -->
		<div class="pt-6">
			<h2 class="text-lg font-bold text-gray-900 mb-6">Ratings</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
				<div class="text-center">
					<div class="text-5xl font-bold text-gray-900 mb-2">{product.rating}</div>
					<Rating rating={Math.round(product.rating)} size={20} />
				</div>

				<div class="md:col-span-2">
					{#each ratingStats as stat}
						<div class="flex items-center gap-2 mb-2">
							<span class="text-sm font-medium text-gray-700 w-3">{stat.stars}</span>
							<span class="text-yellow-400 text-sm">⭐</span>
							<div class="flex-grow bg-gray-200 rounded-full h-2 overflow-hidden">
								<div class="bg-gray-800 h-full rounded-full" style="width: {stat.percentage}%"></div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="space-y-6">
				{#each reviews as review (review.id)}
					<div class="border-b border-gray-200 pb-6">
						<Rating rating={review.rating} size={16} class="mb-2" />
						<p class="text-sm font-semibold text-gray-900 mb-1">Reviewed by: {review.author}</p>
						<p class="text-xs text-gray-500 mb-3">{review.date}</p>
						<p class="text-sm text-gray-700 leading-relaxed">{review.text}</p>
					</div>
				{/each}
			</div>

			<div class="text-center mt-6">
				<button class="text-gray-600 hover:text-gray-900 text-2xl font-bold">•••</button>
			</div>
		</div>
	</div>
	<Footer />
</div>
