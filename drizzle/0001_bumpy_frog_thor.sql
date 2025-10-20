ALTER TABLE "Account" RENAME COLUMN "password" TO "provider";--> statement-breakpoint
ALTER TABLE "Account" ADD COLUMN "provider_id" text NOT NULL;