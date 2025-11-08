<script lang="ts">
	import { Input, Label, Button, Checkbox, Select, Textarea } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	let eventSelected = $state('');

	let file = $state<File | null>(null);
	let previewUrl = $state<string | null>(null);

	const categories = [
		{ value: 'twin', name: 'Twin' },
		{ value: 'full', name: 'Full' },
		{ value: 'king', name: 'King' },
		{ value: 'queen', name: 'Queen' }
	];

	function handleImageChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const f = target.files?.[0];
		if (!f) {
			clearPreview();
			return;
		}

		if (!f.type.startsWith('image/')) {
			alert('Please select an image file.');
			target.value = '';
			return;
		}

		if (previewUrl) URL.revokeObjectURL(previewUrl);

		file = f;
		previewUrl = URL.createObjectURL(f);
	}

	function clearPreview() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		previewUrl = null;
		file = null;
	}

	onDestroy(() => {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
	});
</script>

<section class="min-h-screen bg-zinc-900 p-6 text-white">
	<form
		class="mx-auto max-w-5xl rounded-lg border border-zinc-700 bg-zinc-800 p-6 md:p-8"
		method="POST"
		enctype="multipart/form-data"
	>
		<div class="mb-6 grid gap-6 md:grid-cols-2">
			<div>
				<Label for="product_image" class="mb-2 text-white">Product Image</Label>
				<Input
					type="file"
					id="product_image"
					name="product_image"
					accept="image/*"
					required
					onchange={handleImageChange}
				/>

				{#if previewUrl}
					<div class="mt-3">
						<img
							src={previewUrl}
							alt="Preview"
							class="h-40 w-40 rounded-lg border border-zinc-700 object-cover"
						/>
						<Button color="light" size="xs" class="mt-2" onclick={clearPreview}>Remove</Button>
					</div>
				{/if}
			</div>

			<div>
				<Label class="text-white">
					Category:
					<Select
						class="mt-2 text-white"
						name="product_category"
						items={categories}
						bind:value={eventSelected}
						clearable
					/>
				</Label>
			</div>

			<div>
				<Label for="product_name" class="mb-2 text-white">Product Name</Label>
				<Input type="text" id="product_name" name="product_name" placeholder="Bedframe" required />
			</div>

			<div>
				<Label for="color" class="mb-2 text-white">Color</Label>
				<Input type="text" id="color" name="product_colors" placeholder="Black" required />
			</div>

			<div>
				<Label for="stock" class="mb-2 text-white">Stock</Label>
				<Input type="number" id="stock" name="product_stock" placeholder="1" required />
			</div>

			<div>
				<Label for="price" class="mb-2 text-white">Price</Label>
				<Input type="number" id="price" name="product_price" placeholder="1" required />
			</div>

			<div>
				<Label for="description" class="mb-2 text-white">Description</Label>
				<Textarea
					id="description"
					name="product_description"
					placeholder="Your message"
					rows={4}
					class="w-full"
				/>
			</div>
		</div>

		<Button type="submit">Submit</Button>
	</form>
</section>
