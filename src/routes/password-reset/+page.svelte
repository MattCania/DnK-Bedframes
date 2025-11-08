<script lang="ts">
	import { Button, Input, Label } from "flowbite-svelte";


	let mailMode = true
	let verifyMode = false

</script>

<section class="flex justify-center items-center h-screen w-full md:pt-22">

	{#if mailMode}
	
	<form action="?/send-mail" class="flex flex-col gap-4 mx-4 md:mx-auto my-auto border-2 border-gray-200 w-fit p-4 md:p-8 rounded-lg">
		<Label class="text-xl">
			<h1 class="text-2xl my-2 w-full text-center">Verify Your Email</h1>
			Email:
			<Input name="email" placeholder="email@gmail.com"/>
		</Label>
		<Button type="submit">Verify</Button>
		<span class="w-200 text-center mx-auto text-red-600">Note: You will be sent a code to verify account ownership</span>
		</form>
	{/if}



</section>
