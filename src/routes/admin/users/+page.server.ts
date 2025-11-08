import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const admins = await db.select().from(accounts).where(eq(accounts.role, 'user'));

	return { admins };
};

export const actions: Actions = {
	promote: async ({request}) => {
		try {

			const data = await request.formData();
			const id = Number(data.get('id'));
			
			await db.update(accounts).set({role: 'admin'}).where(eq(accounts.id, id))
		
			return {success: true}
		}
		catch (err) {
			return {success: false, cause: err}
		}
	}
}