import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH({ params, request }) {
	const id = Number(params.id);
	if (!id || Number.isNaN(id)) {
		return json({ success: false, message: 'Invalid product id' }, { status: 400 });
	}

	let body: any;
	try {
		body = await request.json();
	} catch {
		return json({ success: false, message: 'Invalid JSON' }, { status: 400 });
	}

	const allowed = ['name', 'description', 'price', 'stock', 'category', 'colors', 'image'] as const;
	const updates: Record<string, unknown> = {};
	for (const k of allowed) {
		if (k in body) updates[k] = body[k];
	}

	if ('price' in updates && typeof updates.price === 'string') {
		updates.price = updates.price.trim();
	}
	if ('stock' in updates) {
		const n = Number(updates.stock);
		if (Number.isNaN(n))
			return json({ success: false, message: 'stock must be a number' }, { status: 400 });
		updates.stock = n;
	}
	if ('colors' in updates && typeof updates.colors === 'string') {
		updates.colors = (updates.colors as string)
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
	}

	if ('image' in updates && typeof updates.image === 'string') {
		const img = (updates.image as string).trim();
		if (img) {
			const base64 = img.includes(',') ? img.split(',')[1] : img;
			updates.image = Buffer.from(base64, 'base64');
		} else {
			updates.image = null;
		}
	}

	try {
		const [row] = await db
			.update(product)
			.set({ ...updates })
			.where(eq(product.id, id))
			.returning();
		if (!row) return json({ success: false, message: 'Product not found' }, { status: 404 });
		return json({ success: true, product: row });
	} catch (e) {
		console.error('Failed to update product', e);
		return json({ success: false, message: 'Failed to update product' }, { status: 500 });
	}
}

export async function DELETE({ params }) {
	const id = Number(params.id);
	if (!id || Number.isNaN(id)) {
		return json({ success: false, message: 'Invalid product id' }, { status: 400 });
	}

	try {
		const res = await db.delete(product).where(eq(product.id, id)).returning({ id: product.id });
		if (!res || res.length === 0) {
			return json({ success: false, message: 'Product not found' }, { status: 404 });
		}
		return json({ success: true, id });
	} catch (e) {
		console.error('Failed to delete product', e);
		return json({ success: false, message: 'Failed to delete product' }, { status: 500 });
	}
}
