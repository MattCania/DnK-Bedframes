ALTER TABLE "Account" RENAME TO "Accounts";--> statement-breakpoint
ALTER TABLE "Accounts" DROP CONSTRAINT "Account_email_unique";--> statement-breakpoint
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_account_id_Account_account_id_fk";
--> statement-breakpoint
ALTER TABLE "Order" DROP CONSTRAINT "Order_account_id_Account_account_id_fk";
--> statement-breakpoint
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_account_id_Account_account_id_fk";
--> statement-breakpoint
ALTER TABLE "Review" DROP CONSTRAINT "Review_account_id_Account_account_id_fk";
--> statement-breakpoint
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_account_id_Account_account_id_fk";
--> statement-breakpoint
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_account_id_Accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."Accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_account_id_Accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."Accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_account_id_Accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."Accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_account_id_Accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."Accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_account_id_Accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."Accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_email_unique" UNIQUE("email");