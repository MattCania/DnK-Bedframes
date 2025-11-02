import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { review, accounts, product } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session || session.role !== 'admin') throw redirect(303, '/');

	const rows = await db
		.select({
			id: review.id,
			rating: review.rating,
			comment: review.comment,
			created_at: review.created_at,
			customer_first: accounts.firstname,
			customer_last: accounts.lastname,
			product_name: product.name
		})
		.from(review)
		.leftJoin(accounts, eq(accounts.id, review.account_id))
		.leftJoin(product, eq(product.id, review.product_id))
		.orderBy(desc(review.created_at))
		.limit(250);

	const items = rows.map((r) => ({
		reviewId: String(r.id).padStart(4, '0'),
		customer: `${r.customer_first ?? ''} ${r.customer_last ?? ''}`.trim() || '—',
		product: r.product_name ?? '—',
		rating: Number(r.rating ?? 0),
		comment: r.comment ?? '',
		date: r.created_at,
		status: r.rating >= 4 ? 'Approved' : r.rating <= 2 ? 'Flagged' : 'Pending'
	}));

	const count = items.length;
	const sum = items.reduce((a, b) => a + (b.rating || 0), 0);
	const average = count ? sum / count : 0;
	const distribution = [5, 4, 3, 2, 1].map((star) => ({
		star,
		count: items.filter((i) => i.rating === star).length
	}));

	return { items, average, distribution };
};
