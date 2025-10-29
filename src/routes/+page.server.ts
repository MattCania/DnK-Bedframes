import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Get all products
		const rows = await db.query.product.findMany();

		if (!rows || rows.length === 0) throw new Error('No products found');

		// Convert all product images
		const products = rows.map((p) => {
			let imageBase64 = null;
			if (p.image) {
				const base64 = Buffer.from(p.image).toString('base64');
				imageBase64 = `data:image/png;base64,${base64}`;
			}
			return {
				...p,
				image: imageBase64
			};
		});

		return {
			success: true,
			data: products
		};
	} catch (err) {
		return { success: false, error: String(err) };
	}
};
