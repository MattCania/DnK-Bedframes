<script lang="ts">
	import AdminSidebar from '../../components/AdminSidebar.svelte';
	import Footer from '../../components/Footer.svelte';
	let { data, children } = $props();
</script>


<section class="flex flex-col h-full w-full bg-zinc-800">
	{@render children?.()}
</section>
