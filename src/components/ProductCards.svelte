<script lang="ts">
  import { Card, Button, Rating, Badge } from "flowbite-svelte";
  export let image;
  export let title;
  export let description;
  export let price;
</script>

<Card class="p-0">
  <a href="/">
    <img class="rounded-t-lg p-8 h-64 mx-auto" src={image || "/bedframe.png"} alt="product 1" />
  </a>
  <div class="px-5 pb-5">
    <a href="/">
      <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title || "Double Deck Apartment Bedframe"}</h5>
    </a>
    <Rating rating={4} size={24} class="mt-2.5 mb-5">
      {#snippet text()}
        <Badge class="ms-3">4</Badge>
      {/snippet}
    </Rating>
    <div class="flex items-center justify-between">
      <span class="text-3xl font-bold text-gray-900 dark:text-white">{price || "$599"}</span>
      <Button class="bg-zinc-800 hover:bg-zinc-500">Add To Cart</Button>
    </div>
  </div>
</Card>