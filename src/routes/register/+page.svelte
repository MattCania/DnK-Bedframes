<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { enhance } from '$app/forms';
	import { Card, Button, Label, Input, Checkbox, Radio, Modal, Alert } from 'flowbite-svelte';
	import type { ActionData } from './$types';
	import Footer from '../../components/Footer.svelte';

	export let form: ActionData;

	let formData = {
		email: form?.data?.email || '',
		contactNumber: form?.data?.contactNumber || '',
		firstName: form?.data?.firstName || '',
		middleName: form?.data?.middleName || '',
		lastName: form?.data?.lastName || '',
		address: form?.data?.address || '',
		password: '',
		confirmPassword: '',
		birthday: form?.data?.birthday || '',
		gender: form?.data?.gender || ''
	};

	let showPassword = false;
	let isSubmitting = false;

	let mapModalOpen = false;
	let leafletLoaded = false;
	let L;
	let map;
	let marker = null;
	let previewAddress = '';
	let previewLat = null;
	let previewLng = null;

	const MAP_CONTAINER_ID = 'registrationAddressMap';
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
			
			const coords = parseCoordsFromAddress(formData.address);
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
		formData.address = `${previewAddress} (${previewLat.toFixed(5)}, ${previewLng.toFixed(5)})`;
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
			// ignore
		}
	});
</script>

