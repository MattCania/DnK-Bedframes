import type { ProductDto } from '$lib/data/interfaces.js';
import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const file = formData.get('product_image') as File;
		const product_name = formData.get('product_name') as string;
		const product_description = formData.get('product_description') as string;
		const product_stock = Number(formData.get('product_stock'));
		const product_price = formData.get('product_price') as string;
		const product_colors_raw = formData.get('product_colors') as string;
		const product_category = formData.get('product_category') as
			| 'twin'
			| 'full'
			| 'queen'
			| 'king';

		const buffer = file ? Buffer.from(await file.arrayBuffer()) : null;

		const product_colors = product_colors_raw
			? product_colors_raw.split(',').map((color) => color.trim())
			: [];

		if (!buffer) {
			console.log('Image is Null');
			// return json({ success: false, error: 'Image is required' }, { status: 400 });
		}

		await db.insert(product).values({
			name: product_name,
			description: product_description,
			category: product_category,
			stock: product_stock,
			price: product_price,
			image: buffer || null,
			colors: product_colors
		});

		return {success: true}
	}
};
