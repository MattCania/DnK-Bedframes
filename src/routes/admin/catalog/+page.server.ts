import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const rows = await db.select().from(product);
	const products = rows.map((p) => ({
		id: p.id,
		name: p.name,
		description: p.description,
		price: parseFloat(p.price as unknown as string),
		stock: p.stock,
		category: p.category,
		colors: p.colors,
		image: p.image ? `data:image/jpeg;base64,${Buffer.from(p.image).toString('base64')}` : null
	}));

	return { products };
};
