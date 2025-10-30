import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { product, cart } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

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
			originalPrice: parseFloat(p.price) * 2, // demo value
			description: p.description,
			image: p.image
				? `data:image/jpeg;base64,${Buffer.from(p.image).toString('base64')}`
				: null,
			colors: p.colors || ['Black', 'White', 'Gray'],
			sizes: Array.isArray(p.sizes) ? p.sizes : [p.category], // fallback
			category: p.category,
			rating: 4.8
		}
	};
};

export const actions: Actions = {
	addToCart: async ({ request, locals }) => {
		const data = await request.formData();
		const product_id = Number(data.get('product_id'));
		const quantity = Number(data.get('quantity'));
		const color = String(data.get('color'));
		const size = String(data.get('size'));

		// Example: you might get the user's account_id from locals.session
		const session = await locals.auth()

		if (!account_id) return fail(401, { message: 'Not logged in' });

		try {
			await db.insert(cart).values({
				account_id,
				product_id,
				quantity,
				colors: [color],
				category: 'twin'
			});

			return { success: true };
		} catch (err) {
			console.error('Error adding to cart:', err);
			return fail(500, { message: 'Database insert failed' });
		}
	},

	buyNow: async ({ request }) => {
		// Same as above, or redirect to checkout
		throw redirect(303, '/checkout');
	}
};
