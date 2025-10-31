import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth();

	if (!session || session?.role !== 'admin') {
		console.log('No Session Found');
		throw redirect(302, '/');
	}

	return { session };
};
