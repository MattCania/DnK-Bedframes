<script>
	import { onDestroy, tick } from 'svelte';
	import { Button, Input, Select, Modal } from 'flowbite-svelte';

	let editMode = false;

	export let data;
	const user = data.session;
	const account = data.account;

	let profileData = {
		profile_id: account?.id ?? null,
		firstname: account?.firstname ?? '',
		email: account?.email ?? user?.user?.email ?? '',
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

			// Sync local state from server response
			const acc = data.account;
			profileData = {
				profile_id: acc.id,
				firstname: acc.firstname ?? '',
				middlename: acc.middlename ?? '',
				lastname: acc.lastname ?? '',
				contacts: acc.contacts ?? '',
				birthday: acc.birthday ?? '',
				address: acc.address ?? '',
				gender: acc.gender ?? '',
				email: acc.email ?? ''
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

	let mapModalOpen = false;
	let leafletLoaded = false;
	let L;
	let map;
	let marker = null;

	let previewAddress = '';
	let previewLat = null;
	let previewLng = null;

	const MAP_CONTAINER_ID = 'profileAddressMap';
	const DEFAULT_CENTER = [14.5995, 120.9842];

	async function ensureLeafletLoaded() {
		if (!leafletLoaded) {
			L = (await import('leaflet')).default ?? (await import('leaflet'));
			await import('leaflet/dist/leaflet.css');
			
			delete L.Icon.Default.prototype._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
				iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
			});
			
			leafletLoaded = true;
		}
	}

	async function initMap() {
		if (!leafletLoaded) await ensureLeafletLoaded();
		
		if (map) {
			try {
				map.off();
				map.remove();
				map = null;
				marker = null;
			} catch (e) {
				console.error('Error removing map:', e);
			}
		}

		const container = document.getElementById(MAP_CONTAINER_ID);
		if (!container) {
			console.error('Map container not found');
			return;
		}

		map = L.map(MAP_CONTAINER_ID, {
			center: DEFAULT_CENTER,
			zoom: 11,
			zoomControl: true
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; OpenStreetMap contributors'
		}).addTo(map);

		map.on('click', async (e) => {
			const { lat, lng } = e.latlng;

			if (marker) {
				marker.setLatLng([lat, lng]);
			} else {
				marker = L.marker([lat, lng]).addTo(map);
			}

			await reverseGeocode(lat, lng);
			const popupContent = `<div style="max-width:220px;font-size:0.9rem">
				<strong>Selected:</strong><br/>
				${escapeHtml(previewAddress || `${lat.toFixed(5)}, ${lng.toFixed(5)}`)}
				<br/><small>${lat.toFixed(5)}, ${lng.toFixed(5)}</small>
			</div>`;
			marker.bindPopup(popupContent).openPopup();
		});

		setTimeout(() => {
			if (map) {
				map.invalidateSize();
			}
		}, 100);
	}

	async function reverseGeocode(lat, lng) {
		previewLat = lat;
		previewLng = lng;
		previewAddress = '';
		try {
			const url = new URL('https://nominatim.openstreetmap.org/reverse');
			url.searchParams.set('lat', String(lat));
			url.searchParams.set('lon', String(lng));
			url.searchParams.set('format', 'json');
			url.searchParams.set('addressdetails', '1');
			url.searchParams.set('zoom', '18');

			const res = await fetch(url.toString(), {
				headers: {
					'Accept': 'application/json'
				}
			});
			if (!res.ok) throw new Error('Reverse geocoding failed');
			const json = await res.json();

			let display = json.display_name ?? '';
			if (!display && json.address) {
				const a = json.address;
				const parts = [
					a.road || a.pedestrian || a.cycleway || a.footway || a.neighbourhood,
					a.suburb || a.village || a.town || a.city_district,
					a.city || a.county,
					a.state,
					a.country
				].filter(Boolean);
				display = parts.join(', ');
			}

			previewAddress = display || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
		} catch (err) {
			console.error('Reverse geocode error', err);
			previewAddress = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
		}
	}

	async function openMapPicker() {
		mapModalOpen = true;
		
		await tick();
		await new Promise(resolve => setTimeout(resolve, 150));
		
		await ensureLeafletLoaded();
		await initMap();
		
		await new Promise(resolve => setTimeout(resolve, 200));
		
		if (map) {
			map.invalidateSize();
			
			const coords = parseCoordsFromAddress(profileData.address);
			if (coords) {
				const [lat, lng] = coords;
				map.setView([lat, lng], 14);
				if (marker) {
					marker.setLatLng([lat, lng]);
				} else {
					marker = L.marker([lat, lng]).addTo(map);
				}
				await reverseGeocode(lat, lng);
			}
		}
	}

	function closeMapPicker() {
		mapModalOpen = false;
	}

	function applySelectedAddress() {
		if (!previewAddress || previewLat == null || previewLng == null) return;
		profileData.address = `${previewAddress} (${previewLat.toFixed(5)}, ${previewLng.toFixed(5)})`;
		mapModalOpen = false;
	}

	function parseCoordsFromAddress(addr) {
		if (!addr) return null;
		const m = addr.match(/\((-?\d+\.\d+),\s*(-?\d+\.\d+)\)\s*$/);
		if (m) {
			return [parseFloat(m[1]), parseFloat(m[2])];
		}
		return null;
	}

	function escapeHtml(str) {
		if (!str) return '';
		return String(str)
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#039;');
	}

	onDestroy(() => {
		try {
			if (map) {
				map.off();
				map.remove();
				map = null;
			}
		} catch (e) {
			// Ignore, error endpoint
		}
	});

