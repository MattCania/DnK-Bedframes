<script lang="ts">
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, P } from "flowbite-svelte";
</script>

<Navbar breakpoint="lg" class="fixed bg-zinc-800 text-white">
  <NavBrand href="/">
    <img src="/logo.png" class="me-3 h-6 sm:h-9" alt="D&K Bedframes Logo" />
    <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">D&K Bedframes</span>
  </NavBrand>
  <NavHamburger />
  <NavUl>
    <NavLi class="text-white" href="/">Home</NavLi>
    <NavLi class="text-white" href="/about">About</NavLi>
    <NavLi class="text-white" href="/contact">Contact</NavLi>
    <NavLi class="text-white" href="/login">Login</NavLi>
    <NavLi class="text-white" href="/register">Register</NavLi>
  </NavUl>
</Navbar>
