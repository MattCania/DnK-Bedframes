<script lang="ts">
	import AdminSidebar from '../../components/AdminSidebar.svelte';
	let { data, children } = $props();
</script>

<section class="flex h-screen w-full flex-col bg-zinc-800 md:flex-row">
	<AdminSidebar />
	<div class="flex-1 overflow-auto bg-white">
		{@render children?.()}
	</div>
</section>
