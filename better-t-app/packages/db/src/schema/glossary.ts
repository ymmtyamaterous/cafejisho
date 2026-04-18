import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const glossaryTerm = sqliteTable(
  "glossary_term",
  {
    id: text("id").primaryKey(),
    term: text("term").notNull(),
    reading: text("reading").notNull().default(""),
    termEn: text("term_en").notNull().default(""),
    category: text("category", {
      enum: ["bean", "roast", "brew", "origin", "taste", "equipment", "certification"],
    }).notNull(),
    shortDescription: text("short_description").notNull(),
    description: text("description").notNull().default(""),
    relatedTermIds: text("related_term_ids").notNull().default("[]"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("glossary_term_category_idx").on(table.category)],
);
