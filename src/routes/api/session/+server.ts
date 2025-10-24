import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
  const session = await locals.auth();

  if (!session) {
    return json({ authenticated: false });
  }

  return json({
    authenticated: true,
    user: session
  });
}
