<script lang="ts">
	import { Card, Button, Label, Input, Checkbox, Radio } from 'flowbite-svelte';

	let formData = {
		firstName: '',
		middleName: '',
		lastName: '',
		email: '',
		address: '',
		password: '',
		contactNumber: '',
		confirmPassword: '',
		birthday: '',
		gender: ''
	};
	let showPassword = false;

	function handleSubmit(e: Event) {
		e.preventDefault();
		console.log('Sign up submitted:', formData);
	}
</script>

<section class="mx-auto my-4 mt-28 flex h-screen w-full pb-20">
	<Card class="h-fit m-auto p-4 sm:p-6 md:p-8 max-w-3xl">
	<form class="flex flex-col space-y-6" on:submit={handleSubmit}>
		<h3 class="mx-auto text-2xl font-medium text-gray-900 dark:text-white">Sign Up</h3>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Label class="space-y-2">
				<span>First Name</span>
				<Input
					type="text"
					name="firstName"
					bind:value={formData.firstName}
					placeholder="Juan"
					required
				/>
			</Label>
			<Label class="space-y-2">
				<span>Middle Name</span>
				<Input
					type="text"
					name="middleName"
					bind:value={formData.middleName}
					placeholder="Lopez"
				/>
			</Label>
		</div>

		<!-- Row 2: Last Name and Email -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Label class="space-y-2">
				<span>Last Name</span>
				<Input
					type="text"
					name="lastName"
					bind:value={formData.lastName}
					placeholder="Dela Cruz"
					required
				/>
			</Label>
			<Label class="space-y-2">
				<span>Email</span>
				<Input
					type="email"
					name="email"
					bind:value={formData.email}
					placeholder="email123@domain.com"
					required
				/>
			</Label>
		</div>

		<!-- Row 3: Address and Contact Number -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Label class="space-y-2">
				<span>Address</span>
				<Input
					type="text"
					name="address"
					bind:value={formData.address}
					placeholder="Amparo Caloocan City"
					required
				/>
			</Label>
			<Label class="space-y-2">
				<span>Contact Number</span>
				<Input
					type="tel"
					name="contactNumber"
					bind:value={formData.contactNumber}
					placeholder="+63 912 345 6789"
					required
				/>
			</Label>
		</div>

		<!-- Row 4: Birthday and Gender -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Label class="space-y-2">
				<span>Birthday</span>
				<Input
					type="date"
					name="birthday"
					bind:value={formData.birthday}
					required
				/>
			</Label>
			<Label class="space-y-2">
				<span>Gender</span>
				<div class="flex gap-6 mt-2">
					<Radio name="gender" value="male" bind:group={formData.gender}>Male</Radio>
					<Radio name="gender" value="female" bind:group={formData.gender}>Female</Radio>
				</div>
			</Label>
		</div>

		<!-- Row 5: Password and Confirm Password -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Label class="space-y-2">
				<span>Password</span>
				<Input
					type={showPassword ? 'text' : 'password'}
					name="password"
					bind:value={formData.password}
					placeholder="•••••"
					required
				/>
			</Label>
			<Label class="space-y-2">
				<span>Confirm Password</span>
				<Input
					type={showPassword ? 'text' : 'password'}
					name="confirmPassword"
					bind:value={formData.confirmPassword}
					placeholder="•••••"
					required
				/>
			</Label>
		</div>

		<!-- Show Password Checkbox -->
		<div class="flex items-start">
			<Checkbox bind:checked={showPassword}>Show Password</Checkbox>
		</div>

		<!-- Sign Up Button -->
		<Button type="submit" class="w-full">Sign Up</Button>

		<!-- Footer Link -->
		<div class="text-sm font-medium text-primary-500 dark:text-primary-300">
			Already have an account? <a
				href="/login"
				class="text-primary-700 hover:underline dark:text-primary-500">Login here</a
			>
		</div>
	</form>
</Card>
</section>
