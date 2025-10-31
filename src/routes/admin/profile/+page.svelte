<script>
	import { Button, Input, Select } from 'flowbite-svelte';

	let editMode = false;

	export let data;
	const user = data.session;
	const account = data.account;

	let accountData = {
		account_id: account?.id ?? null,
		email: account?.email ?? user?.user?.email ?? '',
		role: account?.role ?? 'admin',
		provider: account?.provider ?? 'local',
		provider_id: account?.provider_id ?? ''
	};

	let profileData = {
		profile_id: account?.id ?? null,
		firstname: account?.firstname ?? '',
		middlename: account?.middlename ?? '',
		lastname: account?.lastname ?? '',
		contacts: account?.contacts ?? '',
		birthday: account?.birthday ?? '',
		address: account?.address ?? '',
		gender: account?.gender ?? ''
	};

	let originalData = { ...profileData };

	const genderOptions = [
		{ value: 'male', name: 'Male' },
		{ value: 'female', name: 'Female' },
		{ value: 'prefer_not_to_say', name: 'Prefer not to say' }
	];

	function handleEdit() {
		editMode = true;
		originalData = { ...profileData };
	}

	let isSaving = false;
	async function handleSave() {
		if (isSaving) return;
		isSaving = true;
		try {
			const payload = {
				firstname: profileData.firstname?.trim(),
				middlename: profileData.middlename?.trim() || null,
				lastname: profileData.lastname?.trim(),
				contacts: profileData.contacts?.trim() || null,
				birthday: profileData.birthday || null,
				address: profileData.address?.trim() || null,
				gender:
					profileData.gender === 'male' || profileData.gender === 'female'
						? profileData.gender
						: null
			};

			const res = await fetch('/api/account', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const data = await res.json();
			if (!res.ok || !data?.success) {
				throw new Error(data?.message || 'Failed to update profile');
			}

			const acc = data.account;
			profileData = {
				profile_id: acc.id,
				firstname: acc.firstname ?? '',
				middlename: acc.middlename ?? '',
				lastname: acc.lastname ?? '',
				contacts: acc.contacts ?? '',
				birthday: acc.birthday ?? '',
				address: acc.address ?? '',
				gender: acc.gender ?? ''
			};
			originalData = { ...profileData };
			editMode = false;
			alert('Profile updated successfully!');
		} catch (e) {
			console.error(e);
		} finally {
			isSaving = false;
		}
	}

	function handleCancel() {
		profileData = { ...originalData };
		editMode = false;
	}
</script>

<div class="min-h-screen bg-white">
	<div class="mx-auto max-w-4xl p-6">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Admin Profile</h1>
			<p class="text-sm text-gray-600">Manage your admin account and profile details</p>
		</div>

		<!-- Account Information Section -->
		<div class="-t-2 -b-2 mb-8 py-6">
			<h2 class="mb-4 text-lg font-bold text-gray-900">Account Information</h2>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Account ID -->
				<div>
					<p class="mb-2 block text-sm font-medium text-gray-700">Account ID</p>
					<div class="rounded-lg bg-gray-100 px-4 py-2 text-gray-700">
						{accountData.account_id}
					</div>
				</div>

				<!-- Email -->
				<div>
					<p class="mb-2 block text-sm font-medium text-gray-700">Email</p>
					<div class="rounded-lg bg-gray-100 px-4 py-2 text-gray-700">
						{user?.user?.email}
					</div>
				</div>

				<!-- Role -->
				<div>
					<p class="mb-2 block text-sm font-medium text-gray-700">Role</p>
					<div class="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 capitalize">
						{accountData.role}
					</div>
				</div>

				<!-- Provider -->
				<div>
					<p class="mb-2 block text-sm font-medium text-gray-700">Provider</p>
					<div class="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 capitalize">
						{accountData.provider}
					</div>
				</div>

				<!-- Provider ID -->
				<div class="md:col-span-2">
					<p class="mb-2 block text-sm font-medium text-gray-700">Provider ID</p>
					<div class="rounded-lg bg-gray-100 px-4 py-2 text-gray-700">
						{accountData.provider_id}
					</div>
				</div>
			</div>
		</div>

		<!-- Profile Information Section -->
		<div class="-t-2 mb-8 pt-6">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-bold text-gray-900">Profile Information</h2>
				{#if !editMode}
					<Button onclick={handleEdit} color="blue" size="sm">Edit Profile</Button>
				{/if}
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Profile ID -->
				<div class="md:col-span-2">
					<p class="mb-2 block text-sm font-medium text-gray-700">Profile ID</p>
					<div class="rounded-lg bg-gray-100 px-4 py-2 text-gray-700">
						{profileData.profile_id}
					</div>
				</div>

				<!-- First Name -->
				<div>
					<label for="firstname" class="mb-2 block text-sm font-medium text-gray-700">
						First Name *
					</label>
					{#if editMode}
						<Input id="firstname" type="text" bind:value={profileData.firstname} required />
					{:else}
						<div class="-gray-200 rounded-lg bg-gray-50 px-4 py-2 text-gray-700">
							{profileData.firstname}
						</div>
					{/if}
				</div>

				<!-- Middle Name -->
				<div>
					<label for="middlename" class="mb-2 block text-sm font-medium text-gray-700">
						Middle Name
					</label>
					{#if editMode}
						<Input id="middlename" type="text" bind:value={profileData.middlename} />
					{:else}
						<div class="-gray-200 rounded-lg bg-gray-50 px-4 py-2 text-gray-700">
							{profileData.middlename || '-'}
						</div>
					{/if}
				</div>

				<!-- Last Name -->
				<div>
					<label for="lastname" class="mb-2 block text-sm font-medium text-gray-700">
						Last Name *
					</label>
					{#if editMode}
						<Input id="lastname" type="text" bind:value={profileData.lastname} required />
					{:else}
						<div class="-gray-200 rounded-lg bg-gray-50 px-4 py-2 text-gray-700">
							{profileData.lastname}
						</div>
					{/if}
				</div>

				<!-- Gender -->
				<div>
					<label for="gender" class="mb-2 block text-sm font-medium text-gray-700"> Gender </label>
					{#if editMode}
						<Select id="gender" bind:value={profileData.gender} items={genderOptions} />
					{:else}
						<div class="-gray-200 rounded-lg bg-gray-50 px-4 py-2 text-gray-700 capitalize">
							{profileData.gender
								? genderOptions.find((g) => g.value === profileData.gender)?.name
								: '-'}
						</div>
					{/if}
				</div>

				<!-- Birthday -->
				<div>
					<label for="birthday" class="mb-2 block text-sm font-medium text-gray-700">
						Birthday
					</label>
					{#if editMode}
						<Input id="birthday" type="date" bind:value={profileData.birthday} />
					{:else}
						<div class="-gray-200 rounded-lg bg-gray-50 px-4 py-2 text-gray-700">
							{profileData.birthday || '-'}
						</div>
					{/if}
				</div>

				<!-- Contacts -->
				<div>
					<label for="contacts" class="mb-2 block text-sm font-medium text-gray-700">
						Contact Number
					</label>
					{#if editMode}
						<Input id="contacts" type="tel" bind:value={profileData.contacts} />
					{:else}
						<div class="-gray-200 rounded-lg bg-gray-50 px-4 py-2 text-gray-700">
							{profileData.contacts || '-'}
						</div>
					{/if}
				</div>

				<!-- Address -->
				<div class="md:col-span-2">
					<label for="address" class="mb-2 block text-sm font-medium text-gray-700">
						Address
					</label>
					{#if editMode}
						<textarea
							id="address"
							bind:value={profileData.address}
							rows="3"
							class="w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						></textarea>
					{:else}
						<div class="-gray-200 rounded-lg bg-gray-50 px-4 py-2 text-gray-700">
							{profileData.address || '-'}
						</div>
					{/if}
				</div>
			</div>

			<!-- Action Buttons (only shown in edit mode) -->
			{#if editMode}
				<div class="mt-6 flex gap-3">
					<Button onclick={handleSave} color="green" class="flex-1" disabled={isSaving}>
						{isSaving ? 'Saving…' : 'Save Changes'}
					</Button>
					<Button onclick={handleCancel} color="light" class="flex-1">Cancel</Button>
				</div>
			{/if}
		</div>
	</div>
</div>
