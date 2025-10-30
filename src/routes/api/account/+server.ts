import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT({ request, locals }) {
	const session = await locals.auth?.();
	if (!session?.user?.email) {
		return json({ success: false, message: 'Unauthorized' }, { status: 401 });
	}

	let body: any;
	try {
		body = await request.json();
	} catch (e) {
		return json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
	}

	const allowedKeys = [
		'firstname',
		'middlename',
		'lastname',
		'contacts',
		'birthday',
		'address',
		'gender'
	] as const;

	const updates: Record<string, unknown> = {};
	for (const key of allowedKeys) {
		if (key in body) updates[key] = body[key];
	}

	const required = ['firstname', 'lastname'] as const;
	for (const r of required) {
		if (r in updates && typeof updates[r] !== 'string') {
			return json({ success: false, message: `${r} must be a string` }, { status: 400 });
		}
	}

	if ('gender' in updates) {
		const g = updates['gender'];
		if (g !== 'male' && g !== 'female') {
			updates['gender'] = null;
		}
	}

	try {
		const [existing] = await db
			.select({ id: accounts.id })
			.from(accounts)
			.where(eq(accounts.email, session.user.email));

		if (!existing) {
			return json({ success: false, message: 'Account not found' }, { status: 404 });
		}

		const [updated] = await db
			.update(accounts)
			.set({ ...updates, updated_at: new Date() })
			.where(eq(accounts.email, session.user.email))
			.returning();

		return json({ success: true, account: updated });
	} catch (err) {
		console.error('Failed to update account', err);
		return json({ success: false, message: 'Failed to update account' }, { status: 500 });
	}
}
