import type { RegisterDto } from "$lib/data/interfaces";
import { db } from "$lib/server/db";
import { accounts, profile } from "$lib/server/db/schema";
import argon2 from "@node-rs/argon2";
import { eq } from "drizzle-orm";

export const registerAccount = async (account_dto: RegisterDto) => {
	const {
		email,
		password,
		role,
		provider,
		profile_id,
		firstname,
		middlename,
		lastname,
		contacts,
		birthday,
		address,
		gender
	} = account_dto;

	let hash: string | undefined;

	const exists = await db.query.accounts.findFirst({
		where: eq(accounts.email, email)
	});

	if (exists) {
		return {
			exists: true,
			data: null
		};
	}

	if (password) {
		hash = await argon2.hash(password);
	}

	const data = await db.transaction(async (tx) => {
		const [account_response] = await tx
			.insert(accounts)
			.values({
				email,
				password: hash,
				role,
				provider,
				provider_id: profile_id
			})
			.returning({
				account_id: accounts.account_id,
				email: accounts.email,
				role: accounts.role
			});

		const [profile_response] = await tx
			.insert(profile)
			.values({
				firstname,
				middlename,
				lastname,
				contacts,
				birthday,
				address,
				gender,
				account_id: account_response.account_id
			})
			.returning({
				firstname: profile.firstname,
				middlename: profile.middlename,
				lastname: profile.lastname,
				contacts: profile.contacts,
				birthday: profile.birthday,
				address: profile.address,
				gender: profile.gender
			});

		return { ...account_response, ...profile_response };
	});

	return {
		exists: false,
		data
	};
};
