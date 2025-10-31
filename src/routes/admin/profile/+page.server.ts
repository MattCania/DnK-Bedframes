import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	const session = await locals.auth();

	if (!session) {
		console.log('No Session Found');
		throw redirect(301, '/');
	}

	const email = session?.user?.email as string | undefined;
	type Account = typeof accounts.$inferSelect;
	let account: Account | null = null;

	if (email) {
		const [row] = await db.select().from(accounts).where(eq(accounts.email, email));
		account = row ?? null;
	}

	return { session, account };
};
