import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export async function POST({ request }) {
  const { user } = await request.json();

  if (!user) {
    return json({ success: false, message: 'Missing user input' }, { status: 400 });
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user);
  const isContact = /^[0-9]+$/.test(user);

  let account = null;

  try {
    if (isEmail) {
      account = await db.query.accounts.findFirst({
        where: (acc, { eq }) => eq(acc.email, user)
      });
    } else if (isContact) {
      account = await db.query.profile.findFirst({
        where: (prof, { eq }) => eq(prof.contacts, user)
      });
    } else {
      return json({ success: false, message: 'Invalid user format' }, { status: 400 });
    }

    if (!account) {
      return json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return json({ success: true, account });
  } catch (error) {
    console.error('Error finding user:', error);
    return json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
