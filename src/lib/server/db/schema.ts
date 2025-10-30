import {
	pgTable,
	serial,
	varchar,
	text,
	integer,
	timestamp,
	decimal,
	pgEnum,
	customType
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// Custom Types
const bytea = customType<{ data: Buffer }>({
	dataType() {
		return 'bytea';
	}
});

//  Enums
export const genderEnum = pgEnum('gender_enum', ['male', 'female']);
export const roleEnum = pgEnum('role_enum', ['admin', 'user', 'manager']);
export const departmentEnum = pgEnum('department_enum', ['production', 'management', 'staff']);
export const categoryEnum = pgEnum('category_enum', ['twin', 'full', 'queen', 'king']);

//  Tables
export const accounts = pgTable('accounts', {
	id: serial('id').primaryKey(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	password: varchar('password', { length: 255 }),
	role: roleEnum('role').notNull(),
	provider: text('provider').notNull(),
	provider_id: text('provider_id').notNull(),
	firstname: varchar('firstname', { length: 255 }).notNull(),
	middlename: varchar('middlename', { length: 255 }),
	lastname: varchar('lastname', { length: 255 }).notNull(),
	contacts: varchar('contacts', { length: 255 }),
	birthday: varchar('birthday', { length: 255 }),
	address: text('address'),
	gender: genderEnum('gender'),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').$onUpdate(() => new Date()),
});

export const admin = pgTable('admin', {
	id: serial('id').primaryKey(),
	firstname: varchar('firstname', { length: 255 }),
	middlename: varchar('middlename', { length: 255 }),
	lastname: varchar('lastname', { length: 255 }),
	email: varchar('email', { length: 255 }).unique().notNull(),
	birthday: varchar('birthday', { length: 255 }).notNull(),
	gender: genderEnum('gender').notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	department: departmentEnum('department'),
	contacts: varchar('contacts', { length: 255 }),
	address: text('address').notNull(),
	role: roleEnum('role').notNull(),
	created_at: timestamp('created_at').defaultNow().notNull(),
	updated_at: timestamp('updated_at').$onUpdate(() => new Date())
});

export const category = pgTable('category', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	parent_id: integer('parent_id')
});

export const product = pgTable('product', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	price: decimal('price').notNull(),
	stock: integer('stock').notNull(),
	image: bytea('image'),
	category: categoryEnum('category').notNull(),
	colors: text('colors')
		.array()
		.default(sql`ARRAY[]::text[]`)
});

export const order = pgTable('order', {
	id: serial('id').primaryKey(),
	created_at: timestamp('created_at').defaultNow().notNull(),
	status: varchar('status', { length: 255 }).notNull(),
	account_id: integer('account_id')
		.notNull()
		.references(() => accounts.id)
});

export const orderItem = pgTable('order_item', {
	id: serial('id').primaryKey(),
	colors: text('colors')
		.array()
		.default(sql`ARRAY[]::text[]`),
	quantity: integer('quantity').notNull(),
	price: decimal('price').notNull(),
	order_id: integer('order_id')
		.notNull()
		.references(() => order.id),
	product_id: integer('product_id')
		.notNull()
		.references(() => product.id)
});

export const cart = pgTable('cart', {
	id: serial('id').primaryKey(),
	created_at: timestamp('created_at').defaultNow().notNull(),
	account_id: integer('account_id')
		.notNull()
		.references(() => accounts.id),
	product_id: integer('product_id'),
	colors: text('colors')
		.array()
		.default(sql`ARRAY[]::text[]`),
	quantity: integer('quantity'),
	category: categoryEnum('category').notNull(),
});

export const cartItem = pgTable('cart_item', {
	id: serial('id').primaryKey(),
	quantity: integer('quantity').notNull(),
	cart_id: integer('cart_id')
		.notNull()
		.references(() => cart.id),
	product_id: integer('product_id')
		.notNull()
		.references(() => product.id)
});

export const transaction = pgTable('transaction', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	info: text('info'),
	amount: decimal('amount').notNull(),
	discount: decimal('discount').default('0'),
	date: timestamp('date').notNull(),
	order_date: timestamp('order_date').notNull(),
	arrival: timestamp('arrival'),
	account_id: integer('account_id')
		.notNull()
		.references(() => accounts.id),
	order_id: integer('order_id')
		.notNull()
		.unique()
		.references(() => order.id)
});

export const payment = pgTable('payment', {
	id: serial('id').primaryKey(),
	method: varchar('method', { length: 255 }).notNull(),
	status: varchar('status', { length: 255 }).notNull(),
	date: timestamp('date').defaultNow().notNull(),
	amount: decimal('amount').notNull(),
	order_id: integer('order_id')
		.notNull()
		.unique()
		.references(() => order.id)
});

export const shipping = pgTable('shipping', {
	id: serial('id').primaryKey(),
	tracking_number: varchar('tracking_number', { length: 255 }),
	carrier: varchar('carrier', { length: 255 }),
	status: varchar('status', { length: 255 }).notNull(),
	estimated_arrival: timestamp('estimated_arrival'),
	order_id: integer('order_id')
		.notNull()
		.unique()
		.references(() => order.id)
});

export const review = pgTable('review', {
	id: serial('id').primaryKey(),
	rating: integer('rating').notNull(),
	comment: text('comment'),
	created_at: timestamp('created_at').defaultNow().notNull(),
	account_id: integer('account_id')
		.notNull()
		.references(() => accounts.id),
	product_id: integer('product_id')
		.notNull()
		.references(() => product.id)
});

export const inventoryLog = pgTable('inventory_log', {
	id: serial('id').primaryKey(),
	type: varchar('type', { length: 255 }).notNull(),
	quantity_change: integer('quantity_change').notNull(),
	date: timestamp('date').defaultNow().notNull(),
	product_id: integer('product_id')
		.notNull()
		.references(() => product.id)
});

// Relationships
export const accountRelations = relations(accounts, ({ one, many }) => ({
	orders: many(order),
	transactions: many(transaction),
	cart: one(cart),
	reviews: many(review)
}));

export const productRelations = relations(product, ({ many }) => ({
	orderItems: many(orderItem),
	cartItems: many(cartItem),
	reviews: many(review),
	inventoryLogs: many(inventoryLog)
}));

export const orderRelations = relations(order, ({ many, one }) => ({
	items: many(orderItem),
	payments: one(payment),
	shipping: one(shipping),
	transaction: one(transaction),
	account: one(accounts, {
		fields: [order.account_id],
		references: [accounts.id]
	})
}));
