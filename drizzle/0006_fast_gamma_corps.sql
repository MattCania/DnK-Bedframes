CREATE TYPE "public"."category_enum" AS ENUM('twin', 'full', 'queen', 'king');--> statement-breakpoint
CREATE TYPE "public"."department_enum" AS ENUM('production', 'management', 'staff');--> statement-breakpoint
CREATE TYPE "public"."gender_enum" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."role_enum" AS ENUM('admin', 'user', 'manager');--> statement-breakpoint
CREATE TABLE "cart_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"cart_id" integer NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(255) NOT NULL,
	"quantity_change" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cartItem" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "inventoryLog" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "orderItem" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "productImage" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profile" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Test" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "cartItem" CASCADE;--> statement-breakpoint
DROP TABLE "inventoryLog" CASCADE;--> statement-breakpoint
DROP TABLE "orderItem" CASCADE;--> statement-breakpoint
DROP TABLE "productImage" CASCADE;--> statement-breakpoint
DROP TABLE "profile" CASCADE;--> statement-breakpoint
DROP TABLE "Test" CASCADE;--> statement-breakpoint
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_purchase_id_unique";--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "cart_account_id_accounts_account_id_fk";
--> statement-breakpoint
ALTER TABLE "order" DROP CONSTRAINT "order_account_id_accounts_account_id_fk";
--> statement-breakpoint
ALTER TABLE "payment" DROP CONSTRAINT "payment_order_id_order_order_id_fk";
--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_category_id_category_category_id_fk";
--> statement-breakpoint
ALTER TABLE "review" DROP CONSTRAINT "review_account_id_accounts_account_id_fk";
--> statement-breakpoint
ALTER TABLE "review" DROP CONSTRAINT "review_product_id_product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "shipping" DROP CONSTRAINT "shipping_order_id_order_order_id_fk";
--> statement-breakpoint
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_account_id_accounts_account_id_fk";
--> statement-breakpoint
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_purchase_id_order_order_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "role" SET DATA TYPE "public"."role_enum" USING "role"::text::"public"."role_enum";--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" ALTER COLUMN "gender" SET DATA TYPE "public"."gender_enum" USING "gender"::text::"public"."gender_enum";--> statement-breakpoint
ALTER TABLE "admin" ALTER COLUMN "department" SET DATA TYPE "public"."department_enum" USING "department"::"public"."department_enum";--> statement-breakpoint
ALTER TABLE "admin" ALTER COLUMN "role" SET DATA TYPE "public"."role_enum" USING "role"::text::"public"."role_enum";--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "password" varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "firstname" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "middlename" varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "lastname" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "contacts" varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "birthday" varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "gender" "gender_enum";--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "method" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "status" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "date" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "price" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "stock" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "image" "bytea";--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "category" "category_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "colors" text[] DEFAULT ARRAY[]::text[];--> statement-breakpoint
ALTER TABLE "review" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "shipping" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "info" text;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "amount" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "discount" numeric DEFAULT '0';--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "arrival" timestamp;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "order_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_log" ADD CONSTRAINT "inventory_log_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "account_id";--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "admin_id";--> statement-breakpoint
ALTER TABLE "cart" DROP COLUMN "cart_id";--> statement-breakpoint
ALTER TABLE "category" DROP COLUMN "category_id";--> statement-breakpoint
ALTER TABLE "category" DROP COLUMN "category_name";--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "order_id";--> statement-breakpoint
ALTER TABLE "payment" DROP COLUMN "payment_id";--> statement-breakpoint
ALTER TABLE "payment" DROP COLUMN "payment_method";--> statement-breakpoint
ALTER TABLE "payment" DROP COLUMN "payment_status";--> statement-breakpoint
ALTER TABLE "payment" DROP COLUMN "payment_date";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "product_id";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "product_name";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "product_description";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "product_stock";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "product_price";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "product_category";--> statement-breakpoint
ALTER TABLE "review" DROP COLUMN "review_id";--> statement-breakpoint
ALTER TABLE "shipping" DROP COLUMN "shipping_id";--> statement-breakpoint
ALTER TABLE "transaction" DROP COLUMN "transaction_id";--> statement-breakpoint
ALTER TABLE "transaction" DROP COLUMN "transaction_name";--> statement-breakpoint
ALTER TABLE "transaction" DROP COLUMN "transaction_information";--> statement-breakpoint
ALTER TABLE "transaction" DROP COLUMN "transaction_amount";--> statement-breakpoint
ALTER TABLE "transaction" DROP COLUMN "transaction_discount";--> statement-breakpoint
ALTER TABLE "transaction" DROP COLUMN "transaction_date";--> statement-breakpoint
ALTER TABLE "transaction" DROP COLUMN "order_arrival";--> statement-breakpoint
ALTER TABLE "transaction" DROP COLUMN "purchase_id";--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_order_id_unique" UNIQUE("order_id");--> statement-breakpoint
DROP TYPE "public"."Department";--> statement-breakpoint
DROP TYPE "public"."Gender";--> statement-breakpoint
DROP TYPE "public"."Role";