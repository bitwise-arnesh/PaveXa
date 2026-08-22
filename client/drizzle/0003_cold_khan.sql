ALTER TABLE "report" ADD COLUMN "traffic_density" real NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ADD COLUMN "road_importance" real NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ADD COLUMN "pedestrian_risk" real NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ADD COLUMN "infrastructure_risk" real NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ADD COLUMN "infrastructure_data" jsonb;