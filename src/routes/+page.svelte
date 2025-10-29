<script lang="ts">
	import { Card, Button, Rating, Badge, Heading, Dropdown, Checkbox } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';
	import Footer from '../components/Footer.svelte';
	import { Pagination } from 'flowbite-svelte';
	import {
		ChevronLeftOutline,
		ChevronRightOutline,
		ChevronDownOutline
	} from 'flowbite-svelte-icons';
	let pages = $state([
		{ name: '1', href: '/docs/components/pagination?page=1', active: false },
		{ name: '2', href: '/docs/components/pagination?page=2', active: false }
	]);
	const previous = () => {
		alert('Previous btn clicked. Make a call to your server to fetch data.');
	};
	const next = () => {
		alert('Next btn clicked. Make a call to your server to fetch data.');
	};

	const products = [
		{
			id: 1,
			name: 'Double-deck bedframe',
			image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
			rating: 4.9,
			price: 7500.0,
			originalPrice: 9500.0
		},
		{
			id: 2,
			name: 'Double-deck bedframe',
			image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
			rating: 4.9,
			price: 4500.0,
			originalPrice: 6500.0
		},
		{
			id: 3,
			name: 'King Size Bedframe',
			image:
				'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop&seed=3',
			rating: 4.9,
			price: 6000.0,
			originalPrice: 7500.0
		},
		{
			id: 4,
			name: 'Double-deck bedframe',
			image:
				'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&seed=4',
			rating: 4.9,
			price: 5000.0,
			originalPrice: 6500.0
		},
		{
			id: 5,
			name: 'Double-deck bedframe',
			image:
				'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop&seed=5',
			rating: 4.9,
			price: 6500.0,
			originalPrice: 8000.0
		},
		{
			id: 6,
			name: 'Double-deck bedframe',
			image:
				'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&seed=6',
			rating: 4.9,
			price: 7600.0,
			originalPrice: 9000.0
		},
		{
			id: 7,
			name: 'Double-deck bedframe',
			image:
				'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop&seed=7',
			rating: 4.9,
			price: 6000.0,
			originalPrice: 7500.0
		},
		{
			id: 8,
			name: 'Double-deck bedframe',
			image:
				'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&seed=8',
			rating: 4.9,
			price: 6000.0,
			originalPrice: 7500.0
		},
		{
			id: 9,
			name: 'Double-deck bedframe',
			image:
				'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop&seed=9',
			rating: 4.9,
			price: 5000.0,
			originalPrice: 6500.0
		},
		{
			id: 10,
			name: 'Double-deck bedframe',
			image:
				'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&seed=10',
			rating: 4.9,
			price: 7000.0,
			originalPrice: 8500.0
		},
		{
			id: 11,
			name: 'Double-deck bedframe',
			image:
				'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop&seed=11',
			rating: 4.9,
			price: 6500.0,
			originalPrice: 8000.0
		},
		{
			id: 12,
			name: 'Double-deck bedframe',
			image:
				'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&seed=12',
			rating: 4.9,
			price: 5000.0,
			originalPrice: 6500.0
		}
	];

	const displayedProducts = products;
</script>

