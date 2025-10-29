import type { ProductDto } from '$lib/data/interfaces.js';
import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const formData = await request.formData();

  const file = formData.get('product_image') as File;
  const product_name = formData.get('product_name') as string;
  const product_description = formData.get('product_description') as string;
  const product_stock = Number(formData.get('product_stock'));
  const product_price = formData.get('product_price') as string; // Keep as string for decimal
  const product_colors = formData.getAll('product_colors') as string[]; // Cast to string[]
  const product_category = formData.get('product_category') as 'twin' | 'full' | 'queen' | 'king';

  const buffer = file ? Buffer.from(await file.arrayBuffer()) : null;

  // Add validation for required fields
  if (!buffer) {
    return json({ success: false, error: 'Image is required' }, { status: 400 });
  }

  await db.insert(product).values({
    name: product_name,
    description: product_description,
    category: product_category,
    stock: product_stock,
    price: product_price, // Now a string
    image: buffer,
    colors: product_colors // Now properly typed as string[]
  });

  return json({ success: true });
}