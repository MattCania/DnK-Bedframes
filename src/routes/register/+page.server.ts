import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	register: async ({ request, locals }) => {
		try {
			const formData = await request.formData();
			
			const email = formData.get('email')?.toString()?.trim();
			const password = formData.get('password')?.toString();
			const confirmPassword = formData.get('confirmPassword')?.toString();
			const firstName = formData.get('firstName')?.toString()?.trim();
			const middleName = formData.get('middleName')?.toString()?.trim() || null;
			const lastName = formData.get('lastName')?.toString()?.trim();
			const contactNumber = formData.get('contactNumber')?.toString()?.trim();
			const birthday = formData.get('birthday')?.toString()?.trim();
			const address = formData.get('address')?.toString()?.trim();
			const gender = formData.get('gender')?.toString()?.trim();

			const errors: Record<string, string> = {};

			if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				errors.email = 'Please provide a valid email address';
			}

			if (!password || password.length < 8) {
				errors.password = 'Password must be at least 8 characters long';
			}

			if (password !== confirmPassword) {
				errors.confirmPassword = 'Passwords do not match';
			}

			if (!firstName || firstName.length < 2) {
				errors.firstName = 'First name is required (minimum 2 characters)';
			}

			if (!lastName || lastName.length < 2) {
				errors.lastName = 'Last name is required (minimum 2 characters)';
			}

			if (!contactNumber || !/^\+?[\d\s-]{10,}$/.test(contactNumber)) {
				errors.contactNumber = 'Please provide a valid contact number';
			}

			if (!birthday) {
				errors.birthday = 'Birthday is required';
			} else {
				// Validate age (must be at least 13 years old)
				const birthDate = new Date(birthday);
				const today = new Date();
				let age = today.getFullYear() - birthDate.getFullYear();
				const monthDiff = today.getMonth() - birthDate.getMonth();
				
				if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
					age--;
				}
				
				if (age < 13) {
					errors.birthday = 'You must be at least 13 years old to register';
				}
			}

			if (!address || address.length < 10) {
				errors.address = 'Please provide a complete address';
			}

			if (!gender || !['male', 'female'].includes(gender)) {
				errors.gender = 'Please select a gender';
			}

			if (Object.keys(errors).length > 0) {
				return fail(400, {
					errors,
					data: {
						email,
						firstName,
						middleName,
						lastName,
						contactNumber,
						birthday,
						address,
						gender
					}
				});
			}

			const existingUser = await db
				.select()
				.from(accounts)
				.where(eq(accounts.email, email!))
				.limit(1);

			if (existingUser.length > 0) {
				return fail(409, {
					errors: { email: 'An account with this email already exists' },
					data: {
						email,
						firstName,
						middleName,
						lastName,
						contactNumber,
						birthday,
						address,
						gender
					}
				});
			}

			// Hash password
			const hashedPassword = await hash(password!, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			// Create new account
			const [newAccount] = await db
				.insert(accounts)
				.values({
					email: email!,
					password: hashedPassword,
					role: 'user', 
					provider: 'email',
					provider_id: email!,
					firstname: firstName!,
					middlename: middleName,
					lastname: lastName!,
					contacts: contactNumber!,
					birthday: birthday!,
					address: address!,
					gender: gender as 'male' | 'female'
				} as any)
				.returning();

			if (!newAccount) {
				return fail(500, {
					errors: { general: 'Failed to create account. Please try again.' },
					data: {
						email,
						firstName,
						middleName,
						lastName,
						contactNumber,
						birthday,
						address,
						gender
					}
				});
			}

			// throw redirect(303, '/login');

			return {success: true}

		} catch (error) {
			if (error instanceof Response && error.status === 303) {
				throw error;
			}

			console.error('Registration error:', error);

			return fail(500, {
				errors: {
					general: 'An unexpected error occurred. Please try again later.'
				}
			});
		}
	}
};