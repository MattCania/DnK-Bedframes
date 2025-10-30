ALTER TABLE "cart" DROP CONSTRAINT "cart_account_id_unique";--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_category_id_category_id_fk";
--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "product_id" integer;--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "colors" text[] DEFAULT ARRAY[]::text[];--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "quantity" integer;--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "category" "category_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "order_item" ADD COLUMN "colors" text[] DEFAULT ARRAY[]::text[];--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "category_id";