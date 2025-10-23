import {
  pgTable, serial, varchar, text, integer,
  timestamp, decimal, pgEnum,
  customType, 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const genderEnum = pgEnum("Gender", ["male", "female"]);
export const roleEnum = pgEnum("Role", ["admin", "user", "manager"]);
export const departmentEnum = pgEnum("Department", ["production", "management", "staff"]);

export const test = pgTable("Test", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  date: varchar("date", { length: 255 }).notNull(),
});

export const accounts = pgTable("accounts", {
  account_id: serial("account_id").primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", {length: 255}),
  role: roleEnum("role").notNull(),
  provider: text("provider").notNull(),
  provider_id: text("provider_id").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const profile = pgTable("profile", {
  profile_id: serial("profile_id").primaryKey(),
  firstname: varchar("firstname", { length: 255 }).notNull(),
  middlename: varchar("middlename", { length: 255 }),
  lastname: varchar("lastname", { length: 255 }).notNull(),
  contacts: varchar("contacts", { length: 255 }),
  birthday: varchar("birthday", { length: 255 }),
  address: text("address"),
  gender: genderEnum("gender"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
  account_id: integer("account_id").notNull().unique().references(() => accounts.account_id),
});

export const admin = pgTable("admin", {
  admin_id: serial("admin_id").primaryKey(),
  firstname: varchar("firstname", { length: 255 }),
  middlename: varchar("middlename", { length: 255 }),
  lastname: varchar("lastname", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  birthday: varchar("birthday", { length: 255 }).notNull(),
  gender: genderEnum("gender").notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }),
  contacts: varchar("contacts", { length: 255 }),
  address: text("address").notNull(),
  role: roleEnum("role").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const category = pgTable("category", {
  category_id: serial("category_id").primaryKey(),
  category_name: varchar("category_name", { length: 255 }).notNull(),
  parent_id: integer("parent_id"),
});

export const product = pgTable("product", {
  product_id: serial("product_id").primaryKey(),
  product_name: varchar("product_name", { length: 255 }).notNull(),
  product_description: text("product_description"),
  product_stock: integer("product_stock").notNull(),
  product_price: decimal("product_price").notNull(),
  product_category: varchar("product_category", { length: 255 }),
  category_id: integer("category_id").references(() => category.category_id),
});

export const productImage = pgTable("productImage", {
  image_id: serial("image_id").primaryKey(),
  image: bytea("image").notNull(),
  product_id: integer("product_id").notNull().references(() => product.product_id),
});

export const order = pgTable("order", {
  order_id: serial("order_id").primaryKey(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  account_id: integer("account_id").notNull().references(() => accounts.account_id),
});

export const orderItem = pgTable("orderItem", {
  order_item_id: serial("order_item_id").primaryKey(),
  quantity: integer("quantity").notNull(),
  price: decimal("price").notNull(),
  order_id: integer("order_id").notNull().references(() => order.order_id),
  product_id: integer("product_id").notNull().references(() => product.product_id),
});

export const cart = pgTable("cart", {
  cart_id: serial("cart_id").primaryKey(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  account_id: integer("account_id").notNull().unique().references(() => accounts.account_id),
});

export const cartItem = pgTable("cartItem", {
  cart_item_id: serial("cart_item_id").primaryKey(),
  quantity: integer("quantity").notNull(),
  cart_id: integer("cart_id").notNull().references(() => cart.cart_id),
  product_id: integer("product_id").notNull().references(() => product.product_id),
});

export const transaction = pgTable("transaction", {
  transaction_id: serial("transaction_id").primaryKey(),
  transaction_name: varchar("transaction_name", { length: 255 }).notNull(),
  transaction_information: text("transaction_information"),
  transaction_amount: decimal("transaction_amount").notNull(),
  transaction_discount: decimal("transaction_discount").default("0"),
  transaction_date: timestamp("transaction_date").notNull(),
  order_date: timestamp("order_date").notNull(),
  order_arrival: timestamp("order_arrival"),
  account_id: integer("account_id").notNull().references(() => accounts.account_id),
  purchase_id: integer("purchase_id").notNull().unique().references(() => order.order_id),
});

export const payment = pgTable("payment", {
  payment_id: serial("payment_id").primaryKey(),
  payment_method: varchar("payment_method", { length: 255 }).notNull(),
  payment_status: varchar("payment_status", { length: 255 }).notNull(),
  payment_date: timestamp("payment_date").defaultNow().notNull(),
  amount: decimal("amount").notNull(),
  order_id: integer("order_id").notNull().unique().references(() => order.order_id),
});

export const shipping = pgTable("shipping", {
  shipping_id: serial("shipping_id").primaryKey(),
  tracking_number: varchar("tracking_number", { length: 255 }),
  carrier: varchar("carrier", { length: 255 }),
  status: varchar("status", { length: 255 }).notNull(),
  estimated_arrival: timestamp("estimated_arrival"),
  order_id: integer("order_id").notNull().unique().references(() => order.order_id),
});

export const review = pgTable("review", {
  review_id: serial("review_id").primaryKey(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  account_id: integer("account_id").notNull().references(() => accounts.account_id),
  product_id: integer("product_id").notNull().references(() => product.product_id),
});

export const inventoryLog = pgTable("inventoryLog", {
  log_id: serial("log_id").primaryKey(),
  change_type: varchar("change_type", { length: 255 }).notNull(),
  quantity_change: integer("quantity_change").notNull(),
  log_date: timestamp("log_date").defaultNow().notNull(),
  product_id: integer("product_id").notNull().references(() => product.product_id),
});

export const accountRelations = relations(accounts, ({ one, many }) => ({
  profile: one(profile),
  orders: many(order),
  transactions: many(transaction),
  cart: one(cart),
  reviews: many(review),
}));

export const productRelations = relations(product, ({ many }) => ({
  images: many(productImage),
  orderItems: many(orderItem),
  cartItems: many(cartItem),
  reviews: many(review),
  inventoryLogs: many(inventoryLog),
}));
