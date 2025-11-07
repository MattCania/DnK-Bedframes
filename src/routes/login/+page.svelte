<script lang="ts">
	import { Card, Button, Label, Input, Checkbox, Heading, P, Alert } from 'flowbite-svelte';
	import { signIn } from '@auth/sveltekit/client';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';

	let formValues = {
		user: '',
		password: ''
	};

	let showPassword = false;
	let isSubmitting = false;
	let loginError = '';

	const togglePassword = () => {
		showPassword = !showPassword;
	};

	$: justRegistered = $page.url.searchParams.get('registered') === 'true';

	async function handleLogin() {
		if (!formValues.user || !formValues.password) {
			loginError = 'Please fill in all fields';
			return;
		}

		isSubmitting = true;
		loginError = '';

		try {
			const result = await signIn('credentials', {
				user: formValues.user,
				password: formValues.password,
				redirect: false
			});

			if (result?.error) {
				loginError =
					result.error === 'CredentialsSignin'
						? 'Invalid credentials. Please check your email/contact number and password.'
						: 'An error occurred during login. Please try again.';
			} else {
				window.location.href = '/';
			}
		} catch (error) {
			console.error('Login error:', error);
			loginError = 'An unexpected error occurred. Please try again later.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section
	class="flex min-h-screen w-full flex-col items-center justify-center gap-0 bg-zinc-100 pt-32 lg:flex-row lg:pt-24"
>
	<div class="my-0 flex h-1/2 w-auto flex-col px-8 text-center lg:pl-32">
		<Heading tag="h1" class="mb-4 text-4xl font-extrabold md:text-5xl lg:text-6xl">
			Perfect for Families, Ideal for Small Spaces.
		</Heading>
		<P class="mb-6 w-full text-center text-lg sm:px-16 lg:text-xl xl:px-12 dark:text-gray-400">
			Smart design, sturdy frame, and modern style, the bunk bed that saves space without
			sacrificing comfort.
		</P>
		<Button class="mx-auto w-fit bg-zinc-800 hover:bg-zinc-500" href="/products">
			Shop Now
			<ArrowRightOutline class="ms-2 h-6 w-6" />
		</Button>
	</div>

	<Card class="mx-auto my-4 p-4 sm:mx-16 sm:p-6 md:my-auto md:mr-32 md:p-8">
		<form
			class="flex flex-col space-y-6"
			onsubmit={(e) => {
				e.preventDefault();
				handleLogin();
			}}
		>
			<h3 class="mx-auto text-2xl font-medium text-gray-900 dark:text-white">Login</h3>

			{#if justRegistered}
				<Alert color="green" class="mb-4">
					<span class="font-medium">Registration successful!</span>
					Please log in with your credentials.
				</Alert>
			{/if}

			{#if loginError}
				<Alert color="red" class="mb-4">
					<span class="font-medium">Error!</span>
					{loginError}
				</Alert>
			{/if}

			<Label class="space-y-2">
				<span>Email or Contact Number</span>
				<Input
					type="text"
					name="user"
					bind:value={formValues.user}
					placeholder="user@gmail.com or +63 912 345 6789"
					required
				/>
			</Label>

			<Label class="space-y-2">
				<span>Your password</span>
				<Input
					type={showPassword ? 'text' : 'password'}
					name="password"
					bind:value={formValues.password}
					placeholder="•••••"
					required
				/>
			</Label>

			<div class="flex items-start">
				<Checkbox bind:checked={showPassword}>Show Password</Checkbox>

				<a
					href="/verify-email"
					class="ms-auto text-sm text-zinc-700 hover:underline dark:text-zinc-500"
				>
					Forgot password?
				</a>
			</div>

			<Button type="submit" class="w-full" disabled={isSubmitting}>
				{isSubmitting ? 'Logging in...' : 'Login to your account'}
			</Button>

			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-white px-2 text-gray-500">Or continue with</span>
				</div>
			</div>

			<Button
				onclick={() => signIn('google', { callbackUrl: '/?from=oauth' })}
				type="button"
				class="w-full bg-red-500 hover:bg-red-600"
			>
				<svg class="mr-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						fill="currentColor"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					/>
					<path
						fill="currentColor"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/>
					<path
						fill="currentColor"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					/>
					<path
						fill="currentColor"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					/>
				</svg>
				Sign in with Google
			</Button>

			<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
				Not registered?
				<a href="/register" class="text-blue-700 hover:underline dark:text-blue-500">
					Create account
				</a>
			</div>
		</form>
	</Card>
</section>
