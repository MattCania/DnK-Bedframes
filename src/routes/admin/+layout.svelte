<script lang="ts">
	import AdminSidebar from '../../components/AdminSidebar.svelte';
	let { data, children } = $props();
</script>


<section class="flex flex-col md:flex-row h-screen w-full bg-zinc-800">
	<AdminSidebar/>
	 {@render children?.()}
</section>
