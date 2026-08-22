ALTER TABLE "report" ALTER COLUMN "infrastructure_risk" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "infrastructure_data" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "report" DROP COLUMN "traffic_density";--> statement-breakpoint
ALTER TABLE "report" DROP COLUMN "road_importance";--> statement-breakpoint
ALTER TABLE "report" DROP COLUMN "pedestrian_risk";