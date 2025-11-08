import { pgTable, foreignKey, unique, serial, varchar, text, numeric, timestamp, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const categoryEnum = pgEnum("category_enum", ['twin', 'full', 'queen', 'king'])
export const departmentEnum = pgEnum("department_enum", ['production', 'management', 'staff'])
export const genderEnum = pgEnum("gender_enum", ['male', 'female'])
export const roleEnum = pgEnum("role_enum", ['admin', 'user', 'manager'])
export const status = pgEnum("status", ['pending', 'cancelled', 'completed', 'delivery'])


export const transaction = pgTable("transaction", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	info: text(),
	amount: numeric().notNull(),
	discount: numeric().default('0'),
	date: timestamp({ mode: 'string' }).notNull(),
	orderDate: timestamp("order_date", { mode: 'string' }).notNull(),
	arrival: timestamp({ mode: 'string' }),
	accountId: integer("account_id").notNull(),
	orderId: integer("order_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "transaction_account_id_accounts_id_fk"
		}),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [order.id],
			name: "transaction_order_id_order_id_fk"
		}),
	unique("transaction_order_id_unique").on(table.orderId),
]);

export const order = pgTable("order", {
	id: serial().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	status: status().notNull(),
	accountId: integer("account_id").notNull(),
	shippingFee: numeric("shipping_fee").default('0').notNull(),
	distanceKm: numeric("distance_km").default('0').notNull(),
	totalAmount: numeric("total_amount").default('0').notNull(),
	productIds: integer("product_ids").array().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "order_account_id_accounts_id_fk"
		}),
]);

export const orderItem = pgTable("order_item", {
	id: serial().primaryKey().notNull(),
	quantity: integer().notNull(),
	price: numeric().notNull(),
	orderId: integer("order_id").notNull(),
	productId: integer("product_id").notNull(),
	colors: text().array().default(["RAY"]),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [order.id],
			name: "order_item_order_id_order_id_fk"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [product.id],
			name: "order_item_product_id_product_id_fk"
		}),
]);

export const cartItem = pgTable("cart_item", {
	id: serial().primaryKey().notNull(),
	quantity: integer().notNull(),
	cartId: integer("cart_id").notNull(),
	productId: integer("product_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.cartId],
			foreignColumns: [cart.id],
			name: "cart_item_cart_id_cart_id_fk"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [product.id],
			name: "cart_item_product_id_product_id_fk"
		}),
]);

export const admin = pgTable("admin", {
	id: serial().primaryKey().notNull(),
	firstname: varchar({ length: 255 }),
	middlename: varchar({ length: 255 }),
	lastname: varchar({ length: 255 }),
	email: varchar({ length: 255 }).notNull(),
	birthday: varchar({ length: 255 }).notNull(),
	gender: genderEnum().notNull(),
	password: varchar({ length: 255 }).notNull(),
	department: departmentEnum(),
	contacts: varchar({ length: 255 }),
	address: text().notNull(),
	role: roleEnum().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("admin_email_unique").on(table.email),
]);

export const category = pgTable("category", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	parentId: integer("parent_id"),
});

export const accounts = pgTable("accounts", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }),
	role: roleEnum().notNull(),
	provider: text().notNull(),
	providerId: text("provider_id").notNull(),
	firstname: varchar({ length: 255 }).notNull(),
	middlename: varchar({ length: 255 }),
	lastname: varchar({ length: 255 }).notNull(),
	contacts: varchar({ length: 255 }),
	birthday: varchar({ length: 255 }),
	address: text(),
	gender: genderEnum(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("accounts_email_unique").on(table.email),
]);

export const inventoryLog = pgTable("inventory_log", {
	id: serial().primaryKey().notNull(),
	type: varchar({ length: 255 }).notNull(),
	quantityChange: integer("quantity_change").notNull(),
	date: timestamp({ mode: 'string' }).defaultNow().notNull(),
	productId: integer("product_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [product.id],
			name: "inventory_log_product_id_product_id_fk"
		}),
]);

export const payment = pgTable("payment", {
	id: serial().primaryKey().notNull(),
	method: varchar({ length: 255 }).notNull(),
	status: varchar({ length: 255 }).notNull(),
	date: timestamp({ mode: 'string' }).defaultNow().notNull(),
	amount: numeric().notNull(),
	orderId: integer("order_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [order.id],
			name: "payment_order_id_order_id_fk"
		}),
	unique("payment_order_id_unique").on(table.orderId),
]);

export const shipping = pgTable("shipping", {
	id: serial().primaryKey().notNull(),
	trackingNumber: varchar("tracking_number", { length: 255 }),
	carrier: varchar({ length: 255 }),
	status: varchar({ length: 255 }).notNull(),
	estimatedArrival: timestamp("estimated_arrival", { mode: 'string' }),
	orderId: integer("order_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [order.id],
			name: "shipping_order_id_order_id_fk"
		}),
	unique("shipping_order_id_unique").on(table.orderId),
]);

export const cart = pgTable("cart", {
	id: serial().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	accountId: integer("account_id").notNull(),
	productId: integer("product_id"),
	colors: text().array().default(["RAY"]),
	quantity: integer(),
	category: categoryEnum().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "cart_account_id_accounts_id_fk"
		}),
]);

export const product = pgTable("product", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	price: numeric().notNull(),
	stock: integer().notNull(),
	// TODO: failed to parse database type 'bytea'
	image: unknown("image"),
	category: categoryEnum().notNull(),
	colors: text().array().default(["RAY"]),
});

export const review = pgTable("review", {
	id: serial().primaryKey().notNull(),
	rating: integer().notNull(),
	comment: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	accountId: integer("account_id").notNull(),
	productId: integer("product_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "review_account_id_accounts_id_fk"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [product.id],
			name: "review_product_id_product_id_fk"
		}),
]);
