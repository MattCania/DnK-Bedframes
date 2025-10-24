<script lang="ts">
	import { Card, Button, Label, Input, Checkbox, Radio } from 'flowbite-svelte';
	let step = 1;

	let formData = {
		contactNumber: '',
		otp: '',
		firstName: '',
		middleName: '',
		lastName: '',
		address: '',
		password: '',
		confirmPassword: '',
		birthday: '',
		gender: ''
	};

	let showPassword = false;

	function handlePhoneSubmit(e: Event) {
		e.preventDefault();
		console.log('Step 1 - Phone number submitted:', formData.contactNumber);
		step = 2;
	}

	function handleOtpSubmit(e: Event) {
		e.preventDefault();
		console.log('Step 2 - OTP entered:', formData.otp);
		step = 3;
	}

	function handleFinalSubmit(e: Event) {
		e.preventDefault();
		console.log('Step 3 - Full registration:', formData);
	}
</script>

<section class="mx-auto my-4 mt-28 flex flex-col lg:flex-row h-screen w-full pb-20">
	{#if step === 1}
	<section class="my-auto mr-0 ml-auto flex h-100 w-100 flex-col">
		<img src="/logo.png" alt="" />
	</section>
	{/if}
	<Card class="m-auto h-fit p-4 sm:p-6 md:w-1/2 md:p-8">
		{#if step === 1}
			<form class="flex flex-col space-y-6" on:submit={handlePhoneSubmit}>
				<h3 class="mx-auto text-2xl font-medium text-gray-900 dark:text-white">
					Step 1: Enter Phone Number
				</h3>

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

				<Button type="submit" class="w-full">Send Verification Code</Button>
			</form>
		{:else if step === 2}
			<form class="flex flex-col space-y-6" on:submit={handleOtpSubmit}>
				<h3 class="mx-auto text-2xl font-medium text-gray-900 dark:text-white">
					Step 2: Verify SMS Code
				</h3>

				<Label class="space-y-2">
					<span>Enter OTP</span>
					<Input
						type="text"
						name="otp"
						bind:value={formData.otp}
						placeholder="Enter 6-digit code"
						required
					/>
				</Label>

				<Button type="submit" class="w-full">Verify</Button>

				<Button color="gray" class="w-full" onclick={() => (step = 1)}>Go Back</Button>
			</form>
		{:else if step === 3}
			<form class="flex flex-col space-y-6" on:submit={handleFinalSubmit}>
				<h3 class="mx-auto text-2xl font-medium text-gray-900 dark:text-white">
					Step 3: Complete Registration
				</h3>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Label class="space-y-2">
						<span>First Name</span>
						<Input type="text" bind:value={formData.firstName} placeholder="Juan" required />
					</Label>
					<Label class="space-y-2">
						<span>Middle Name</span>
						<Input type="text" bind:value={formData.middleName} placeholder="Lopez" />
					</Label>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Label class="space-y-2">
						<span>Last Name</span>
						<Input type="text" bind:value={formData.lastName} placeholder="Dela Cruz" required />
					</Label>
					<Label class="space-y-2">
						<span>Address</span>
						<Input
							type="text"
							bind:value={formData.address}
							placeholder="Amparo Caloocan City"
							required
						/>
					</Label>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Label class="space-y-2">
						<span>Birthday</span>
						<Input type="date" bind:value={formData.birthday} required />
					</Label>
					<Label class="space-y-2">
						<span>Gender</span>
						<div class="mt-2 flex gap-6">
							<Radio name="gender" value="male" bind:group={formData.gender}>Male</Radio>
							<Radio name="gender" value="female" bind:group={formData.gender}>Female</Radio>
						</div>
					</Label>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Label class="space-y-2">
						<span>Password</span>
						<Input
							type={showPassword ? 'text' : 'password'}
							bind:value={formData.password}
							placeholder="•••••"
							required
						/>
					</Label>
					<Label class="space-y-2">
						<span>Confirm Password</span>
						<Input
							type={showPassword ? 'text' : 'password'}
							bind:value={formData.confirmPassword}
							placeholder="•••••"
							required
						/>
					</Label>
				</div>

				<div class="flex items-start">
					<Checkbox bind:checked={showPassword}>Show Password</Checkbox>
				</div>

				<Button type="submit" class="w-full">Finish Registration</Button>

				<Button color="gray" class="w-full" onclick={() => (step = 2)}>Go Back</Button>
			</form>
		{/if}
	</Card>
</section>
