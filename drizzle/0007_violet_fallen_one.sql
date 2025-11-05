CREATE TYPE "public"."status_enum" AS ENUM('pending', 'cancelled', 'completed', 'delivery');--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "cart_account_id_unique";--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_category_id_category_id_fk";
--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "status" SET DATA TYPE "public"."status_enum" USING "status"::"public"."status_enum";--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "product_id" integer;--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "colors" text[] DEFAULT ARRAY[]::text[];--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "quantity" integer;--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "category" "category_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shipping_fee" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "distance_km" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "total_amount" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "product_ids" integer[] NOT NULL;--> statement-breakpoint
ALTER TABLE "order_item" ADD COLUMN "colors" text[] DEFAULT ARRAY[]::text[];--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "category_id";