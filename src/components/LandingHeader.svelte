<script lang="ts">
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from "flowbite-svelte";
  export let fixed;
</script>

<Navbar class={`bg-zinc-800 ${fixed ? 'fixed' : ''} z-2`}>
  <NavBrand href="/">
    <img
      src="/logo.png"
      class="bg-white me-3 h-8 sm:h-9 rounded-md"
      alt="D&K Furnitures Logo"
    />
    <span class="self-center text-2xl text-white font-semibold whitespace-nowrap">
      D&K Bedframes
    </span>
  </NavBrand>

  <NavHamburger class="text-white hover:text-zinc-500" />

  <NavUl>
    <NavLi
      class="mx-2 text-black md:text-white text-lg hover:!text-gray-400"
      href="/#home"
    >Home</NavLi>

    <NavLi
      class="mx-2 text-black md:text-white text-lg hover:!text-gray-400"
      href="/#about"
    >About</NavLi>

    <NavLi
      class="mx-2 text-black md:text-white text-lg hover:!text-gray-400"
      href="/#contacts"
    >Contact</NavLi>

    <NavLi
      class="w-full md:w-24 md:text-center bg-white text-zinc-800 text-lg hover:md:text-white mx-2"
      href="/login"
    >Log In</NavLi>

    <NavLi
      class="w-full md:w-24 md:text-center mx-2 text-black md:text-white text-lg hover:!text-gray-400"
      href="/register"
    >Register</NavLi>
  </NavUl>
</Navbar>
