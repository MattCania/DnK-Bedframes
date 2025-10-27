<script>
	import { Button, Input, Select } from 'flowbite-svelte';
	
	let editMode = false;
	
	// Account data
	let accountData = {
		account_id: 12345,
		email: 'john.doe@example.com',
		role: 'customer',
		provider: 'local',
		provider_id: 'local_12345'
	};

	// Profile data
	let profileData = {
		profile_id: 67890,
		firstname: 'John',
		middlename: 'Michael',
		lastname: 'Doe',
		contacts: '+63 912 345 6789',
		birthday: '1990-05-15',
		address: '123 Main Street, Quezon City, Metro Manila',
		gender: 'male'
	};

	// Store original data for cancel functionality
	let originalData = { ...profileData };

	const roleOptions = [
		{ value: 'customer', name: 'Customer' },
		{ value: 'admin', name: 'Admin' },
		{ value: 'seller', name: 'Seller' }
	];

	const genderOptions = [
		{ value: 'male', name: 'Male' },
		{ value: 'female', name: 'Female' },
		{ value: 'other', name: 'Other' },
		{ value: 'prefer_not_to_say', name: 'Prefer not to say' }
	];

	function handleEdit() {
		editMode = true;
		originalData = { ...profileData };
	}

	function handleSave() {
		console.log('Saving profile data:', profileData);
		alert('Profile updated successfully!');
		editMode = false;
	}

	function handleCancel() {
		profileData = { ...originalData };
		editMode = false;
	}
</script>

<div class="bg-white min-h-screen">
	<div class="max-w-4xl mx-auto p-6">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
			<p class="text-sm text-gray-600">Manage your account information and profile details</p>
		</div>

		<!-- Account Information Section -->
		<div class="-t-2 -b-2  py-6 mb-8">
			<h2 class="text-lg font-bold text-gray-900 mb-4">Account Information</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Account ID -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Account ID
					</label>
					<div class="px-4 py-2 bg-gray-100 rounded-lg text-gray-700  ">
						{accountData.account_id}
					</div>
				</div>

				<!-- Email -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Email
					</label>
					<div class="px-4 py-2 bg-gray-100 rounded-lg text-gray-700  ">
						{accountData.email}
					</div>
				</div>

				<!-- Role -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Role
					</label>
					<div class="px-4 py-2 bg-gray-100 rounded-lg text-gray-700   capitalize">
						{accountData.role}
					</div>
				</div>

				<!-- Provider -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Provider
					</label>
					<div class="px-4 py-2 bg-gray-100 rounded-lg text-gray-700   capitalize">
						{accountData.provider}
					</div>
				</div>

				<!-- Provider ID -->
				<div class="md:col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Provider ID
					</label>
					<div class="px-4 py-2 bg-gray-100 rounded-lg text-gray-700  ">
						{accountData.provider_id}
					</div>
				</div>
			</div>
		</div>

		<!-- Profile Information Section -->
		<div class="-t-2  pt-6 mb-8">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-lg font-bold text-gray-900">Profile Information</h2>
				{#if !editMode}
					<Button onclick={handleEdit} color="blue" size="sm">
						Edit Profile
					</Button>
				{/if}
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Profile ID -->
				<div class="md:col-span-2">
					<label aria-labelledby="id" class="block text-sm font-medium text-gray-700 mb-2">
						Profile ID
					</label>
					<div class="px-4 py-2 bg-gray-100 rounded-lg text-gray-700  ">
						{profileData.profile_id}
					</div>
				</div>

				<!-- First Name -->
				<div>
					<label for="firstname" class="block text-sm font-medium text-gray-700 mb-2">
						First Name *
					</label>
					{#if editMode}
						<Input 
							id="firstname"
							type="text" 
							bind:value={profileData.firstname}
							required
						/>
					{:else}
						<div class="px-4 py-2 bg-gray-50 rounded-lg text-gray-700  -gray-200">
							{profileData.firstname}
						</div>
					{/if}
				</div>

				<!-- Middle Name -->
				<div>
					<label for="middlename" class="block text-sm font-medium text-gray-700 mb-2">
						Middle Name
					</label>
					{#if editMode}
						<Input 
							id="middlename"
							type="text" 
							bind:value={profileData.middlename}
						/>
					{:else}
						<div class="px-4 py-2 bg-gray-50 rounded-lg text-gray-700  -gray-200">
							{profileData.middlename || '-'}
						</div>
					{/if}
				</div>

				<!-- Last Name -->
				<div>
					<label for="lastname" class="block text-sm font-medium text-gray-700 mb-2">
						Last Name *
					</label>
					{#if editMode}
						<Input 
							id="lastname"
							type="text" 
							bind:value={profileData.lastname}
							required
						/>
					{:else}
						<div class="px-4 py-2 bg-gray-50 rounded-lg text-gray-700  -gray-200">
							{profileData.lastname}
						</div>
					{/if}
				</div>

				<!-- Gender -->
				<div>
					<label for="gender" class="block text-sm font-medium text-gray-700 mb-2">
						Gender
					</label>
					{#if editMode}
						<Select 
							id="gender"
							bind:value={profileData.gender}
							items={genderOptions}
						/>
					{:else}
						<div class="px-4 py-2 bg-gray-50 rounded-lg text-gray-700  -gray-200 capitalize">
							{profileData.gender ? genderOptions.find(g => g.value === profileData.gender)?.name : '-'}
						</div>
					{/if}
				</div>

				<!-- Birthday -->
				<div>
					<label for="birthday" class="block text-sm font-medium text-gray-700 mb-2">
						Birthday
					</label>
					{#if editMode}
						<Input 
							id="birthday"
							type="date" 
							bind:value={profileData.birthday}
						/>
					{:else}
						<div class="px-4 py-2 bg-gray-50 rounded-lg text-gray-700  -gray-200">
							{profileData.birthday || '-'}
						</div>
					{/if}
				</div>

				<!-- Contacts -->
				<div>
					<label for="contacts" class="block text-sm font-medium text-gray-700 mb-2">
						Contact Number
					</label>
					{#if editMode}
						<Input 
							id="contacts"
							type="tel" 
							bind:value={profileData.contacts}
						/>
					{:else}
						<div class="px-4 py-2 bg-gray-50 rounded-lg text-gray-700  -gray-200">
							{profileData.contacts || '-'}
						</div>
					{/if}
				</div>

				<!-- Address -->
				<div class="md:col-span-2">
					<label for="address" class="block text-sm font-medium text-gray-700 mb-2">
						Address
					</label>
					{#if editMode}
						<textarea
							id="address"
							bind:value={profileData.address}
							rows="3"
							class="w-full px-4 py-2   rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						></textarea>
					{:else}
						<div class="px-4 py-2 bg-gray-50 rounded-lg text-gray-700  -gray-200">
							{profileData.address || '-'}
						</div>
					{/if}
				</div>
			</div>

			<!-- Action Buttons (only shown in edit mode) -->
			{#if editMode}
				<div class="flex gap-3 mt-6">
					<Button 
						onclick={handleSave}
						color="green"
						class="flex-1"
					>
						Save Changes
					</Button>
					<Button 
						onclick={handleCancel}
						color="light"
						class="flex-1"
					>
						Cancel
					</Button>
				</div>
			{/if}
		</div>
	</div>
</div>