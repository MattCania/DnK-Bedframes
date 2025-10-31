<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '../components/Header.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { setCartCount } from '$lib/stores/cart';

	let { data, children } = $props();

	onMount(() => {
		if (typeof data?.cartCount === 'number') setCartCount(data.cartCount);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<section class="flex h-screen w-full flex-col">
	{#if !$page.url.pathname.includes('admin')}
		<Header session={data.session} cartItems={data.cartItems} />
	{/if}
	{@render children?.()}
</section>
