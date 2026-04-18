import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const origin = sqliteTable(
  "origin",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    nameEn: text("name_en").notNull(),
    continent: text("continent").notNull(),
    countryCode: text("country_code").notNull(),
    flavorTags: text("flavor_tags").notNull().default("[]"),
    altitude: text("altitude").notNull().default(""),
    annualProduction: text("annual_production").notNull().default(""),
    varieties: text("varieties").notNull().default("[]"),
    processingMethods: text("processing_methods").notNull().default("[]"),
    description: text("description").notNull().default(""),
    thumbnailEmoji: text("thumbnail_emoji").notNull().default("🌍"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("origin_continent_idx").on(table.continent)],
);
