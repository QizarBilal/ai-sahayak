import {
  users,
  voiceQueries,
  conversations,
  messages,
  eligibilityChecks,
  documents,
  serviceSearches,
  drafts,
  marketSearches,
  type User,
  type InsertUser,
  type VoiceQuery,
  type InsertVoiceQuery,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type EligibilityCheck,
  type InsertEligibilityCheck,
  type Document,
  type InsertDocument,
  type ServiceSearch,
  type InsertServiceSearch,
  type Draft,
  type InsertDraft,
  type MarketSearch,
  type InsertMarketSearch,
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc } from "drizzle-orm";
import { InMemoryStorage } from "./in-memory-storage";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Voice Queries
  getVoiceQueries(userId: string): Promise<VoiceQuery[]>;
  createVoiceQuery(query: InsertVoiceQuery): Promise<VoiceQuery>;

  // Conversations
  getConversations(userId: string): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  
  // Messages
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Eligibility Checks
  getEligibilityChecks(userId: string): Promise<EligibilityCheck[]>;
  createEligibilityCheck(check: InsertEligibilityCheck): Promise<EligibilityCheck>;

  // Documents
  getDocuments(userId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;

  // Service Searches
  createServiceSearch(search: InsertServiceSearch): Promise<ServiceSearch>;

  // Drafts
  getDrafts(userId: string): Promise<Draft[]>;
  createDraft(draft: InsertDraft): Promise<Draft>;
  updateDraft(id: string, content: string): Promise<Draft>;

  // Market Searches
  getMarketSearches(userId: string): Promise<MarketSearch[]>;
  createMarketSearch(search: InsertMarketSearch): Promise<MarketSearch>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Voice Queries
  async getVoiceQueries(userId: string): Promise<VoiceQuery[]> {
    return db.select().from(voiceQueries)
      .where(eq(voiceQueries.userId, userId))
      .orderBy(desc(voiceQueries.createdAt));
  }

  async createVoiceQuery(query: InsertVoiceQuery): Promise<VoiceQuery> {
    const [voiceQuery] = await db.insert(voiceQueries).values(query).returning();
    return voiceQuery;
  }

  // Conversations
  async getConversations(userId: string): Promise<Conversation[]> {
    return db.select().from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [conv] = await db.insert(conversations).values(conversation).returning();
    return conv;
  }

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    return db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [msg] = await db.insert(messages).values(message).returning();
    return msg;
  }

  // Eligibility Checks
  async getEligibilityChecks(userId: string): Promise<EligibilityCheck[]> {
    return db.select().from(eligibilityChecks)
      .where(eq(eligibilityChecks.userId, userId))
      .orderBy(desc(eligibilityChecks.createdAt));
  }

  async createEligibilityCheck(check: InsertEligibilityCheck): Promise<EligibilityCheck> {
    const [eligCheck] = await db.insert(eligibilityChecks).values(check).returning();
    return eligCheck;
  }

  // Documents
  async getDocuments(userId: string): Promise<Document[]> {
    return db.select().from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.createdAt));
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [doc] = await db.insert(documents).values(document).returning();
    return doc;
  }

  // Service Searches
  async createServiceSearch(search: InsertServiceSearch): Promise<ServiceSearch> {
    const [serviceSearch] = await db.insert(serviceSearches).values(search).returning();
    return serviceSearch;
  }

  // Drafts
  async getDrafts(userId: string): Promise<Draft[]> {
    return db.select().from(drafts)
      .where(eq(drafts.userId, userId))
      .orderBy(desc(drafts.updatedAt));
  }

  async createDraft(draft: InsertDraft): Promise<Draft> {
    const [newDraft] = await db.insert(drafts).values(draft).returning();
    return newDraft;
  }

  async updateDraft(id: string, content: string): Promise<Draft> {
    const [updated] = await db.update(drafts)
      .set({ content, updatedAt: new Date() })
      .where(eq(drafts.id, id))
      .returning();
    return updated;
  }

  // Market Searches
  async getMarketSearches(userId: string): Promise<MarketSearch[]> {
    return db.select().from(marketSearches)
      .where(eq(marketSearches.userId, userId))
      .orderBy(desc(marketSearches.createdAt));
  }

  async createMarketSearch(search: InsertMarketSearch): Promise<MarketSearch> {
    const [marketSearch] = await db.insert(marketSearches).values(search).returning();
    return marketSearch;
  }
}

// Export the appropriate storage implementation based on database availability
export const storage: IStorage = pool 
  ? new DatabaseStorage() 
  : new InMemoryStorage();
