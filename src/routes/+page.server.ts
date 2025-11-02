import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { product, review } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const rows = await db.select().from(product);

	const reviewRows = await db
		.select({
			product_id: review.product_id,
			avg_rating: sql<number>`avg(${review.rating})`,
			count: sql<number>`count(*)`
		})
		.from(review)
		.groupBy(review.product_id);

	const byProduct: Record<number, { avg: number; count: number }> = {};
	for (const r of reviewRows) {
		byProduct[Number(r.product_id)] = {
			avg: Number(r.avg_rating ?? 0),
			count: Number(r.count ?? 0)
		};
	}

	const products = rows.map((p) => ({
		id: p.id,
		product_name: p.name,
		product_description: p.description,
		product_price: parseFloat(p.price),
		product_stock: p.stock,
		product_colors: p.colors,
		product_category: p.category,
		image: p.image ? `data:image/jpeg;base64,${Buffer.from(p.image).toString('base64')}` : null,
		product_rating: Number((byProduct[p.id]?.avg ?? 0).toFixed(1)),
		review_count: byProduct[p.id]?.count ?? 0
	}));

	return { products };
};
