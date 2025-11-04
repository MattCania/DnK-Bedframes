<script lang="ts">
	import { onMount } from "svelte";

	let selectedLocation = ""; // this will update the input

	let map;
	let marker;

	onMount(async () => {
		// Load Leaflet dynamically (avoids SSR issues in SvelteKit)
		const L = await import("leaflet");
		await import("leaflet/dist/leaflet.css");

		map = L.map("map").setView([14.5995, 120.9842], 10); // Manila default location

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19
		}).addTo(map);

		map.on("click", (e) => {
			const { lat, lng } = e.latlng;

			// remove previous marker if exists
			if (marker) marker.remove();
			marker = L.marker([lat, lng]).addTo(map);

			// popup with confirmation button
			const popup = L.popup()
				.setLatLng([lat, lng])
				.setContent(`<button id="okBtn">Set Location</button>`)
				.openOn(map);

			// wait for DOM to attach button, then bind click
			setTimeout(() => {
				const okBtn = document.getElementById("okBtn");
				if (okBtn) {
					okBtn.onclick = () => {
						selectedLocation = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
						map.closePopup();
					};
				}
			}, 30);
		});
	});
</script>

<input
	type="text"
	bind:value={selectedLocation}
	placeholder="Click map to set coordinates"
/>

<div id="map" style="height: 400px; margin-top: 10px; border-radius: 6px;"></div>

<style>
	/* Fix missing marker icons in Leaflet (common issue) */
	:global(.leaflet-container) {
		width: 100%;
		height: 100%;
	}

	:global(.leaflet-marker-icon),
	:global(.leaflet-marker-shadow) {
		filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.5));
	}
</style>
