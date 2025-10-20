CREATE TYPE "public"."Department" AS ENUM('production', 'management', 'staff');--> statement-breakpoint
CREATE TYPE "public"."Gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('admin', 'user', 'manager');--> statement-breakpoint
CREATE TABLE "accounts" (
	"account_id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "Role" NOT NULL,
	"provider" text NOT NULL,
	"provider_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "admin" (
	"admin_id" serial PRIMARY KEY NOT NULL,
	"firstname" varchar(255),
	"middlename" varchar(255),
	"lastname" varchar(255),
	"email" varchar(255) NOT NULL,
	"birthday" varchar(255) NOT NULL,
	"gender" "Gender" NOT NULL,
	"password" varchar(255) NOT NULL,
	"department" varchar(255),
	"contacts" varchar(255),
	"address" text NOT NULL,
	"role" "Role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"cart_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"account_id" integer NOT NULL,
	CONSTRAINT "cart_account_id_unique" UNIQUE("account_id")
);
--> statement-breakpoint
CREATE TABLE "cartItem" (
	"cart_item_id" serial PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"cart_id" integer NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(255) NOT NULL,
	"parent_id" integer
);
--> statement-breakpoint
CREATE TABLE "inventoryLog" (
	"log_id" serial PRIMARY KEY NOT NULL,
	"change_type" varchar(255) NOT NULL,
	"quantity_change" integer NOT NULL,
	"log_date" timestamp DEFAULT now() NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order" (
	"order_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(255) NOT NULL,
	"account_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orderItem" (
	"order_item_id" serial PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"payment_method" varchar(255) NOT NULL,
	"payment_status" varchar(255) NOT NULL,
	"payment_date" timestamp DEFAULT now() NOT NULL,
	"amount" numeric NOT NULL,
	"order_id" integer NOT NULL,
	CONSTRAINT "payment_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"product_description" text,
	"product_stock" integer NOT NULL,
	"product_price" numeric NOT NULL,
	"product_category" varchar(255),
	"category_id" integer
);
--> statement-breakpoint
CREATE TABLE "productImage" (
	"image_id" serial PRIMARY KEY NOT NULL,
	"image" "bytea" NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"profile_id" serial PRIMARY KEY NOT NULL,
	"firstname" varchar(255) NOT NULL,
	"middlename" varchar(255),
	"lastname" varchar(255) NOT NULL,
	"contacts" varchar(255) NOT NULL,
	"birthday" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"gender" "Gender" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"account_id" integer NOT NULL,
	CONSTRAINT "profile_account_id_unique" UNIQUE("account_id")
);
--> statement-breakpoint
CREATE TABLE "review" (
	"review_id" serial PRIMARY KEY NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"account_id" integer NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping" (
	"shipping_id" serial PRIMARY KEY NOT NULL,
	"tracking_number" varchar(255),
	"carrier" varchar(255),
	"status" varchar(255) NOT NULL,
	"estimated_arrival" timestamp,
	"order_id" integer NOT NULL,
	CONSTRAINT "shipping_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "Test" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"date" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction" (
	"transaction_id" serial PRIMARY KEY NOT NULL,
	"transaction_name" varchar(255) NOT NULL,
	"transaction_information" text,
	"transaction_amount" numeric NOT NULL,
	"transaction_discount" numeric DEFAULT '0',
	"transaction_date" timestamp NOT NULL,
	"order_date" timestamp NOT NULL,
	"order_arrival" timestamp,
	"account_id" integer NOT NULL,
	"purchase_id" integer NOT NULL,
	CONSTRAINT "transaction_purchase_id_unique" UNIQUE("purchase_id")
);
--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_account_id_accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_cart_id_cart_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("cart_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventoryLog" ADD CONSTRAINT "inventoryLog_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_account_id_accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_order_id_order_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_order_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productImage" ADD CONSTRAINT "productImage_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_account_id_accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_account_id_accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_order_id_order_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_account_id_accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_purchase_id_order_order_id_fk" FOREIGN KEY ("purchase_id") REFERENCES "public"."order"("order_id") ON DELETE no action ON UPDATE no action;