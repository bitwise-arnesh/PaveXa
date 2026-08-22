import {
  pgTable,
  text,
  timestamp,
  real,
  doublePrecision,
  index,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const report = pgTable(
  "report",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),

    damageType: text("damage_type").notNull(),
    confidence: real("confidence"),

    riskScore: real("risk_score").notNull(),
    riskLevel: text("risk_level").notNull(),

    infrastructureRisk: real("infrastructure_risk"),
    infrastructureData: text("infrastructure_data"),

    description: text("description"),
    imageUrl: text("image_url"),

    status: text("status")
      .default("UNDER_REVIEW")
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("report_user_id_idx").on(table.userId),
    index("report_status_idx").on(table.status),
    index("report_risk_score_idx").on(table.riskScore),
  ],
);