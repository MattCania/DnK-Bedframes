import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const result = await db.select().from(product).where(eq(product.id, Number(id)));

	if (!result.length) {
		return { status: 404, error: new Error('Product not found') };
	}

	const p = result[0];

	return {
		product: {
			id: p.id,
			name: p.name,
			price: parseFloat(p.price),
			originalPrice: parseFloat(p.price) * 2, // just for demo
			description: p.description,
			image: p.image
				? `data:image/jpeg;base64,${Buffer.from(p.image).toString('base64')}`
				: null,
			colors: p.colors || ['Black', 'White', 'Gray'],
			sizes: ['Twin-Size', 'Queen-Size', 'King-Size'],
			rating: 4.8
		}
	};
};
