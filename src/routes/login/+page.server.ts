import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (session) {
		console.log(session);
		if (session.role === 'admin') throw redirect(302, '/admin');
		throw redirect(302, '/');
	}
	return {};
};

// No actions needed - Auth.js handles this through the credentials provider