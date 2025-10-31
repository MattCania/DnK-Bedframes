import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const admins = await db.select().from(accounts).where(eq(accounts.role, 'admin'));

	return { admins };
};
