import { relations } from "drizzle-orm/relations";
import { accounts, transaction, order, orderItem, product, cart, cartItem, inventoryLog, payment, shipping, review } from "./schema";

export const transactionRelations = relations(transaction, ({one}) => ({
	account: one(accounts, {
		fields: [transaction.accountId],
		references: [accounts.id]
	}),
	order: one(order, {
		fields: [transaction.orderId],
		references: [order.id]
	}),
}));

export const accountsRelations = relations(accounts, ({many}) => ({
	transactions: many(transaction),
	orders: many(order),
	carts: many(cart),
	reviews: many(review),
}));

export const orderRelations = relations(order, ({one, many}) => ({
	transactions: many(transaction),
	account: one(accounts, {
		fields: [order.accountId],
		references: [accounts.id]
	}),
	orderItems: many(orderItem),
	payments: many(payment),
	shippings: many(shipping),
}));

export const orderItemRelations = relations(orderItem, ({one}) => ({
	order: one(order, {
		fields: [orderItem.orderId],
		references: [order.id]
	}),
	product: one(product, {
		fields: [orderItem.productId],
		references: [product.id]
	}),
}));

export const productRelations = relations(product, ({many}) => ({
	orderItems: many(orderItem),
	cartItems: many(cartItem),
	inventoryLogs: many(inventoryLog),
	reviews: many(review),
}));

export const cartItemRelations = relations(cartItem, ({one}) => ({
	cart: one(cart, {
		fields: [cartItem.cartId],
		references: [cart.id]
	}),
	product: one(product, {
		fields: [cartItem.productId],
		references: [product.id]
	}),
}));

export const cartRelations = relations(cart, ({one, many}) => ({
	cartItems: many(cartItem),
	account: one(accounts, {
		fields: [cart.accountId],
		references: [accounts.id]
	}),
}));

export const inventoryLogRelations = relations(inventoryLog, ({one}) => ({
	product: one(product, {
		fields: [inventoryLog.productId],
		references: [product.id]
	}),
}));

export const paymentRelations = relations(payment, ({one}) => ({
	order: one(order, {
		fields: [payment.orderId],
		references: [order.id]
	}),
}));

export const shippingRelations = relations(shipping, ({one}) => ({
	order: one(order, {
		fields: [shipping.orderId],
		references: [order.id]
	}),
}));

export const reviewRelations = relations(review, ({one}) => ({
	account: one(accounts, {
		fields: [review.accountId],
		references: [accounts.id]
	}),
	product: one(product, {
		fields: [review.productId],
		references: [product.id]
	}),
}));