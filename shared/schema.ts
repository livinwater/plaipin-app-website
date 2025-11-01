import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const companions = pgTable("companions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  mood: text("mood").notNull().default("Happy"),
  energy: integer("energy").notNull().default(85),
  happiness: integer("happiness").notNull().default(92),
  level: integer("level").notNull().default(1),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  color: text("color").notNull(),
});

export const inventory = pgTable("inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companionId: varchar("companion_id").notNull(),
  itemId: varchar("item_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  equipped: integer("equipped").notNull().default(0),
});

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companionId: varchar("companion_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mood: text("mood").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companionId: varchar("companion_id").notNull(),
  conversationWith: text("conversation_with").notNull(),
  senderName: text("sender_name").notNull(),
  text: text("text").notNull(),
  isOwn: integer("is_own").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const searchHistory = pgTable("search_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  answer: text("answer").notNull(),
  documents: text("documents"), // JSON stringified
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCompanionSchema = createInsertSchema(companions).omit({
  id: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  createdAt: true,
});

export type Companion = typeof companions.$inferSelect;
export type InsertCompanion = z.infer<typeof insertCompanionSchema>;

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;

export type InventoryItem = typeof inventory.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventorySchema>;

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type SearchHistory = typeof searchHistory.$inferSelect;
export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
