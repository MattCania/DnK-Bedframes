<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import { CartSolid } from 'flowbite-svelte-icons';
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
	export let session;
	export let cartItems: Array<{
		id: number;
		product_id: number | null;
		name: string | null;
		price: number;
		quantity: number;
		colors: string[];
		category: string;
		image: string | null;
	}> = [];
	import { cartCount } from '$lib/stores/cart';
	const user = session?.user;
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
			<NavLi class="lg:text-white" href="/">Home</NavLi>
			<NavLi class="lg:text-white" href="/about">About</NavLi>

			{#if !user}
				<NavLi class="lg:text-white" href="/login">Login</NavLi>
				<NavLi class="lg:text-white" href="/register">Register</NavLi>
			{/if}
		</NavUl>
		<div class="relative lg:mx-8">
			<CartSolid id="cart-drop" class="h-10 w-10 shrink-0 text-white" />
			{#if $cartCount > 0}
				<span
					class="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white"
				>
					{$cartCount}
				</span>
			{/if}
		</div>
		<Dropdown class="w-128" triggeredBy="#cart-drop">
			{#if $cartCount === 0}
				<DropdownGroup>
					<DropdownItem disabled>Your cart is empty</DropdownItem>
					<DropdownItem href="/products">Browse products</DropdownItem>
				</DropdownGroup>
			{:else}
				<DropdownGroup>
					{#each cartItems.slice(0, 5) as item}
						<DropdownItem href={`/products/${item.product_id ?? ''}`}>
							<div class="flex items-center gap-3">
								{#if item.image}
									<img
										src={item.image}
										alt={item.name ?? ''}
										class="h-8 w-8 rounded object-cover"
									/>
								{/if}
								<div class="flex flex-col">
									<span class="text-sm">{item.name}</span>
									<span class="text-xs text-gray-500">Qty: {item.quantity}</span>
								</div>
							</div>
						</DropdownItem>
					{/each}
				</DropdownGroup>
				<DropdownGroup>
					<DropdownItem href="/cart">View cart</DropdownItem>
				</DropdownGroup>
			{/if}
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
					{#if session.role === 'admin' || session.role === 'manager'}
						<DropdownItem href="/admin">Admin</DropdownItem>
					{/if}
					<DropdownItem href="/account">Account</DropdownItem>
					<DropdownItem href="/purchases">Purchases</DropdownItem>
					<DropdownItem href="/reviews">Reviews</DropdownItem>
					<!-- <DropdownItem href="/settings">Settings</DropdownItem> -->
				</DropdownGroup>
				<DropdownGroup>
					<DropdownItem class="w-full text-start" onclick={() => signOut()}>Sign out</DropdownItem>
				</DropdownGroup>
			</Dropdown>
		{/if}
	</div>
</Navbar>
