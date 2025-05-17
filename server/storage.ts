import { messages, type Message, type InsertMessage, User, InsertUser, users, chatSessions, ChatSession, InsertChatSession } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat session methods
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSessions(): Promise<ChatSession[]>;
  getChatSessionById(sessionId: string): Promise<ChatSession | undefined>;
  updateChatSessionTitle(sessionId: string, title: string): Promise<ChatSession | undefined>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBySessionId(sessionId: string): Promise<Message[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const [chatSession] = await db
      .insert(chatSessions)
      .values(session)
      .returning();
    return chatSession;
  }

  async getChatSessions(): Promise<ChatSession[]> {
    return await db
      .select()
      .from(chatSessions)
      .orderBy(desc(chatSessions.updatedAt));
  }

  async getChatSessionById(sessionId: string): Promise<ChatSession | undefined> {
    const [chatSession] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.sessionId, sessionId));
    
    return chatSession;
  }

  async updateChatSessionTitle(sessionId: string, title: string): Promise<ChatSession | undefined> {
    const [chatSession] = await db
      .update(chatSessions)
      .set({ 
        title, 
        updatedAt: new Date() 
      })
      .where(eq(chatSessions.sessionId, sessionId))
      .returning();
    
    return chatSession;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    // Update the chat session's updatedAt timestamp
    await db
      .update(chatSessions)
      .set({ updatedAt: new Date() })
      .where(eq(chatSessions.sessionId, insertMessage.sessionId));
    
    // Create the message
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    
    return message;
  }

  async getMessagesBySessionId(sessionId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(messages.timestamp);
  }
}

export const storage = new DatabaseStorage();
