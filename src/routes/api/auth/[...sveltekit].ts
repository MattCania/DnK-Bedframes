import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET } from "$env/static/private";
import { db } from "$lib/server/db";
import { accounts } from "$lib/server/db/schema";

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
    async signIn ({ user, account }) {

      if (!user || !account) {
        return false
      } 

      const exists = await db.query.accounts.findFirst({
        where: (acc, {eq}) => eq(acc.email, user.email ?? "")
      })

      if (!exists) {
        await db.insert(accounts).values({
          email: user.email!,
          role: "user",
          provider: account?.provider ?? "google",
          provider_id: account?.providerAccountId ?? null,
          created_at: new Date(),
        });
      }

      console.log(`Signing in ${user.email}`)

      return true
    },
    async session({ session, token }) {
      session.userId = token.sub?.toString() ?? "";
      return session;
    }
  }
});
