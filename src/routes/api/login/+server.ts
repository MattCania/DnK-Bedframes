import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export async function POST({ request }) {
  const { email } = await request.json();

  const user = await db.query.accounts.findFirst({
    where: (acc, { eq }) => eq(acc.email, email)
  });

  if (!user) {
    return json({ success: false, message: 'User not found' }, { status: 404 });
  }

  return json({ success: true, user });
}
