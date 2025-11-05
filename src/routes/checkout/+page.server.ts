import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { accounts, cart, product, order as orderTable, orderItem } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

const FLAT_SHIPPING_FEE = 36;

// Add these constants to match your frontend
const BASE_FEE = 200; // Updated to 200 as requested
const RATE_PER_KM = 15;
const FREE_SHIPPING_THRESHOLD = 2000;
const STORE_LAT = 14.76741;
const STORE_LNG = 121.04385;

function formatImage(img: unknown) {
	if (!img) return null;
	try {
		return `data:image/jpeg;base64,${Buffer.from(img as any).toString('base64')}`;
	} catch {
		return null;
	}
}

function estimatedRange() {
	const now = new Date();
	const start = new Date(now);
	start.setDate(start.getDate() + 3);
	const end = new Date(now);
	end.setDate(end.getDate() + 7);
	const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
	return `${start.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', opts)}`;
}

// Helper function to parse coordinates from address
function parseCoordinates(address: string | null): { lat: number; lng: number } | null {
	if (!address) return null;
	const coordMatch = address.match(/\((-?\d+\.\d+),\s*(-?\d+\.\d+)\)\s*$/);
	if (coordMatch) {
		return {
			lat: parseFloat(coordMatch[1]),
			lng: parseFloat(coordMatch[2])
		};
	}
	return null;
}

// Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const R = 6371;
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
			Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

// Server-side shipping calculation
function calculateShippingFee(distanceKm: number, itemsTotal: number): number {
	if (itemsTotal >= FREE_SHIPPING_THRESHOLD) {
		return 0;
	}
	const fee = BASE_FEE + distanceKm * RATE_PER_KM;
	return Math.round(fee * 100) / 100;
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session) throw redirect(303, '/login');

	// Load account info
	let account: typeof accounts.$inferSelect | null = null;
	try {
		const [row] = await db
			.select()
			.from(accounts)
			.where(eq(accounts.id, Number(session.userId)));
		account = row ?? null;
	} catch {
		account = null;
	}

	const rows = await db
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

	const items = rows.map((r) => ({
		id: r.id,
		product_id: r.product_id,
		name: r.name,
		price: parseFloat(r.price as unknown as string),
		quantity: r.quantity ?? 0,
		colors: r.colors ?? [],
		category: r.category,
		image: formatImage(r.image)
	}));

	const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

	// Calculate shipping based on distance if address has coordinates
	let shippingFee = FLAT_SHIPPING_FEE;
	if (account?.address) {
		const coords = parseCoordinates(account.address);
		if (coords) {
			const distance = calculateDistance(STORE_LAT, STORE_LNG, coords.lat, coords.lng);
			shippingFee = calculateShippingFee(distance, itemsTotal);
		}
	}

	const totalAmount = itemsTotal + shippingFee;

	return {
		items,
		itemsTotal,
		shippingFee,
		totalAmount,
		estimatedDelivery: estimatedRange(),
		account: account
	};
};

export const actions: Actions = {
	purchase: async ({ locals, request }) => {
		const session = await locals.auth();
		if (!session) return fail(401, { message: 'Not logged in' });

		// Get form data
		const formData = await request.formData();
		const submittedShippingFee = parseFloat((formData.get('shipping_fee') as string) || '0');
		const submittedDistance = parseFloat((formData.get('distance_km') as string) || '0');
		const submittedTotal = parseFloat((formData.get('total_amount') as string) || '0');

		// Ensure types align with schema
		const productIdsRaw = JSON.parse((formData.get('product_ids') as string) || '[]'); // [12, 55, 93]
		const productIds: number[] = Array.isArray(productIdsRaw)
			? productIdsRaw.map((n: any) => Number(n)).filter((n: any) => Number.isFinite(n))
			: [];
		const quantities = JSON.parse((formData.get('quantities') as string) || '[]'); // [1, 2, 1]
		const colors = JSON.parse((formData.get('colors') as string) || '[]'); // ["Red", "Blue", null]
		// Get account to verify address
		const [accountRow] = await db
			.select()
			.from(accounts)
			.where(eq(accounts.id, Number(session.userId)));

		if (!accountRow?.address) {
			return fail(400, { message: 'Please set your delivery address in account settings' });
		}

		const rows = await db
			.select({
				id: cart.id,
				quantity: cart.quantity,
				colors: cart.colors,
				product_id: cart.product_id,
				price: product.price
			})
			.from(cart)
			.leftJoin(product, eq(product.id, cart.product_id))
			.where(eq(cart.account_id, Number(session.userId)));

		if (!rows.length) return fail(400, { message: 'Cart is empty' });

		// Calculate items total
		const itemsTotal = rows.reduce((sum, r) => {
			const price = parseFloat(r.price as unknown as string);
			return sum + price * (r.quantity ?? 0);
		}, 0);

		// Server-side validation: recalculate shipping fee
		let actualShippingFee = FLAT_SHIPPING_FEE;
		let actualDistance = 0;
		const coords = parseCoordinates(accountRow.address);

		if (coords) {
			actualDistance = calculateDistance(STORE_LAT, STORE_LNG, coords.lat, coords.lng);
			actualShippingFee = calculateShippingFee(actualDistance, itemsTotal);
		}

		// Verify the submitted values match (with small tolerance for rounding)
		if (Math.abs(actualShippingFee - submittedShippingFee) > 0.5) {
			return fail(400, {
				message: 'Shipping fee mismatch. Please refresh and try again.'
			});
		}

		const actualTotal = itemsTotal + actualShippingFee;

		// Create order with shipping info
		const inserted = await db
			.insert(orderTable)
			.values({
				status: 'pending',
				account_id: Number(session.userId),
				product_ids: productIds,
				shipping_fee: String(actualShippingFee),
				distance_km: String(actualDistance),
				total_amount: String(actualTotal)
			})
			.returning({ id: orderTable.id });

		const orderId = inserted[0]?.id;
		if (!orderId) return fail(500, { message: 'Failed to create order' });

		for (const r of rows) {
			await db.insert(orderItem).values({
				colors: r.colors ?? [],
				quantity: Number(r.quantity ?? 0),
				price: r.price as any,
				order_id: orderId,
				product_id: Number(r.product_id)
			});
		}

		await db.delete(cart).where(eq(cart.account_id, Number(session.userId)));

		throw redirect(303, '/account');
	}
};
