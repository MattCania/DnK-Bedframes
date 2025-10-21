<script lang="ts">
	import { Card, Button, Label, Input, Checkbox, Heading, P } from 'flowbite-svelte';
	import { signIn } from '@auth/sveltekit/client';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	const formValues = {
		email: '',
		password: ''
	};
	let showPassword = false;
</script>

<section class="pt-32 lg:pt-24 flex h-full flex-col items-center justify-center gap-0 bg-zinc-100 lg:flex-row">
	<section id="home" class="h-full lg:h-auto w-full px-8 md:px-0 lg:w-1/3">
		<div class="my-32 flex h-1/2 w-auto flex-col text-center">
			<Heading tag="h1" class="mb-4 text-4xl font-extrabold md:text-5xl lg:text-6xl">
				Perfect for Families, Ideal for Small Spaces.
			</Heading>
			<P class="mb-6 text-lg sm:px-16 lg:text-xl xl:px-12 text-center w-full dark:text-gray-400">
				Smart design, sturdy frame, and modern style, the bunk bed that saves space without
				sacrificing comfort.
			</P>
			<Button class="mx-auto w-fit bg-zinc-800 hover:bg-zinc-500" href="/products">
				Shop Now
				<ArrowRightOutline class="ms-2 h-6 w-6" />
			</Button>
		</div>
	</section>

	<Card class="mx-auto my-4 p-4 sm:mx-16 sm:p-6 md:my-auto md:p-8">
		<form class="flex flex-col space-y-6" action="/">
			<h3 class="mx-auto text-2xl font-medium text-gray-900 dark:text-white">Login</h3>
			<Label class="space-y-2">
				<span>Email</span>
				<Input type="email" name="email" placeholder="name@company.com" required />
			</Label>
			<Label class="space-y-2">
				<span>Your password</span>
				<Input
					type={showPassword ? 'text' : 'password'}
					name="password"
					placeholder="•••••"
					required
				/>
			</Label>
			<div class="flex items-start">
				<Checkbox bind:checked={showPassword}>Show Password</Checkbox>
				<a
					href="/verify-email"
					class="ms-auto text-sm text-zinc-700 hover:underline dark:text-zinc-500"
					>Forgot password?</a
				>
			</div>
			<Button type="submit" class="w-full">Login to your account</Button>
			<Button
				onclick={() => signIn('google')}
				type="button"
				class="w-full bg-red-500 hover:bg-red-600"
			>
				Sign in with Google
			</Button>
			<div class="text-sm font-medium text-primary-500 dark:text-primary-300">
				Not registered? <a
					href="/register"
					class="text-primary-700 hover:underline dark:text-primary-500">Create account</a
				>
			</div>
		</form>
	</Card>
</section>
