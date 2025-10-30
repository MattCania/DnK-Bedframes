<script lang="ts">
	import { Card, Button, Rating, Badge, Dropdown, Checkbox, Pagination } from 'flowbite-svelte';
	import Footer from '../components/Footer.svelte';
	import { fade } from 'svelte/transition';
	import { ChevronLeftOutline, ChevronRightOutline, ChevronDownOutline } from 'flowbite-svelte-icons';

	export let data;
	let allProducts = data.products; // fetched from db
	let filteredProducts = [...allProducts];
	let displayedProducts = [];

	// --- STATE ---
	let sortOption = '';
	let currentPage = 1;
	const itemsPerPage = 12;

	let selectedCategories: string[] = [];

	// --- FILTERING ---
	function toggleCategory(category: string) {
		if (category === 'All') {
			selectedCategories = [];
			filteredProducts = [...allProducts];
		} else {
			if (selectedCategories.includes(category)) {
				selectedCategories = selectedCategories.filter((c) => c !== category);
			} else {
				selectedCategories.push(category);
			}
			filteredProducts =
				selectedCategories.length > 0
					? allProducts.filter((p) => selectedCategories.includes(p.product_category))
					: [...allProducts];
		}
		sortProducts(sortOption); // keep sort order when filtering
		updatePage();
	}

	// --- SORTING ---
	function sortProducts(option: string) {
		sortOption = option;
		switch (option) {
			case 'price-asc':
				filteredProducts.sort((a, b) => a.product_price - b.product_price);
				break;
			case 'price-desc':
				filteredProducts.sort((a, b) => b.product_price - a.product_price);
				break;
			case 'stock':
				filteredProducts.sort((a, b) => b.product_stock - a.product_stock);
				break;
			case 'date-asc':
				filteredProducts.sort(
					(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
				);
				break;
			case 'date-desc':
				filteredProducts.sort(
					(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				);
				break;
			default:
				filteredProducts = [...filteredProducts];
		}
		updatePage();
	}

	// --- PAGINATION ---
	function updatePage() {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		displayedProducts = filteredProducts.slice(start, end);
	}

	function next() {
		if (currentPage * itemsPerPage < filteredProducts.length) {
			currentPage++;
			updatePage();
		}
	}

	function previous() {
		if (currentPage > 1) {
			currentPage--;
			updatePage();
		}
	}

	updatePage();
</script>

<section class="flex flex-col gap-4 bg-gray-100 py-4 pt-24">
	<div class="mx-auto h-auto max-w-7xl px-6">
		<div class="rounded-2xl bg-gray-200 p-8">
			<div class="mb-8 flex items-center gap-3 flex-wrap">
				<Button>
					Categories<ChevronDownOutline class="ms-2 h-6 w-6 text-white dark:text-white" />
				</Button>
				<Dropdown simple class="w-48 space-y-1 p-3 text-sm">
					<li class="rounded-sm p-2 hover:bg-gray-100">
						<Checkbox onchange={() => toggleCategory('All')} checked={!selectedCategories.length}>
							All
						</Checkbox>
					</li>
					{#each ['Twin', 'Full', 'Queen', 'King'] as cat}
						<li class="rounded-sm p-2 hover:bg-gray-100">
							<Checkbox
								checked={selectedCategories.includes(cat)}
								onchange={() => toggleCategory(cat)}
							>
								{cat}
							</Checkbox>
						</li>
					{/each}
				</Dropdown>

				<Button>
					Sort By<ChevronDownOutline class="ms-2 h-6 w-6 text-white dark:text-white" />
				</Button>
				<Dropdown simple class="w-48 space-y-1 p-3 text-sm">
					<li class="rounded-sm p-2 hover:bg-gray-100" onclick={() => sortProducts('price-asc')}>
						Price (Low → High)
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100" onclick={() => sortProducts('price-desc')}>
						Price (High → Low)
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100" onclick={() => sortProducts('stock')}>
						Stock
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100" onclick={() => sortProducts('date-asc')}>
						Date (Oldest)
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100" onclick={() => sortProducts('date-desc')}>
						Date (Newest)
					</li>
				</Dropdown>
			</div>

			<div
				class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
				in:fade
			>
				{#if displayedProducts.length > 0}
					{#each displayedProducts as product (product.id)}
						<Card class="p-0">
							<a href={`/products/${product.id}`} class="w-full h-[200px] rounded-md">
								<img
									class="rounded-t-lg p-8 h-full w-full"
									src={product.image}
									alt={product.product_name}
								/>
							</a>
							<div class="px-5 pb-5">
								<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
									{product.product_name}
								</h5>
								<Rating rating={4} size={24} class="mt-2.5 mb-5">
									{#snippet text()}
										<Badge class="ms-3">{product.product_rating ?? '4.9'}</Badge>
									{/snippet}
								</Rating>
								<div class="flex items-center justify-between">
									<span class="text-lg font-bold text-gray-900 dark:text-white">
										₱{product.product_price.toLocaleString()}
									</span>
									<Button class="h-fit" href="/">Buy now</Button>
								</div>
							</div>
						</Card>
					{/each}
				{:else}
					<p class="col-span-full text-center text-gray-600">No products found.</p>
				{/if}
			</div>

			<div class="mt-8 text-center">
				<Pagination
					pages={[{ name: String(currentPage), href: '#', active: true }]}
					{previous}
					{next}
				>
					{#snippet prevContent()}
						<ChevronLeftOutline class="h-5 w-5" />
					{/snippet}
					{#snippet nextContent()}
						<ChevronRightOutline class="h-5 w-5" />
					{/snippet}
				</Pagination>
			</div>
		</div>
	</div>
</section>

<Footer />
