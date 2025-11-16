/**
 * In-Memory Storage Implementation
 * Used when DATABASE_URL is not available for demo/testing
 */

import type {
  User, InsertUser, VoiceQuery, InsertVoiceQuery,
  Conversation, InsertConversation, Message, InsertMessage,
  EligibilityCheck, InsertEligibilityCheck, Document, InsertDocument,
  ServiceSearch, InsertServiceSearch, Draft, InsertDraft,
  MarketSearch, InsertMarketSearch
} from "@shared/schema";

export class InMemoryStorage {
  private users: Map<string, User> = new Map();
  private voiceQueries: VoiceQuery[] = [];
  private conversations: Conversation[] = [];
  private messages: Message[] = [];
  private eligibilityChecks: EligibilityCheck[] = [];
  private documents: Document[] = [];
  private serviceSearches: ServiceSearch[] = [];
  private drafts: Draft[] = [];
  private marketSearches: MarketSearch[] = [];

  private generateId(): string {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.generateId(),
      username: insertUser.username,
      email: insertUser.email || null,
      phone: insertUser.phone || null,
      password: insertUser.password,
      fullName: insertUser.fullName || null,
      language: insertUser.language || null,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserLanguage(userId: string, language: string): Promise<User> {
    let user = this.users.get(userId);
    if (!user) {
      // Create mock user if it doesn't exist (for development)
      if (userId === 'mock-user-id') {
        user = await this.createUser({
          username: 'demo',
          password: 'demo',
          email: null,
          phone: null,
          fullName: 'Proud Indian',
          language: language,
        });
      } else {
        throw new Error('User not found');
      }
    } else {
      user.language = language;
      this.users.set(userId, user);
    }
    return user;
  }

  // Voice Queries
  async getVoiceQueries(userId: string): Promise<VoiceQuery[]> {
    return this.voiceQueries
      .filter(q => q.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createVoiceQuery(query: InsertVoiceQuery): Promise<VoiceQuery> {
    const voiceQuery: VoiceQuery = {
      id: this.generateId(),
      userId: query.userId,
      audioUrl: query.audioUrl || null,
      transcript: query.transcript,
      response: query.response,
      responseAudioUrl: query.responseAudioUrl || null,
      createdAt: new Date(),
    };
    this.voiceQueries.push(voiceQuery);
    return voiceQuery;
  }

  // Conversations
  async getConversations(userId: string): Promise<Conversation[]> {
    return this.conversations
      .filter(c => c.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const conv: Conversation = {
      id: this.generateId(),
      ...conversation,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.push(conv);
    return conv;
  }

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const msg: Message = {
      id: this.generateId(),
      conversationId: message.conversationId,
      role: message.role,
      content: message.content,
      audioUrl: message.audioUrl || null,
      createdAt: new Date(),
    };
    this.messages.push(msg);
    return msg;
  }

  // Eligibility Checks
  async getEligibilityChecks(userId: string): Promise<EligibilityCheck[]> {
    return this.eligibilityChecks
      .filter(c => c.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createEligibilityCheck(check: InsertEligibilityCheck): Promise<EligibilityCheck> {
    const eligCheck: EligibilityCheck = {
      id: this.generateId(),
      ...check,
      createdAt: new Date(),
    };
    this.eligibilityChecks.push(eligCheck);
    return eligCheck;
  }

  // Documents
  async getDocuments(userId: string): Promise<Document[]> {
    return this.documents
      .filter(d => d.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const doc: Document = {
      id: this.generateId(),
      userId: document.userId,
      fileName: document.fileName,
      fileUrl: document.fileUrl,
      fileType: document.fileType,
      extractedText: document.extractedText || null,
      summary: document.summary || null,
      translation: document.translation || null,
      language: document.language || null,
      createdAt: new Date(),
    };
    this.documents.push(doc);
    return doc;
  }

  // Service Searches
  async createServiceSearch(search: InsertServiceSearch): Promise<ServiceSearch> {
    const serviceSearch: ServiceSearch = {
      id: this.generateId(),
      userId: search.userId,
      serviceType: search.serviceType,
      location: search.location,
      latitude: search.latitude || null,
      longitude: search.longitude || null,
      results: search.results,
      createdAt: new Date(),
    };
    this.serviceSearches.push(serviceSearch);
    return serviceSearch;
  }

  // Drafts
  async getDrafts(userId: string): Promise<Draft[]> {
    return this.drafts
      .filter(d => d.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async createDraft(draft: InsertDraft): Promise<Draft> {
    const newDraft: Draft = {
      id: this.generateId(),
      userId: draft.userId,
      title: draft.title,
      content: draft.content,
      draftType: draft.draftType,
      purpose: draft.purpose || null,
      version: draft.version || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.drafts.push(newDraft);
    return newDraft;
  }

  async updateDraft(id: string, content: string): Promise<Draft> {
    const draft = this.drafts.find(d => d.id === id);
    if (!draft) {
      throw new Error('Draft not found');
    }
    draft.content = content;
    draft.updatedAt = new Date();
    return draft;
  }

  // Market Searches
  async getMarketSearches(userId: string): Promise<MarketSearch[]> {
    return this.marketSearches
      .filter(m => m.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createMarketSearch(search: InsertMarketSearch): Promise<MarketSearch> {
    const marketSearch: MarketSearch = {
      id: this.generateId(),
      userId: search.userId,
      commodity: search.commodity,
      state: search.state || null,
      district: search.district || null,
      market: search.market || null,
      results: search.results,
      createdAt: new Date(),
    };
    this.marketSearches.push(marketSearch);
    return marketSearch;
  }
}
