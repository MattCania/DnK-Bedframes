<script lang="ts">
	import { Button, Modal, Select } from "flowbite-svelte";
	import { enhance } from "$app/forms";
	import { CheckCircleSolid, CloseCircleSolid } from "flowbite-svelte-icons";

	export let data: { admins: any[] };
	let search = '';
	const admins: any[] = data.admins ?? [];

	// Modal state
	let showModal = false;
	let modalMessage = '';
	let modalSuccess = false;
	
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

	const onEnhance = (input?: any) => {
		const submittedAction: string = input?.action?.pathname ?? '';
		const fd: FormData | undefined = input?.formData;
		return async ({ result }: any) => {
			if (result.type === 'success') {
				if (result.data?.success) {
					modalMessage = result.data?.message || 'User promoted successfully!';
					modalSuccess = true;
				} else {
					modalMessage = result.data?.message || 'Action failed. Please try again.';
					modalSuccess = false;
				}
				showModal = true;
				
				setTimeout(() => {
					showModal = false;
				}, 2000);
			}
		};
	};
</script>

<Modal bind:open={showModal} size="xs" autoclose outsideclose>
	<div class="text-center">
		{#if modalSuccess}
			<CheckCircleSolid class="mx-auto mb-4 h-14 w-14 text-green-500" />
			<h3 class="mb-5 text-lg font-normal text-gray-700 dark:text-gray-300">
				{modalMessage}
			</h3>
		{:else}
			<CloseCircleSolid class="mx-auto mb-4 h-14 w-14 text-red-500" />
			<h3 class="mb-5 text-lg font-normal text-gray-700 dark:text-gray-300">
				{modalMessage}
			</h3>
		{/if}
		<Button color={modalSuccess ? 'green' : 'red'} onclick={() => (showModal = false)}>
			OK
		</Button>
	</div>
</Modal>
<div class="min-h-screen bg-zinc-900 text-white">
	<div class="mx-auto max-w-6xl p-6">
		<div class="mb-6 flex items-center justify-between gap-4">
			<div>
				<h1 class="text-2xl font-bold">Users</h1>
				<p class="text-sm text-zinc-300">All accounts with the user role</p>
			</div>
			<input
				placeholder="Search by name, email, or provider"
				bind:value={search}
				class="w-80 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm focus:outline-none"
			/>
		</div>

		<div class="overflow-x-auto rounded-lg border border-zinc-700">
			<table class="min-w-full divide-y divide-zinc-700">
				<thead class="bg-zinc-800">
					<tr>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase"> ID </th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">
							Name
						</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">
							Email
						</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">
							Provider
						</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">
							Contacts
						</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">
							Created
						</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">
							Action
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-zinc-700 bg-zinc-800">
					{#if filtered.length === 0}
						<tr>
							<td colspan="7" class="px-4 py-6 text-center text-sm text-zinc-300">
								No users found.
							</td>
						</tr>
					{:else}
						{#each filtered as a}
							<tr class="hover:bg-zinc-700/30">
								<td class="px-4 py-3 text-sm whitespace-nowrap text-zinc-200">{a.id}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap">{fullName(a) || '-'}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-blue-400">
									<a href={`mailto:${a.email}`} class="hover:underline">{a.email}</a>
								</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap capitalize">{a.provider}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap">{a.contacts || '-'}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap">{fmtDate(a.created_at)}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap">
									<form method="POST" action="?/promote" use:enhance={onEnhance}>
										<input name="id" type="text" value={a.id} hidden>
										<button class="bg-zinc-900 rounded-lg hover:bg-zinc-600 text-white p-2" type="submit">
											Promote
										</button>
									</form>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
