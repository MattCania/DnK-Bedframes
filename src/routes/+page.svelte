<script lang="ts">
	import { Card, Button, Rating, Badge, Dropdown, Checkbox, Pagination } from 'flowbite-svelte';
	import Footer from '../components/Footer.svelte';
	import { fade } from 'svelte/transition';
	import {
		ChevronLeftOutline,
		ChevronRightOutline,
		ChevronDownOutline
	} from 'flowbite-svelte-icons';

	export let data;
	let allProducts: any[] = data.products; // fetched from db
	let filteredProducts: any[] = [...allProducts];
	let displayedProducts: any[] = [];

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
			const cat = category.toLowerCase();
			if (selectedCategories.includes(cat)) {
				selectedCategories = selectedCategories.filter((c) => c !== cat);
			} else {
				selectedCategories = [...selectedCategories, cat];
			}
			filteredProducts =
				selectedCategories.length > 0
					? allProducts.filter((p) =>
							selectedCategories.includes(String(p.product_category).toLowerCase())
						)
					: [...allProducts];
		}
		// reset to first page after filtering and keep current sort
		currentPage = 1;
		sortProducts(sortOption);
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
				filteredProducts.sort((a, b) => {
					const aTime = a.created_at ? new Date(a.created_at).getTime() : (a.id ?? 0);
					const bTime = b.created_at ? new Date(b.created_at).getTime() : (b.id ?? 0);
					return aTime - bTime;
				});
				break;
			case 'date-desc':
				filteredProducts.sort((a, b) => {
					const aTime = a.created_at ? new Date(a.created_at).getTime() : (a.id ?? 0);
					const bTime = b.created_at ? new Date(b.created_at).getTime() : (b.id ?? 0);
					return bTime - aTime;
				});
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
			<div class="mb-8 flex flex-wrap items-center gap-3">
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
								checked={selectedCategories.includes(cat.toLowerCase())}
								onchange={() => toggleCategory(cat.toLowerCase())}
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
					<li class="rounded-sm p-2 hover:bg-gray-100">
						<button
							type="button"
							class="w-full text-left"
							onclick={() => sortProducts('price-asc')}
						>
							Price (Low → High)
						</button>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100">
						<button
							type="button"
							class="w-full text-left"
							onclick={() => sortProducts('price-desc')}
						>
							Price (High → Low)
						</button>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100">
						<button type="button" class="w-full text-left" onclick={() => sortProducts('stock')}>
							Stock
						</button>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100">
						<button type="button" class="w-full text-left" onclick={() => sortProducts('date-asc')}>
							Date (Oldest)
						</button>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100">
						<button
							type="button"
							class="w-full text-left"
							onclick={() => sortProducts('date-desc')}
						>
							Date (Newest)
						</button>
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
							<a href={`/products/${product.id}`} class="h-[200px] w-full rounded-md">
								<img
									class="h-full w-full rounded-t-lg p-8"
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
								<p class="mt-2 text-sm text-gray-600">In stock: {product.product_stock ?? 0}</p>
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
