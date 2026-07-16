import { pgTable, uuid, varchar, numeric, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  outTradeNo: varchar("out_trade_no", { length: 64 }).notNull().unique(),
  zpayTradeNo: varchar("zpay_trade_no", { length: 64 }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  creditsAmount: integer("credits_amount").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  rawNotify: jsonb("raw_notify"),
  provider: varchar("provider", { length: 20 }).default("zpay").notNull(),
  checkoutId: varchar("checkout_id", { length: 128 }),
  currency: varchar("currency", { length: 3 }).default("CNY").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
