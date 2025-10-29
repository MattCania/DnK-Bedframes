import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { product } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const row = await db.query.product.findFirst({
			where: eq(product.id, parseInt(params.id))
		});

		if (!row) throw new Error('Product not found');

		// Convert Buffer to base64 data URL (PNG assumed)
		let imageBase64 = null;
		if (row.image) {
			const base64 = Buffer.from(row.image).toString('base64');
			imageBase64 = `data:image/png;base64,${base64}`;
		}

		return {
			success: true,
			data: {
				...row,
				image: imageBase64
			}
		};
	} catch (err) {
		return { success: false, error: String(err) };
	}
};
