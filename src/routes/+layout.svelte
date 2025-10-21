<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LandingHeader from '../components/LandingHeader.svelte';
	import SubHeader from '../components/SubHeader.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<section class="flex flex-col h-screen w-full">
<LandingHeader fixed={true}/>
	{@render children?.()}
</section>
