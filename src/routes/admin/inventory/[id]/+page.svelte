<script lang="ts">
	export let data;
	const product = data.data;
</script>

<section class="space-y-6 p-6 md:p-8">
	{#if product}
		<h1 class="text-3xl font-bold">Product Details</h1>
		<div class="flex flex-col items-center gap-6 md:flex-row md:items-start">
			{#if product.image}
				<img
					src={product.image}
					alt={product.name}
					class="h-[317px] w-[362px] rounded-lg object-cover shadow-lg"
				/>
			{:else}
				<p>No image available</p>
			{/if}

			<div class="space-y-3">
				<h2 class="text-2xl font-semibold">{product.name}</h2>
				<p class="text-gray-400">{product.description}</p>
				<p><strong>Price:</strong> ₱{product.price}</p>
				<p><strong>Stock:</strong> {product.stock}</p>
				<p><strong>Category:</strong> {product.category}</p>
				<p><strong>Colors:</strong> {product.colors?.join(', ')}</p>
			</div>
		</div>
	{:else}
		<h1>No Product Found</h1>
	{/if}
</section>