</script>

<div class="min-h-screen bg-white pt-22">
	<div class="mx-auto max-w-4xl p-6 bg-gray-200 shadow-lg shadow-gray-200 h-full">
		<div class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Account Settings</h1>
			<p class="text-sm text-gray-600">Manage your account information and profile details</p>
		</div>

		<div class="-t-2 mb-8 pt-6">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-bold text-gray-900">Profile Information</h2>
				{#if !editMode}
					<Button onclick={handleEdit} color="blue" size="sm">Edit Profile</Button>
				{/if}
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
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

				<div class="md:col-span-2">
					<label for="address" class="mb-2 block text-sm font-medium text-gray-700">
						Address
					</label>

					{#if editMode}
						<div class="flex gap-2 mb-2">
							<textarea
								id="address"
								bind:value={profileData.address}
								rows="3"
								class="w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none border border-gray-300"
							></textarea>

							<Button size="sm" color="blue" onclick={openMapPicker}>
								Pick from Map
							</Button>
						</div>
					{:else}
						<div class="-gray-200 rounded-lg bg-gray-50 px-4 py-2 text-gray-700">
							{profileData.address || '-'}
						</div>
					{/if}
				</div>
			</div>

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

<!-- Flowbite Modal for map picker -->
<Modal bind:open={mapModalOpen} size="xl" dismissable={false}>
	<div class="p-4">
		<h3 class="text-lg font-semibold mb-2">Select delivery location</h3>
		<p class="text-sm text-gray-600 mb-3">Click on the map to drop a pin. Then press "Use this location".</p>

		<div id={MAP_CONTAINER_ID} style="height: 400px; width: 100%;" class="rounded-lg border border-gray-300"></div>

		<div class="mt-3">
			<p class="text-sm text-gray-700">
				<strong>Preview:</strong>
			</p>
			{#if previewAddress}
				<p class="text-sm text-gray-800">{previewAddress}</p>
				<p class="text-xs text-gray-500">{previewLat?.toFixed(5)}, {previewLng?.toFixed(5)}</p>
			{:else}
				<p class="text-sm text-gray-500">Click on the map to select a point.</p>
			{/if}
		</div>

		<div class="mt-4 flex justify-end gap-2">
			<Button color="light" onclick={closeMapPicker}>Cancel</Button>
			<Button color="blue" onclick={applySelectedAddress} disabled={!previewAddress}>Use this location</Button>
		</div>
	</div>
</Modal>

<style>
	:global(.leaflet-container) {
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	/* slight shadow for marker icons (optional) */
	:global(.leaflet-marker-icon),
	:global(.leaflet-marker-shadow) {
		filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
	}
	
	/* Ensure the map container has proper sizing */
	#profileAddressMap {
		min-height: 400px;
	}
</style>