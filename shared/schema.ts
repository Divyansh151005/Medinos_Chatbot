import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Message schema for chat messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  sessionId: text("session_id").notNull(),
  language: text("language").default("en").notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  sender: true,
  sessionId: true,
  language: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Define request and response types for the Gemini API
export const geminiRequestSchema = z.object({
  prompt: z.string(),
  language: z.string().default("en"),
  sessionId: z.string(),
});

export type GeminiRequest = z.infer<typeof geminiRequestSchema>;

export const geminiResponseSchema = z.object({
  content: z.string(),
  language: z.string()
});

export type GeminiResponse = z.infer<typeof geminiResponseSchema>;
