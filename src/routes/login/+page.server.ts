// +page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';
import { eq, or } from 'drizzle-orm';
import { verify } from '@node-rs/argon2';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (session) {
		console.log(session);
		if (session.role === 'admin') throw redirect(302, '/admin');
		throw redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies, locals }) => {
		try {
			const formData = await request.formData();
			const user = formData.get('user')?.toString()?.trim();
			const password = formData.get('password')?.toString();

			// Validation
			const errors: Record<string, string> = {};

			if (!user || user.length === 0) {
				errors.user = 'Email is required';
			}

			if (!password || password.length === 0) {
				errors.password = 'Password is required';
			}

			if (Object.keys(errors).length > 0) {
				return fail(400, {
					errors,
					data: { user }
				});
			}

			// Find user by email or contact number
			const [foundUser] = await db
				.select()
				.from(accounts)
				.where(
					or(
						eq(accounts.email, user!),
						eq(accounts.contacts, user!)
					)
				)
				.limit(1);

			// User not found
			if (!foundUser) {
				return fail(401, {
					errors: {
						general: 'Invalid email or password'
					},
					data: { user }
				});
			}

			// Check if user registered with OAuth (no password)
			if (!foundUser.password) {
				return fail(401, {
					errors: {
						general: 'This account uses social login. Please sign in with Google.'
					},
					data: { user }
				});
			}

			// Verify password
			let validPassword = false;
			try {
				validPassword = await verify(foundUser.password, password!, {
					memoryCost: 19456,
					timeCost: 2,
					outputLen: 32,
					parallelism: 1
				});
			} catch (error) {
				console.error('Password verification error:', error);
				return fail(500, {
					errors: {
						general: 'An error occurred during login. Please try again.'
					},
					data: { user }
				});
			}

			if (!validPassword) {
				return fail(401, {
					errors: {
						general: 'Invalid email or password'
					},
					data: { user }
				});
			}

			// Create session (adjust based on your auth setup)
			// Example with Lucia:
			// const session = await lucia.createSession(foundUser.id, {});
			// const sessionCookie = lucia.createSessionCookie(session.id);
			// cookies.set(sessionCookie.name, sessionCookie.value, {
			// 	path: '.',
			// 	...sessionCookie.attributes
			// });

			// For now, using a simple approach - adjust to your auth system
			// This is a placeholder - implement your actual session creation
			cookies.set('user_id', foundUser.id.toString(), {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			// Check if user needs to complete profile
			if (!foundUser.address || !foundUser.contacts) {
				throw redirect(302, '/account?complete=true');
			}

			// Redirect based on role
			if (foundUser.role === 'admin') {
				throw redirect(302, '/admin');
			}

			throw redirect(302, '/');

		} catch (error) {
			// Handle redirect separately
			if (error instanceof Response && (error.status === 302 || error.status === 303)) {
				throw error;
			}

			console.error('Login error:', error);

			return fail(500, {
				errors: {
					general: 'An unexpected error occurred. Please try again later.'
				}
			});
		}
	}
};