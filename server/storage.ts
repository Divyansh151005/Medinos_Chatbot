import { messages, type Message, type InsertMessage, User, InsertUser, users } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBySessionId(sessionId: string): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private userCurrentId: number;
  private messageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.userCurrentId = 1;
    this.messageCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const timestamp = new Date();
    const message: Message = { ...insertMessage, id, timestamp };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesBySessionId(sessionId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

export const storage = new MemStorage();
