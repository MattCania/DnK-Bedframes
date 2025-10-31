import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { product, cart } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const result = await db
		.select()
		.from(product)
		.where(eq(product.id, Number(id)));

	if (!result.length) {
		return { status: 404, error: new Error('Product not found') };
	}

	const p = result[0];

	return {
		product: {
			id: p.id,
			name: p.name,
			price: parseFloat(p.price),
			stock: p.stock,
			originalPrice: parseFloat(p.price) * 2,
			description: p.description,
			image: p.image ? `data:image/jpeg;base64,${Buffer.from(p.image).toString('base64')}` : null,
			colors: p.colors || ['Black', 'White', 'Gray'],
			sizes: [p.category],
			category: p.category,
			rating: 4.8
		}
	};
};

export const actions: Actions = {
	'add-to-cart': async ({ request, locals }) => {
		const data = await request.formData();
		const product_id = Number(data.get('product_id'));
		const quantity = Math.max(1, Number(data.get('quantity')) || 1);
		const color = String(data.get('color') ?? '');
		const size = String(data.get('size') ?? 'twin');

		const session = await locals.auth();
		const account_id = (session as any)?.userId ?? null;

		if (!account_id) return fail(401, { message: 'Not logged in' });

		try {
			// Check product stock
			const pRows = await db.select().from(product).where(eq(product.id, product_id));
			if (!pRows.length) return fail(404, { message: 'Product not found' });
			const p = pRows[0];
			const stock = Number(p.stock ?? 0);

			const existing = await db
				.select()
				.from(cart)
				.where(
					and(
						eq(cart.account_id, Number(account_id)),
						eq(cart.product_id, product_id),
						eq(cart.category, size as any)
					)
				);

			let added = 0;
			if (existing.length) {
				const current = existing[0];
				const currentQty = Number(current.quantity ?? 0);
				const allowed = Math.max(0, stock - currentQty);
				if (allowed <= 0) return fail(400, { message: 'Max stock reached' });
				added = Math.min(quantity, allowed);
				await db
					.update(cart)
					.set({ quantity: currentQty + added, colors: [color] })
					.where(eq(cart.id, current.id));
			} else {
				added = Math.min(quantity, stock);
				if (added <= 0) return fail(400, { message: 'Out of stock' });
				await db.insert(cart).values({
					account_id: Number(account_id),
					product_id,
					quantity: added,
					colors: [color],
					category: size as any
				});
			}

			return { success: true, added };
		} catch (err) {
			console.error('Error adding to cart:', err);
			return fail(500, { message: 'Database insert failed' });
		}
	},

	buyNow: async () => {
		throw redirect(303, '/checkout');
	}
};
