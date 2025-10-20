<script lang="ts">
  import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from "flowbite-svelte";
</script>

<Footer class="bg-zinc-800 rounded-none">
  <FooterCopyright class="text-white" href="/" by="D&K Furnitures" year={2022} />
  <FooterLinkGroup class="mt-3 flex flex-wrap items-center text-sm text-white sm:mt-0 dark:text-gray-400">
    <FooterLink href="/about">About</FooterLink>
    <FooterLink href="/faqs">FAQs</FooterLink>
    <FooterLink href="/contact">Contact</FooterLink>
  </FooterLinkGroup>
</Footer>