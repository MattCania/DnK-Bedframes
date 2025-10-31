import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { cart, product } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals, url }) => {
	const session = await locals.auth();

	if (!session) return { session: null, cartCount: 0, cartItems: [] };
	if (
		url.pathname === '/' &&
		url.searchParams.get('from') === 'oauth' &&
		session.role === 'admin'
	) {
		throw redirect(303, '/admin');
	}

	let items: Array<any> = [];
	try {
		items = await db
			.select({
				id: cart.id,
				quantity: cart.quantity,
				colors: cart.colors,
				category: cart.category,
				product_id: cart.product_id,
				name: product.name,
				price: product.price,
				image: product.image
			})
			.from(cart)
			.leftJoin(product, eq(product.id, cart.product_id))
			.where(eq(cart.account_id, Number(session.userId)));
	} catch {
		items = [];
	}

	const cartCount = items.reduce((sum, it) => sum + (Number(it.quantity ?? 0) || 0), 0);

	const cartItems = items.map((it) => ({
		id: it.id,
		product_id: it.product_id,
		name: it.name,
		price: parseFloat(it.price as unknown as string),
		quantity: it.quantity ?? 0,
		colors: it.colors ?? [],
		category: it.category,
		image: it.image
			? `data:image/jpeg;base64,${Buffer.from(it.image as any).toString('base64')}`
			: null
	}));

	return { session, cartCount, cartItems };
};
