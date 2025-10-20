CREATE TYPE "public"."Department" AS ENUM('production', 'management', 'staff');--> statement-breakpoint
CREATE TYPE "public"."Gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('admin', 'user', 'manager');--> statement-breakpoint
CREATE TABLE "Account" (
	"account_id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "Role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "Account_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Admin" (
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
	CONSTRAINT "Admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Cart" (
	"cart_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"account_id" integer NOT NULL,
	CONSTRAINT "Cart_account_id_unique" UNIQUE("account_id")
);
--> statement-breakpoint
CREATE TABLE "CartItem" (
	"cart_item_id" serial PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"cart_id" integer NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(255) NOT NULL,
	"parent_id" integer
);
--> statement-breakpoint
CREATE TABLE "InventoryLog" (
	"log_id" serial PRIMARY KEY NOT NULL,
	"change_type" varchar(255) NOT NULL,
	"quantity_change" integer NOT NULL,
	"log_date" timestamp DEFAULT now() NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Order" (
	"order_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(255) NOT NULL,
	"account_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "OrderItem" (
	"order_item_id" serial PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Payment" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"payment_method" varchar(255) NOT NULL,
	"payment_status" varchar(255) NOT NULL,
	"payment_date" timestamp DEFAULT now() NOT NULL,
	"amount" numeric NOT NULL,
	"order_id" integer NOT NULL,
	CONSTRAINT "Payment_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "Product" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"product_description" text,
	"product_stock" integer NOT NULL,
	"product_price" numeric NOT NULL,
	"product_category" varchar(255),
	"category_id" integer
);
--> statement-breakpoint
CREATE TABLE "ProductImage" (
	"image_id" serial PRIMARY KEY NOT NULL,
	"image" "bytea" NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Profile" (
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
	CONSTRAINT "Profile_account_id_unique" UNIQUE("account_id")
);
--> statement-breakpoint
CREATE TABLE "Review" (
	"review_id" serial PRIMARY KEY NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"account_id" integer NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Shipping" (
	"shipping_id" serial PRIMARY KEY NOT NULL,
	"tracking_number" varchar(255),
	"carrier" varchar(255),
	"status" varchar(255) NOT NULL,
	"estimated_arrival" timestamp,
	"order_id" integer NOT NULL,
	CONSTRAINT "Shipping_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "Test" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"date" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Transaction" (
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
	CONSTRAINT "Transaction_purchase_id_unique" UNIQUE("purchase_id")
);
--> statement-breakpoint
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_account_id_Account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."Account"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_id_Cart_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."Cart"("cart_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_product_id_Product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_product_id_Product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_account_id_Account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."Account"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_Order_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."Order"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_Product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_Order_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."Order"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_Category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_product_id_Product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_account_id_Account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."Account"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_account_id_Account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."Account"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_product_id_Product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_order_id_Order_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."Order"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_account_id_Account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."Account"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_purchase_id_Order_order_id_fk" FOREIGN KEY ("purchase_id") REFERENCES "public"."Order"("order_id") ON DELETE no action ON UPDATE no action;