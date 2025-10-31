import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	const session = await locals.auth();

	if (!session) return { session: null };
	if (
		url.pathname === '/' &&
		url.searchParams.get('from') === 'oauth' &&
		session.role === 'admin'
	) {
		throw redirect(303, '/admin');
	}

	return { session };
};
