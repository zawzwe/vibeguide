import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const aiGenerations = pgTable(
  "ai_generations",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id").notNull(),
    locale: varchar("locale", { length: 10 }).default("zh").notNull(),
    status: varchar("status", { length: 20 }).default("processing").notNull(),
    creditCharged: boolean("credit_charged").default(false).notNull(),
    documents: jsonb("documents").$type<Record<string, string>>(),
    error: text("error"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("ai_generations_user_id_idx").on(table.userId),
    index("ai_generations_status_updated_at_idx").on(
      table.status,
      table.updatedAt,
    ),
  ],
);
