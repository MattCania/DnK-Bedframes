import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import { registerAccount } from '../register/helper/db';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Google({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		})
	],
	secret: AUTH_SECRET,
	pages: {
		signIn: '/login',
		signOut: '/'
	},
	callbacks: {
		async signIn({ user, account }) {
			if (!user || !account) return false;

			const exists = await db.query.accounts.findFirst({
				where: (acc, { eq }) => eq(acc.email, user.email ?? '')
			});

			if (!exists) {
				await registerAccount({
					email: user.email!,
					role: 'user',
					provider: account.provider ?? 'google',
					provider_id: account.providerAccountId ?? '',
					firstname: user.name?.split(' ')[0] ?? 'Unknown',
					lastname: user.name?.split(' ').slice(1).join(' ') ?? '',
					middlename: null,
					contacts: null,
					birthday: null,
					address: null,
					gender: null
				});
			}

			return true;
		},

		async jwt({ token, user }) {
			if (user) {
				await db.transaction(async (tx) => {
					const acc = await tx.query.accounts.findFirst({
						where: (a, { eq }) => eq(a.email, user.email ?? '')
					});

					if (!acc) return;

					const prof = await tx.query.profile.findFirst({
						where: (p, { eq }) => eq(p.account_id, acc.account_id)
					});

					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const t = token as any;

					t.userId = acc.account_id;
					t.email = acc.email;
					t.role = acc.role ?? 'user';
					t.fullname = `${prof?.firstname ?? ''} ${prof?.lastname ?? ''}`.trim();
					t.contacts = prof?.contacts ?? null;
					t.birthday = prof?.birthday ?? null;
					t.address = prof?.address ?? null;
					t.gender = prof?.gender ?? null;
				});
			}

			return token;
		},

		async session({ session, token }) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const s = session as any;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const t = token as any;

			s.userId = t.userId;
			s.role = t.role;
			s.fullname = t.fullname;
			s.contacts = t.contacts;
			s.birthday = t.birthday;
			s.address = t.address;
			s.gender = t.gender;

			return s;
		}
	}
});