<section class="flex flex-col gap-4 bg-gray-100 py-4 pt-24">
	<!-- <Heading class="mx-auto my-2 py-4 text-center text-4xl">Popular Products</Heading> -->
	<!-- <div class="flex w-full flex-col items-center justify-center gap-4 md:flex-row">
		<Card class=" p-0">
			<a href="/">
				<img
					class="rounded-t-lg p-8"
					src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&seed=12"
					alt="product 1"
				/>
			</a>
			<div class="px-5 pb-5">
				<a href="/">
					<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
						Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport
					</h5>
				</a>
				<Rating rating={4} size={24} class="mt-2.5 mb-5">
					{#snippet text()}
						<Badge class="ms-3">4</Badge>
					{/snippet}
				</Rating>
				<div class="flex items-center justify-between">
					<span class="text-3xl font-bold text-gray-900 dark:text-white">$599</span>
					<Button href="/">Buy now</Button>
				</div>
			</div>
		</Card>
		<Card class=" p-0">
			<a href="/">
				<img
					class="rounded-t-lg p-8"
					src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&seed=12"
					alt="product 1"
				/>
			</a>
			<div class="px-5 pb-5">
				<a href="/">
					<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
						Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport
					</h5>
				</a>
				<Rating rating={4} size={24} class="mt-2.5 mb-5">
					{#snippet text()}
						<Badge class="ms-3">4</Badge>
					{/snippet}
				</Rating>
				<div class="flex items-center justify-between">
					<span class="text-3xl font-bold text-gray-900 dark:text-white">$599</span>
					<Button href="/">Buy now</Button>
				</div>
			</div>
		</Card>
		<Card class=" p-0">
			<a href="/">
				<img
					class="rounded-t-lg p-8"
					src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&seed=12"
					alt="product 1"
				/>
			</a>
			<div class="px-5 pb-5">
				<a href="/">
					<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
						Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport
					</h5>
				</a>
				<Rating rating={4} size={24} class="mt-2.5 mb-5">
					{#snippet text()}
						<Badge class="ms-3">4</Badge>
					{/snippet}
				</Rating>
				<div class="flex items-center justify-between">
					<span class="text-3xl font-bold text-gray-900 dark:text-white">$599</span>
					<Button href="/">Buy now</Button>
				</div>
			</div>
		</Card>
	</div> -->
	<div class="mx-auto h-auto max-w-7xl px-6">
		<div class="rounded-2xl bg-gray-200 p-8">
			<div class="mb-8 flex items-center gap-3">
				<Button
					>Categories<ChevronDownOutline
						class="ms-2 h-6 w-6 text-white dark:text-white"
					/></Button
				>
				<Dropdown simple class="w-48 space-y-1 p-3 text-sm">
					<li class="rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
						<Checkbox checked>All</Checkbox>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
						<Checkbox >Twin</Checkbox>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
						<Checkbox>Twin XL</Checkbox>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
						<Checkbox>Full(Double)</Checkbox>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
						<Checkbox>Queen-Sized</Checkbox>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
						<Checkbox>King-Sized</Checkbox>
					</li>
				</Dropdown>
				<Button
					>Sort By<ChevronDownOutline
						class="ms-2 h-6 w-6 text-white dark:text-white"
					/></Button
				>
				<Dropdown simple class="w-48 space-y-1 p-3 text-sm">
					<li class="rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
						<Checkbox>Reviews</Checkbox>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
						<Checkbox>Date Released (Ascending)</Checkbox>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
						<Checkbox>Date Released (Descending)</Checkbox>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
						<Checkbox>Stock</Checkbox>
					</li>
					<li class="rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
						<Checkbox>Sold</Checkbox>
					</li>
				</Dropdown>
			</div>

			<div
				class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
				in:fade
			>
				{#each displayedProducts as product (product.id)}
					<Card class="p-0">
						<a href="/">
							<img class="rounded-t-lg p-8" src={product.image} alt={product.name} />
						</a>
						<div class="px-5 pb-5">
							<a href="/">
								<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
									{product.name}
								</h5>
							</a>
							<Rating rating={4} size={24} class="mt-2.5 mb-5">
								{#snippet text()}
									<Badge class="ms-3">{product.rating}</Badge>
								{/snippet}
							</Rating>
							<div class="flex items-center justify-between">
								<span class="text-lg font-bold text-gray-900 dark:text-white"
									>PHP{product.price.toLocaleString('en-PH', {
										style: 'currency',
										currency: 'PHP'
									})}</span
								>
								<Button class="h-fit" href="/">Buy now</Button>
							</div>
						</div>
					</Card>
				{/each}
			</div>

			<div class="mt-8 text-center">
				<div class="flex flex-col items-center justify-center gap-3">
					<Pagination {pages} {previous} {next}>
						{#snippet prevContent()}
							<span class="sr-only">Previous</span>
							<ChevronLeftOutline class="h-5 w-5" />
						{/snippet}
						{#snippet nextContent()}
							<span class="sr-only">Next</span>
							<ChevronRightOutline class="h-5 w-5" />
						{/snippet}
					</Pagination>
				</div>
			</div>
		</div>
	</div>
</section>
<Footer />
