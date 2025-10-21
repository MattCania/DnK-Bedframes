<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import { ShoppingBagOutline, ShoppingBagSolid } from 'flowbite-svelte-icons';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		Avatar,
		DropdownItem,
		DropdownGroup,
		DropdownHeader
	} from 'flowbite-svelte';
	export let user;
</script>

<Navbar breakpoint="lg" class="fixed z-50 w-full bg-zinc-800 ">
	<NavBrand href="/">
		<img src="/logo.png" class="me-3 h-6 sm:h-9" alt="D&K Bedframes Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap text-white dark:text-white">
			D&K Bedframes
		</span>
	</NavBrand>

	<div class="my-auto flex w-fit items-center justify-center gap-0">
		<NavHamburger class="m-0 text-white" />
		<NavUl>
			<NavLi class="md:text-white" href="/">Home</NavLi>
			<NavLi class="md:text-white" href="/about">About</NavLi>
			<NavLi class="md:text-white" href="/contact">Contact</NavLi>

			{#if !user}
				<NavLi class="md:text-white" href="/login">Login</NavLi>
				<NavLi class="md:text-white" href="/register">Register</NavLi>
			{/if}
		</NavUl>
		<ShoppingBagSolid id="cart-drop" class="shrink-0 h-10 w-10 text-white" />
		<Dropdown class="w-128" triggeredBy="#cart-drop">
			<DropdownGroup>
				<DropdownItem>Product</DropdownItem>
			</DropdownGroup>
		</Dropdown>
		{#if user}
			<Avatar
				id="user-drop"
				src={`${user ? user.image : '/user-profile.jpg'}`}
				class="ml-4 cursor-pointer"
				dot={{ color: 'green' }}
			/>
			<Dropdown triggeredBy="#user-drop">
				<DropdownHeader>
					<span class="block text-sm">{user.name}</span>
					<span class="block truncate text-sm font-medium">{user.email}</span>
				</DropdownHeader>
				<DropdownGroup>
					<DropdownItem href="/account">Account</DropdownItem>
					<DropdownItem href="/purchases">Purchases</DropdownItem>
					<DropdownItem href="/settings">Settings</DropdownItem>
				</DropdownGroup>
				<DropdownGroup>
					<DropdownItem onclick={() => signOut()}>Sign out</DropdownItem>
				</DropdownGroup>
			</Dropdown>
		{/if}
	</div>
</Navbar>
