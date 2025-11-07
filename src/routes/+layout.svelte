<script lang="ts">
	import '../app.css';
	import logo from '$lib/assets/Logo_BG.svg';
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
	<link rel="icon" href={logo} />
</svelte:head>

<section class="flex h-screen w-full flex-col">
	{#if !$page.url.pathname.includes('admin')}
		<Header session={data.session} cartItems={data.cartItems} />
	{/if}
	{@render children?.()}
</section>
