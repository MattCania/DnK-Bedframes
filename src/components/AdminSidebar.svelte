<script lang="ts">
  import { Sidebar, SidebarGroup, SidebarItem, SidebarDropdownWrapper, SidebarButton, uiHelpers } from "flowbite-svelte";
  import { ChartOutline, SalePercentSolid, MessagesSolid, DropboxSolid, UsersSolid, StoreSolid } from "flowbite-svelte-icons";
  import { page } from "$app/state";
	import { signOut } from '@auth/sveltekit/client';

  let activeUrl = $state(page.url.pathname);
  const demoSidebarUi = uiHelpers();
  let isDemoOpen = $state(false);
  const closeDemoSidebar = demoSidebarUi.close;

  $effect(() => {
    isDemoOpen = demoSidebarUi.isOpen;
    activeUrl = page.url.pathname;
  });
</script>

<style>
  :global(.sidebar-zinc) {
    background-color: rgb(63, 63, 70) !important;
    border: none !important;
    padding: 0 !important;
  }

  :global(.sidebar-zinc *) {
    color: white !important;
  }

  :global(.sidebar-zinc svg) {
    color: rgb(229, 231, 235) !important;
  }

  :global(.sidebar-zinc a:hover) {
    background-color: rgb(82, 82, 91) !important; 
  }

  :global(.sidebar-zinc a[aria-current="page"]),
  :global(.sidebar-zinc .active) {
    background-color: rgb(82, 82, 91) !important;
    color: white !important;
  }

  :global(.sidebar-zinc > div) {
    background-color: rgb(63, 63, 70) !important;
    padding: 0 !important;
  }
</style>

<div class="flex relative">
  
  <SidebarButton onclick={demoSidebarUi.toggle} class="mb-2" />
  <Sidebar 
  {activeUrl} 
  backdrop={false} 
  isOpen={isDemoOpen} 
  closeSidebar={closeDemoSidebar} 
  params={{ x: -50, duration: 50 }} 
  position="absolute" 
  classes={{ nonactive: "p-2", active: "p-2 bg-zinc-700" }} 
  class="z-50 h-full sidebar-zinc bg-zinc-700 border-0 p-0"
  >
  <img src="/logo.png" alt="" class="bg-white p-4 mx-auto rounded-lg m-10 w-[172px] h-[172px]">
  <SidebarGroup class="bg-zinc-700">
    <SidebarItem href="/admin" label="Dashboard" class="text-white hover:bg-zinc-600">
      {#snippet icon()}
      <ChartOutline class="h-5 w-5 text-white" />
      {/snippet}
    </SidebarItem>
    <SidebarItem href="/admin/sales" label="Sales" class="text-white hover:bg-zinc-600">
      {#snippet icon()}
      <SalePercentSolid class="h-5 w-5 text-white" />
      {/snippet}
    </SidebarItem>
    <SidebarItem href="/admin/feedback" label="Feedback" class="text-white hover:bg-zinc-600">
      {#snippet icon()}
      <MessagesSolid class="h-5 w-5 text-white" />
      {/snippet}
    </SidebarItem>
    <SidebarItem href="/" label="Shop" class="text-white hover:bg-zinc-600">
      {#snippet icon()}
      <StoreSolid class="h-5 w-5 text-white" />
      {/snippet}
    </SidebarItem>
    
    <SidebarDropdownWrapper label="Products" btnClass="p-2 text-white hover:bg-zinc-600">
      {#snippet icon()}
        <DropboxSolid class="h-5 w-5 text-white" />
        {/snippet}
        <SidebarItem href="/admin/orders" label="Orders" class="text-white hover:bg-zinc-600" />
        <SidebarItem href="/admin/inventory" label="Inventory" class="text-white hover:bg-zinc-600" />
      </SidebarDropdownWrapper>
      
      <SidebarDropdownWrapper label="Account" btnClass="p-2 text-white hover:bg-zinc-600">
        {#snippet icon()}
        <UsersSolid class="h-5 w-5 text-white" />
        {/snippet}
        <SidebarItem href="/admin/profile" label="Profile" class="text-white hover:bg-zinc-600" />
        <SidebarItem href="/admin/employees" label="Employees" class="text-white hover:bg-zinc-600" />
        <SidebarItem onclick={() => signOut()} label="Sign Out" class="cursor-pointer text-white hover:bg-zinc-600" />
        </SidebarDropdownWrapper>
      </SidebarGroup>
    </Sidebar>
    
  </div>