import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';


export async function POST({request}) {
	const body = request.body

	console.log(body)

	// const response = await db.insert(product)

	return json({})

}