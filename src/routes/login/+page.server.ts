import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals }) {
  const session = await locals.auth()
  if (session) throw redirect(302, '/');
  return {};
}

export const actions = {
  login: async ({ request }) => {
    const data = await request.formData();
    const user = data.get('user');
    const password = data.get('password');

    if (!user || !password) {
      return fail(400, { message: 'Invalid credentials' });
    }

    const response = await fetch('/api/login', {
      method: "POST",
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({user, data})
    })

    if(!response.ok) {
      const error = await response.json()
      return {
        success: false,
        cause: "Login Responded With Error",
        error: error.message
      }
    }

    const result = await response.json();
    if (result.success) {
      throw redirect(302, '/');
    }

    
    return fail(400, { message: 'Login failed' });
  }
};