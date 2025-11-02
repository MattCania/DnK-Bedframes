<script lang="ts">
	let { data } = $props<{ data: { products: any[] } }>();
	let editingId = $state<number | null>(null);
	let deletingId = $state<number | null>(null);
	let search = $state('');
	let busy = $state(false);

	const categories = [
		{ value: 'twin', name: 'Twin' },
		{ value: 'full', name: 'Full' },
		{ value: 'queen', name: 'Queen' },
		{ value: 'king', name: 'King' }
	];

	let rows = $state<any[]>(data.products ?? []);
	let editRow = $state<any | null>(null);

	let filtered = $derived(
		rows.filter((r) => {
			const q = search.toLowerCase();
			if (!q) return true;
			return (
				(r.name ?? '').toLowerCase().includes(q) ||
				(r.description ?? '').toLowerCase().includes(q) ||
				(r.category ?? '').toLowerCase().includes(q)
			);
		})
	);

	function startEdit(r: any) {
		editingId = r.id;
		editRow = {
			...r,
			colorsText: (r.colors ?? []).join(', '),
			newImage: undefined as string | '' | undefined
		};
	}

	function cancelEdit() {
		editingId = null;
		editRow = null;
	}

	function handleImageChange(event: Event) {
		if (!editRow) return;
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			alert('Please select an image file.');
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			editRow.newImage = String(reader.result || '');
		};
		reader.readAsDataURL(file);
	}

	function clearImage() {
		if (!editRow) return;
		editRow.newImage = '';
	}

	async function saveEdit() {
		if (!editRow || editingId == null) return;
		if (busy) return;
		busy = true;

		const payload: Record<string, unknown> = {
			name: String(editRow.name ?? '').trim(),
			description: (editRow.description ?? '').toString(),
			price: editRow.price,
			stock: Number(editRow.stock ?? 0),
			category: editRow.category,
			colors: String(editRow.colorsText ?? '').trim()
		};

		if (Object.prototype.hasOwnProperty.call(editRow, 'newImage')) {
			if (editRow.newImage !== undefined) {
				payload.image = editRow.newImage;
			}
		}

		try {
			const res = await fetch(`/api/products/${editingId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const j = await res.json();
			if (!res.ok || !j?.success) throw new Error(j?.message || 'Failed to update');

			const idx = rows.findIndex((x) => x.id === editingId);
			if (idx !== -1) {
				rows[idx] = {
					...rows[idx],
					...payload,
					colors: String(payload.colors || '')
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean),
					image: Object.prototype.hasOwnProperty.call(editRow, 'newImage')
						? editRow.newImage || null
						: (rows[idx] as any).image
				};
			}
			cancelEdit();
		} catch (e) {
			console.error(e);
			alert((e as Error).message || 'Failed to save');
		} finally {
			busy = false;
		}
	}

	async function deleteProduct(id: number) {
		if (deletingId) return;
		if (!confirm('Delete this product? This cannot be undone.')) return;
		deletingId = id;
		try {
			const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
			const j = await res.json();
			if (!res.ok || !j?.success) throw new Error(j?.message || 'Failed to delete');
			rows = rows.filter((r) => r.id !== id);
			if (editingId === id) {
				editingId = null;
				editRow = null;
			}
		} catch (e) {
			console.error(e);
			alert((e as Error).message || 'Failed to delete');
		} finally {
			deletingId = null;
		}
	}
</script>

<div class="min-h-screen bg-zinc-900 text-white">
	<div class="mx-auto max-w-7xl p-6 md:p-8">
		<div class="mb-6 flex items-center justify-between gap-4">
			<div>
				<h1 class="text-2xl font-bold">Catalog</h1>
				<p class="text-sm text-zinc-300">Edit existing products, pricing, stock and details</p>
			</div>
			<input
				placeholder="Search by name, description, category"
				bind:value={search}
				class="w-96 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm focus:outline-none"
			/>
		</div>

		<div class="overflow-x-auto rounded-lg border border-zinc-700">
			<table class="min-w-full divide-y divide-zinc-700">
				<thead class="bg-zinc-800">
					<tr>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">ID</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">Name</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">Image</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase"
							>Category</th
						>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">Price</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">Stock</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">Colors</th
						>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-zinc-700 bg-zinc-800">
					{#if filtered.length === 0}
						<tr>
							<td colspan="8" class="px-4 py-6 text-center text-sm text-zinc-300"
								>No products found.</td
							>
						</tr>
					{:else}
						{#each filtered as r}
							<tr class="align-top hover:bg-zinc-700/30">
								<td class="px-4 py-3 text-sm whitespace-nowrap text-zinc-200">{r.id}</td>
								<td class="px-4 py-3 text-sm">
									{#if editingId === r.id}
										<input
											class="w-56 rounded border border-zinc-700 bg-zinc-900 px-2 py-1"
											bind:value={editRow.name}
										/>
										<div class="mt-2">
											<textarea
												class="w-80 rounded border border-zinc-700 bg-zinc-900 px-2 py-1"
												rows="2"
												bind:value={editRow.description}
												placeholder="Description"
											></textarea>
										</div>
									{:else}
										<div class="font-medium">{r.name}</div>
										<div class="line-clamp-2 max-w-[28rem] text-xs text-zinc-300">
											{r.description}
										</div>
									{/if}
								</td>
								<td class="px-4 py-3 text-sm">
									{#if editingId === r.id}
										<div class="flex items-start gap-3">
											{#if editRow?.newImage !== ''}
												<img
													src={(editRow?.newImage ?? r.image) || ''}
													alt="preview"
													class="h-16 w-16 rounded object-cover ring-1 ring-zinc-700"
												/>
											{:else}
												<div
													class="flex h-16 w-16 items-center justify-center rounded bg-zinc-700 text-xs text-zinc-300 ring-1 ring-zinc-700"
												>
													No image
												</div>
											{/if}
											<div class="space-y-2">
												<input
													type="file"
													accept="image/*"
													class="block w-56 text-sm"
													onchange={(e) => handleImageChange(e)}
												/>
												<div class="text-xs text-gray-500">
													<button type="button" class="underline" onclick={() => clearImage()}
														>Remove image</button
													>
												</div>
											</div>
										</div>
									{:else if r.image}
										<img
											src={r.image}
											alt="thumb"
											class="h-12 w-12 rounded object-cover ring-1 ring-zinc-700"
										/>
									{:else}
										<span class="text-zinc-400">-</span>
									{/if}
								</td>
								<td class="px-4 py-3 text-sm">
									{#if editingId === r.id}
										<select
											class="rounded border border-zinc-700 bg-zinc-900 px-2 py-1"
											bind:value={editRow.category}
										>
											{#each categories as c}
												<option value={c.value}>{c.name}</option>
											{/each}
										</select>
									{:else}
										<span class="capitalize">{r.category}</span>
									{/if}
								</td>
								<td class="px-4 py-3 text-sm">
									{#if editingId === r.id}
										<input
											type="number"
											step="0.01"
											class="w-28 rounded border border-zinc-700 bg-zinc-900 px-2 py-1"
											bind:value={editRow.price}
										/>
									{:else}
										₱{r.price}
									{/if}
								</td>
								<td class="px-4 py-3 text-sm">
									{#if editingId === r.id}
										<input
											type="number"
											class="w-24 rounded border border-zinc-700 bg-zinc-900 px-2 py-1"
											bind:value={editRow.stock}
										/>
									{:else}
										{r.stock}
									{/if}
								</td>
								<td class="px-4 py-3 text-sm">
									{#if editingId === r.id}
										<input
											class="w-56 rounded border border-zinc-700 bg-zinc-900 px-2 py-1"
											bind:value={editRow.colorsText}
											placeholder="e.g. Black, White"
										/>
									{:else if r.colors?.length}
										<span>{r.colors.join(', ')}</span>
									{:else}
										-
									{/if}
								</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap">
									{#if editingId === r.id}
										<button
											type="button"
											class="rounded bg-green-600 px-3 py-1 text-white disabled:opacity-60"
											disabled={busy}
											onclick={saveEdit}>Save</button
										>
										<button
											type="button"
											class="ml-2 rounded bg-zinc-700 px-3 py-1"
											onclick={cancelEdit}>Cancel</button
										>
									{:else}
										<button
											type="button"
											class="rounded bg-blue-600 px-3 py-1 text-white"
											onclick={() => startEdit(r)}>Edit</button
										>
										<button
											type="button"
											class="ml-2 rounded bg-red-600 px-3 py-1 text-white disabled:opacity-60"
											disabled={deletingId === r.id}
											onclick={() => deleteProduct(r.id)}>Delete</button
										>
									{/if}
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
