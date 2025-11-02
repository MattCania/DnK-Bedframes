import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { review, product } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	const session = await locals.auth();
	if (!session) throw redirect(301, '/');

	const userId = Number(session.userId);

	const rows = await db
		.select({
			id: review.id,
			rating: review.rating,
			comment: review.comment,
			created_at: review.created_at,
			product_name: product.name
		})
		.from(review)
		.leftJoin(product, eq(product.id, review.product_id))
		.where(eq(review.account_id, userId))
		.orderBy(desc(review.created_at));

	const items = rows.map((r) => ({
		id: r.id,
		product: r.product_name ?? '—',
		rating: Number(r.rating ?? 0),
		comment: r.comment ?? '',
		date: r.created_at
	}));

	const count = items.length;
	const sum = items.reduce((a, b) => a + (b.rating || 0), 0);
	const average = count ? sum / count : 0;

	return { items, average, count };
};
