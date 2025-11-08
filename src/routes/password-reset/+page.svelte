<script lang="ts">
	import { Button, Checkbox, Input, Label } from "flowbite-svelte";
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";

	let email = "";
	let password = "";
	let confirmPassword = "";
	let message = "";

	let showPassword = false;

	const handleEnhance = ({ result }: any) => {
		if (!result) {
			message = "No response from server.";
			return;
		}

		if (result.type === "success") {
			const data = result.data;
			message = data.message;

			if (data.success) {
				email = "";
				password = "";
				confirmPassword = "";

				goto("/login");
			}
		} else {
			message = "Operation failed.";
		}
	};
</script>

<section class="flex justify-center items-center h-screen w-full">
	<div class="flex flex-col gap-4 mx-4 md:mx-auto w-full md:w-1/3 my-auto border-2 border-gray-200 p-4 md:p-8 rounded-lg">
		<form action="?/resetPassword" method="POST" use:enhance={handleEnhance} class="flex flex-col gap-4">
			<h1 class="text-2xl text-center">Reset Password</h1>

			<Label>
				Email:
				<Input name="email" type="email" placeholder="email@gmail.com" bind:value={email} required />
			</Label>

			<Label>
				New Password:
				<Input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter new password" bind:value={password} required />
			</Label>

			<Label>
				Confirm Password:
				<Input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Confirm new password" bind:value={confirmPassword} required />
			</Label>

			<Checkbox bind:checked={showPassword}>Show Password</Checkbox>

			<Button type="submit">Reset Password</Button>
		</form>

		{#if message}
			<p class="text-center text-sm text-gray-700 mt-2">{message}</p>
		{/if}
	</div>
</section>
