<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LandingHeader from '../components/LandingHeader.svelte';

	let { data, children } = $props();
	console.log(data)
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<section class="flex flex-col h-screen w-full">
<LandingHeader user={data.session?.user}/>
	{@render children?.()}
</section>
