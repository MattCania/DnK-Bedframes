import type { Actions } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { accounts as users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "@node-rs/argon2";

export const actions: Actions = {
	resetPassword: async ({ request }) => {
		try {
			const formData = await request.formData();
			const email = formData.get("email")?.toString();
			const password = formData.get("password")?.toString();
			const confirmPassword = formData.get("confirmPassword")?.toString();

			console.log("Form received:", { email, password, confirmPassword });

			if (!email || !password || !confirmPassword) {
				return { success: false, message: "All fields are required." };
			}

			if (password !== confirmPassword) {
				return { success: false, message: "Passwords do not match." };
			}

			// Validate user exists
			const existing = await db.query.accounts.findFirst({
				where: eq(users.email, email)
			});
			if (!existing) {
				return { success: false, message: "No account found with that email." };
			}

			// Hash with timeout safeguard
			let hashed: string;
			try {
				hashed = await Promise.race([
					hash(password),
					new Promise((_, reject) => setTimeout(() => reject(new Error("Hash timeout")), 5000))
				]);
			} catch (err) {
				console.error("Hashing error:", err);
				return { success: false, message: "Failed to hash password." };
			}

			// Database update with error handling
			try {
				const result = await db
					.update(users)
					.set({ password: hashed })
					.where(eq(users.email, email))
					.returning({ email: users.email });

				if (result.length === 0) {
					return { success: false, message: "Password update failed — user not found." };
				}

				console.log("Password updated for:", email);
				return { success: true, message: "✅ Password has been reset successfully." };
			} catch (dbError) {
				console.error("Database error:", dbError);
				return { success: false, message: "Database error while updating password." };
			}
		} catch (error) {
			console.error("Unexpected error in resetPassword:", error);
			return { success: false, message: "Unexpected error occurred." };
		}
	}
};
