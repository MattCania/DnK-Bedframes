ALTER TABLE "accounts" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "contacts" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "birthday" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "gender" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "password" varchar(255);