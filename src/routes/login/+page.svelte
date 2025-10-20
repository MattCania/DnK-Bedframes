<script lang="ts">
	import LandingHeader from '../../components/LandingHeader.svelte';
	import Footer from '../../components/Footer.svelte';
	import { Card, Button, Label, Input, Checkbox } from 'flowbite-svelte';
	import { signIn } from '@auth/sveltekit/client';
</script>

<LandingHeader fixed={true} />
<Card class="m-auto p-4 sm:p-6 md:p-8">
	<form class="flex flex-col space-y-6" action="/">
		<h3 class="mx-auto text-2xl font-medium text-gray-900 dark:text-white">Login</h3>
		<Label class="space-y-2">
			<span>Email</span>
			<Input type="email" name="email" placeholder="name@company.com" required />
		</Label>
		<Label class="space-y-2">
			<span>Your password</span>
			<Input type="password" name="password" placeholder="•••••" required />
		</Label>
		<div class="flex items-start">
			<Checkbox>Remember me</Checkbox>
			<a
				href="/verify-email"
				class="ms-auto text-sm text-zinc-700 hover:underline dark:text-zinc-500">Forgot password?</a
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
