import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const rows = await db.select().from(product);

	const products = rows.map((p) => ({
		id: p.id,
		product_name: p.name,
		product_description: p.description,
		product_price: parseFloat(p.price),
		product_stock: p.stock,
		product_colors: p.colors,
		product_category: p.category,
		image: p.image
			? `data:image/jpeg;base64,${Buffer.from(p.image).toString('base64')}`
			: null,
		product_rating: 0
	}));

	return { products };
};
