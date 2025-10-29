import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		const body = await request.json();

		const {
			product_name,
			product_description,
			product_stock,
			product_price,
			product_colors,
			product_category,
			product_image
		} = body;

		let buffer: Buffer | null = null;

		if (product_image && typeof product_image === 'string') {
			let base64String = product_image.trim();

			if (!base64String.startsWith('data:image')) {
				base64String = `data:image/jpeg;base64,${base64String}`;
			}

			const base64Data = base64String.split(',')[1];
			buffer = Buffer.from(base64Data, 'base64');
		}

		await db.insert(product).values({
			name: product_name,
			description: product_description,
			category: product_category,
			stock: product_stock,
			price: product_price,
			image: buffer,
			colors: product_colors
		});

		return json({ success: true, message: 'Product added successfully' });
	} catch (error) {
		console.error(error);
		return json({ success: false, error: 'Failed to add product' }, { status: 500 });
	}
}
