import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email"),
  phone: text("phone"),
  password: text("password").notNull(),
  fullName: text("full_name"),
  language: text("language").default('en'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Voice queries table - stores all voice interactions
export const voiceQueries = pgTable("voice_queries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  audioUrl: text("audio_url"),
  transcript: text("transcript").notNull(),
  response: text("response").notNull(),
  responseAudioUrl: text("response_audio_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat conversations
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  mode: text("mode").notNull(), // "voice" or "text"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Chat messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // "user" or "assistant"
  content: text("content").notNull(),
  audioUrl: text("audio_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Eligibility checks
export const eligibilityChecks = pgTable("eligibility_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  schemeName: text("scheme_name").notNull(),
  schemeCategory: text("scheme_category").notNull(),
  userDetails: jsonb("user_details").notNull(), // age, income, occupation, state, etc.
  eligible: boolean("eligible").notNull(),
  eligibilityReason: text("eligibility_reason").notNull(),
  requiredDocuments: jsonb("required_documents").notNull(), // array of document names
  nextSteps: jsonb("next_steps").notNull(), // array of step descriptions
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Documents
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  extractedText: text("extracted_text"),
  summary: text("summary"),
  translation: text("translation"),
  language: text("language"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Service searches
export const serviceSearches = pgTable("service_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  serviceType: text("service_type").notNull(), // "hospital", "police", "post_office", etc.
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  results: jsonb("results").notNull(), // array of nearby services
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Drafts
export const drafts = pgTable("drafts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  draftType: text("draft_type").notNull(), // "application", "letter", "complaint", etc.
  content: text("content").notNull(),
  purpose: text("purpose"),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Market data searches
export const marketSearches = pgTable("market_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  commodity: text("commodity").notNull(),
  state: text("state"),
  district: text("district"),
  market: text("market"),
  results: jsonb("results").notNull(), // price data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  voiceQueries: many(voiceQueries),
  conversations: many(conversations),
  eligibilityChecks: many(eligibilityChecks),
  documents: many(documents),
  serviceSearches: many(serviceSearches),
  drafts: many(drafts),
  marketSearches: many(marketSearches),
}));

export const voiceQueriesRelations = relations(voiceQueries, ({ one }) => ({
  user: one(users, {
    fields: [voiceQueries.userId],
    references: [users.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const eligibilityChecksRelations = relations(eligibilityChecks, ({ one }) => ({
  user: one(users, {
    fields: [eligibilityChecks.userId],
    references: [users.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));

export const serviceSearchesRelations = relations(serviceSearches, ({ one }) => ({
  user: one(users, {
    fields: [serviceSearches.userId],
    references: [users.id],
  }),
}));

export const draftsRelations = relations(drafts, ({ one }) => ({
  user: one(users, {
    fields: [drafts.userId],
    references: [users.id],
  }),
}));

export const marketSearchesRelations = relations(marketSearches, ({ one }) => ({
  user: one(users, {
    fields: [marketSearches.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertVoiceQuerySchema = createInsertSchema(voiceQueries).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertEligibilityCheckSchema = createInsertSchema(eligibilityChecks).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSearchSchema = createInsertSchema(serviceSearches).omit({
  id: true,
  createdAt: true,
});

export const insertDraftSchema = createInsertSchema(drafts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketSearchSchema = createInsertSchema(marketSearches).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVoiceQuery = z.infer<typeof insertVoiceQuerySchema>;
export type VoiceQuery = typeof voiceQueries.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertEligibilityCheck = z.infer<typeof insertEligibilityCheckSchema>;
export type EligibilityCheck = typeof eligibilityChecks.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertServiceSearch = z.infer<typeof insertServiceSearchSchema>;
export type ServiceSearch = typeof serviceSearches.$inferSelect;

export type InsertDraft = z.infer<typeof insertDraftSchema>;
export type Draft = typeof drafts.$inferSelect;

export type InsertMarketSearch = z.infer<typeof insertMarketSearchSchema>;
export type MarketSearch = typeof marketSearches.$inferSelect;