<section class="mx-auto my-4 mt-64 md:mt-40 flex flex-col justify-center items-center min-h-screen w-full pb-20 p-8">
<Card class="flex w-full md:w-1/2 max-w-3xl h-fit p-4 md:p-8 mx-auto">
		<form 
			class="flex flex-col space-y-6" 
			method="POST"
			action="?/register"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<h3 class="mx-auto text-2xl font-medium text-gray-900 dark:text-white">
				Create Your Account
			</h3>

			{#if form?.errors?.general}
				<Alert color="red" class="mb-4">
					<span class="font-medium">Error!</span> {form.errors.general}
				</Alert>
			{/if}

			<Label class="space-y-2">
				<span>Email Address *</span>
				<Input 
					type="email" 
					name="email"
					bind:value={formData.email} 
					placeholder="juan@example.com" 
					required
					color={form?.errors?.email ? 'red' : 'base'}
				/>
				{#if form?.errors?.email}
					<p class="text-sm text-red-600 dark:text-red-500">{form.errors.email}</p>
				{/if}
			</Label>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Label class="space-y-2">
					<span>First Name *</span>
					<Input 
						type="text"
						name="firstName"
						bind:value={formData.firstName} 
						placeholder="Juan" 
						required
						color={form?.errors?.firstName ? 'red' : 'base'}
					/>
					{#if form?.errors?.firstName}
						<p class="text-sm text-red-600 dark:text-red-500">{form.errors.firstName}</p>
					{/if}
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

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Label class="space-y-2">
					<span>Last Name *</span>
					<Input 
						type="text"
						name="lastName"
						bind:value={formData.lastName} 
						placeholder="Dela Cruz" 
						required
						color={form?.errors?.lastName ? 'red' : 'base'}
					/>
					{#if form?.errors?.lastName}
						<p class="text-sm text-red-600 dark:text-red-500">{form.errors.lastName}</p>
					{/if}
				</Label>
				
				<Label class="space-y-2">
					<span>Contact Number *</span>
					<Input
						type="tel"
						name="contactNumber"
						bind:value={formData.contactNumber}
						placeholder="+63 912 345 6789"
						required
						color={form?.errors?.contactNumber ? 'red' : 'base'}
					/>
					{#if form?.errors?.contactNumber}
						<p class="text-sm text-red-600 dark:text-red-500">{form.errors.contactNumber}</p>
					{/if}
				</Label>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Label class="space-y-2">
					<span>Birthday *</span>
					<Input 
						type="date"
						name="birthday"
						bind:value={formData.birthday} 
						required
						color={form?.errors?.birthday ? 'red' : 'base'}
					/>
					{#if form?.errors?.birthday}
						<p class="text-sm text-red-600 dark:text-red-500">{form.errors.birthday}</p>
					{/if}
				</Label>
				
				<Label class="space-y-2">
					<span>Gender *</span>
					<div class="mt-2 flex gap-6">
						<Radio name="gender" value="male" bind:group={formData.gender} required>
							Male
						</Radio>
						<Radio name="gender" value="female" bind:group={formData.gender}>
							Female
						</Radio>
					</div>
					{#if form?.errors?.gender}
						<p class="text-sm text-red-600 dark:text-red-500">{form.errors.gender}</p>
					{/if}
				</Label>
			</div>

			<Label class="space-y-2">
				<span>Address *</span>
				<div class="flex gap-2">
					<textarea
						name="address"
						bind:value={formData.address}
						placeholder="Enter your address or pick from map"
						rows="3"
						class="w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none border {form?.errors?.address ? 'border-red-500' : 'border-gray-300'}"
						required
					></textarea>
					<Button size="sm" color="blue" type="button" onclick={openMapPicker}>
						Pick from Map
					</Button>
				</div>
				{#if form?.errors?.address}
					<p class="text-sm text-red-600 dark:text-red-500">{form.errors.address}</p>
				{/if}
			</Label>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Label class="space-y-2">
					<span>Password *</span>
					<Input
						type={showPassword ? 'text' : 'password'}
						name="password"
						bind:value={formData.password}
						placeholder="•••••"
						required
						color={form?.errors?.password ? 'red' : 'base'}
					/>
					{#if form?.errors?.password}
						<p class="text-sm text-red-600 dark:text-red-500">{form.errors.password}</p>
					{/if}
				</Label>
				
				<Label class="space-y-2">
					<span>Confirm Password *</span>
					<Input
						type={showPassword ? 'text' : 'password'}
						name="confirmPassword"
						bind:value={formData.confirmPassword}
						placeholder="•••••"
						required
						color={form?.errors?.confirmPassword ? 'red' : 'base'}
					/>
					{#if form?.errors?.confirmPassword}
						<p class="text-sm text-red-600 dark:text-red-500">{form.errors.confirmPassword}</p>
					{/if}
				</Label>
			</div>

			<div class="flex items-start">
				<Checkbox bind:checked={showPassword}>Show Password</Checkbox>
			</div>

			<Button type="submit" class="w-full" disabled={isSubmitting}>
				{isSubmitting ? 'Creating Account...' : 'Register'}
			</Button>

			<div class="text-center text-sm text-gray-600">
				Already have an account? 
				<a href="/login" class="text-blue-600 hover:underline">Sign in</a>
			</div>
		</form>
	</Card>
</section>

<Modal bind:open={mapModalOpen} size="xl" dismissable={false}>
	<div class="p-4">
		<h3 class="text-lg font-semibold mb-2">Select Your Location</h3>
		<p class="text-sm text-gray-600 mb-3">
			Click on the map to drop a pin at your address. Then press "Use this location".
		</p>

		<div 
			id={MAP_CONTAINER_ID} 
			style="height: 400px; width: 100%;" 
			class="rounded-lg border border-gray-300"
		></div>

		<div class="mt-3">
			<p class="text-sm text-gray-700">
				<strong>Preview:</strong>
			</p>
			{#if previewAddress}
				<p class="text-sm text-gray-800">{previewAddress}</p>
				<p class="text-xs text-gray-500">
					{previewLat?.toFixed(5)}, {previewLng?.toFixed(5)}
				</p>
			{:else}
				<p class="text-sm text-gray-500">Click on the map to select a point.</p>
			{/if}
		</div>

		<div class="mt-4 flex justify-end gap-2">
			<Button color="light" onclick={closeMapPicker}>Cancel</Button>
			<Button 
				color="blue" 
				onclick={applySelectedAddress} 
				disabled={!previewAddress}
			>
				Use this location
			</Button>
		</div>
	</div>
</Modal>
<Footer/>

<style>
	:global(.leaflet-container) {
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	:global(.leaflet-marker-icon),
	:global(.leaflet-marker-shadow) {
		filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
	}
	
	#registrationAddressMap {
		min-height: 400px;
	}
</style>