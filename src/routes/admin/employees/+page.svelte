<script lang="ts">
	export let data: { admins: any[] };
	let search = '';
	const admins: any[] = data.admins ?? [];

	function fullName(a: any) {
		return [a.firstname, a.middlename, a.lastname].filter(Boolean).join(' ').trim();
	}

	$: filtered = admins.filter((a) => {
		const q = search.toLowerCase();
		if (!q) return true;
		return (
			(a.email?.toLowerCase() ?? '').includes(q) ||
			fullName(a).toLowerCase().includes(q) ||
			(a.provider ?? '').toLowerCase().includes(q)
		);
	});

	function fmtDate(d: any) {
		try {
			return d ? new Date(d).toLocaleString() : '-';
		} catch {
			return '-';
		}
	}
</script>

<div class="min-h-screen bg-white">
	<div class="mx-auto max-w-6xl p-6">
		<div class="mb-6 flex items-center justify-between gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Admin Users</h1>
				<p class="text-sm text-gray-600">All accounts with the admin role</p>
			</div>
			<input
				placeholder="Search by name, email, or provider"
				bind:value={search}
				class="w-80 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div class="overflow-x-auto rounded-lg border border-gray-200">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase"
						>
							ID
						</th>
						<th
							class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase"
						>
							Name
						</th>
						<th
							class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase"
						>
							Email
						</th>
						<th
							class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase"
						>
							Provider
						</th>
						<th
							class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase"
						>
							Contacts
						</th>
						<th
							class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase"
						>
							Created
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100 bg-white">
					{#if filtered.length === 0}
						<tr>
							<td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500">
								No admin users found.
							</td>
						</tr>
					{:else}
						{#each filtered as a}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-700">{a.id}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-900"
									>{fullName(a) || '-'}</td
								>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-blue-600">
									<a href={`mailto:${a.email}`} class="hover:underline">{a.email}</a>
								</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-700 capitalize"
									>{a.provider}</td
								>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-700"
									>{a.contacts || '-'}</td
								>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-700"
									>{fmtDate(a.created_at)}</td
								>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
