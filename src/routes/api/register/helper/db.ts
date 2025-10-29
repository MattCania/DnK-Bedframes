import type { RegisterDto } from "$lib/data/interfaces";
import { db } from "$lib/server/db";
import { accounts } from "$lib/server/db/schema";
import argon2 from "@node-rs/argon2";
import { eq } from "drizzle-orm";

export const registerAccount = async (account_dto: RegisterDto) => {
	const {
		email,
		password,
		role,
		provider,
		provider_id,
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

	const [data] = await db
		.insert(accounts)
		.values({
			email,
			password: hash,
			role,
			provider,
			provider_id,
			firstname,
			middlename,
			lastname,
			contacts,
			birthday,
			address,
			gender
		})
		.returning({
			id: accounts.id,
			email: accounts.email,
			role: accounts.role,
			firstname: accounts.firstname,
			middlename: accounts.middlename,
			lastname: accounts.lastname,
			contacts: accounts.contacts,
			birthday: accounts.birthday,
			address: accounts.address,
			gender: accounts.gender
		});

	return {
		exists: false,
		data
	};
};