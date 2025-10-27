<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '../components/Header.svelte';
	import { page } from '$app/stores';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<section class="flex flex-col h-screen w-full">
{#if !$page.url.pathname.includes('admin')}
	<Header session={data.session} />
{/if}
	{@render children?.()}
</section>
