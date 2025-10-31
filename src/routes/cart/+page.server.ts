import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { cart, product } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session) throw redirect(303, '/login');

	try {
		const rows = await db
			.select({
				id: cart.id,
				quantity: cart.quantity,
				colors: cart.colors,
				category: cart.category,
				product_id: cart.product_id,
				name: product.name,
				price: product.price,
				image: product.image,
				stock: product.stock
			})
			.from(cart)
			.leftJoin(product, eq(product.id, cart.product_id))
			.where(eq(cart.account_id, Number(session.userId)));

		const items = rows.map((r) => ({
			id: r.id,
			product_id: r.product_id,
			name: r.name,
			price: parseFloat(r.price as unknown as string),
			quantity: r.quantity ?? 0,
			colors: r.colors ?? [],
			category: r.category,
			image: r.image
				? `data:image/jpeg;base64,${Buffer.from(r.image as any).toString('base64')}`
				: null,
			stock: r.stock ?? 0,
			subtotal: (r.quantity ?? 0) * parseFloat(r.price as unknown as string)
		}));

		const total = items.reduce((sum, i) => sum + i.subtotal, 0);

		return { items, total };
	} catch (err) {
		console.error('Failed to load cart:', err);
		throw fail(500, { message: 'Failed to load cart' });
	}
};

export const actions: Actions = {
	increment: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session) return fail(401, { message: 'Not logged in' });
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { message: 'Invalid cart item id' });

		const rows = await db
			.select({
				id: cart.id,
				quantity: cart.quantity,
				product_id: cart.product_id,
				stock: product.stock
			})
			.from(cart)
			.leftJoin(product, eq(product.id, cart.product_id))
			.where(and(eq(cart.id, id), eq(cart.account_id, Number(session.userId))));
		if (!rows.length) return fail(404, { message: 'Cart item not found' });
		const current = rows[0];
		const qty = Number(current.quantity ?? 0);
		const stock = Number(current.stock ?? 0);
		if (qty >= stock) return fail(400, { message: 'Max stock reached' });
		await db
			.update(cart)
			.set({ quantity: qty + 1 })
			.where(eq(cart.id, id));
		return { success: true };
	},
	decrement: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session) return fail(401, { message: 'Not logged in' });
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { message: 'Invalid cart item id' });

		const rows = await db
			.select()
			.from(cart)
			.where(and(eq(cart.id, id), eq(cart.account_id, Number(session.userId))));
		if (!rows.length) return fail(404, { message: 'Cart item not found' });
		const current = rows[0];
		const nextQty = Math.max(0, (current.quantity ?? 0) - 1);
		if (nextQty <= 0) {
			await db.delete(cart).where(eq(cart.id, id));
		} else {
			await db.update(cart).set({ quantity: nextQty }).where(eq(cart.id, id));
		}
		return { success: true };
	},
	remove: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session) return fail(401, { message: 'Not logged in' });
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { message: 'Invalid cart item id' });

		await db.delete(cart).where(and(eq(cart.id, id), eq(cart.account_id, Number(session.userId))));
		return { success: true };
	}
};
