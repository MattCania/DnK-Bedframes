ALTER TABLE "Accounts" RENAME TO "accounts";--> statement-breakpoint
ALTER TABLE "Admin" RENAME TO "admin";--> statement-breakpoint
ALTER TABLE "Cart" RENAME TO "cart";--> statement-breakpoint
ALTER TABLE "CartItem" RENAME TO "cartItem";--> statement-breakpoint
ALTER TABLE "Category" RENAME TO "category";--> statement-breakpoint
ALTER TABLE "InventoryLog" RENAME TO "inventoryLog";--> statement-breakpoint
ALTER TABLE "Order" RENAME TO "order";--> statement-breakpoint
ALTER TABLE "OrderItem" RENAME TO "orderItem";--> statement-breakpoint
ALTER TABLE "Payment" RENAME TO "payment";--> statement-breakpoint
ALTER TABLE "Product" RENAME TO "product";--> statement-breakpoint
ALTER TABLE "ProductImage" RENAME TO "productImage";--> statement-breakpoint
ALTER TABLE "Profile" RENAME TO "profile";--> statement-breakpoint
ALTER TABLE "Review" RENAME TO "review";--> statement-breakpoint
ALTER TABLE "Shipping" RENAME TO "shipping";--> statement-breakpoint
ALTER TABLE "Transaction" RENAME TO "transaction";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "Accounts_email_unique";--> statement-breakpoint
ALTER TABLE "admin" DROP CONSTRAINT "Admin_email_unique";--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "Cart_account_id_unique";--> statement-breakpoint
ALTER TABLE "payment" DROP CONSTRAINT "Payment_order_id_unique";--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "Profile_account_id_unique";--> statement-breakpoint
ALTER TABLE "shipping" DROP CONSTRAINT "Shipping_order_id_unique";--> statement-breakpoint
ALTER TABLE "transaction" DROP CONSTRAINT "Transaction_purchase_id_unique";--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "Cart_account_id_Accounts_account_id_fk";
--> statement-breakpoint
ALTER TABLE "cartItem" DROP CONSTRAINT "CartItem_cart_id_Cart_cart_id_fk";
--> statement-breakpoint
ALTER TABLE "cartItem" DROP CONSTRAINT "CartItem_product_id_Product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "inventoryLog" DROP CONSTRAINT "InventoryLog_product_id_Product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "order" DROP CONSTRAINT "Order_account_id_Accounts_account_id_fk";
--> statement-breakpoint
ALTER TABLE "orderItem" DROP CONSTRAINT "OrderItem_order_id_Order_order_id_fk";
--> statement-breakpoint
ALTER TABLE "orderItem" DROP CONSTRAINT "OrderItem_product_id_Product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "payment" DROP CONSTRAINT "Payment_order_id_Order_order_id_fk";
--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "Product_category_id_Category_category_id_fk";
--> statement-breakpoint
ALTER TABLE "productImage" DROP CONSTRAINT "ProductImage_product_id_Product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "Profile_account_id_Accounts_account_id_fk";
--> statement-breakpoint
ALTER TABLE "review" DROP CONSTRAINT "Review_account_id_Accounts_account_id_fk";
--> statement-breakpoint
ALTER TABLE "review" DROP CONSTRAINT "Review_product_id_Product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "shipping" DROP CONSTRAINT "Shipping_order_id_Order_order_id_fk";
--> statement-breakpoint
ALTER TABLE "transaction" DROP CONSTRAINT "Transaction_account_id_Accounts_account_id_fk";
--> statement-breakpoint
ALTER TABLE "transaction" DROP CONSTRAINT "Transaction_purchase_id_Order_order_id_fk";
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
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_purchase_id_order_order_id_fk" FOREIGN KEY ("purchase_id") REFERENCES "public"."order"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "admin" ADD CONSTRAINT "admin_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_account_id_unique" UNIQUE("account_id");--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_unique" UNIQUE("order_id");--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_account_id_unique" UNIQUE("account_id");--> statement-breakpoint
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_order_id_unique" UNIQUE("order_id");--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_purchase_id_unique" UNIQUE("purchase_id");