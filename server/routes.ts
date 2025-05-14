import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { geminiRequestSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

// Simple Gemini API mock for the medical assistant
async function queryGeminiAPI(prompt: string, language: string): Promise<string> {
  // In a real implementation, this would use the Google Generative AI SDK
  // to send the prompt to the Gemini API
  
  // Add medical context to the prompt
  const medicalPrompt = `You are Dr. MediChat, an experienced physician with expertise in diagnosing and treating various medical conditions.
  
  INSTRUCTIONS:
  1. Keep answers concise and direct (under 5 sentences when possible).
  2. If the user describes symptoms, act as a symptom checker by:
     - Asking targeted follow-up questions about other symptoms
     - Suggesting possible conditions based on symptoms described
     - Recommending appropriate medications or treatments
  3. Focus on being helpful with practical medical advice.
  4. Always include one of these disclaimers at the end of your response:
     - "Remember, I am an AI and cannot replace the expertise of a medical professional. This information is for general knowledge and does not constitute medical advice. Please seek professional medical help right away."
     - "I cannot diagnose your condition. I am an AI and cannot provide medical advice or treatment. It's crucial that you seek in-person medical attention from a doctor or other qualified healthcare professional as soon as possible."
  
  Respond in the following language: ${language}. Query: ${prompt}`;
  
  try {
    const apiKey = process.env.GEMINI_API_KEY || 'fake_key';
    
    // API call to Gemini
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: medicalPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const responseData = await response.json();
    
    if (responseData.candidates && responseData.candidates[0]?.content?.parts?.length > 0) {
      return responseData.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error querying Gemini API:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to get response from Gemini API: ${error.message}`);
    }
    throw new Error("Unknown error occurred while querying Gemini API");
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get conversation history
  app.get("/api/messages/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const messages = await storage.getMessagesBySessionId(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // API route to send a message to the Gemini API
  app.post("/api/chat", async (req, res) => {
    try {
      // Validate the request
      const validatedData = geminiRequestSchema.parse(req.body);
      const { prompt, language, sessionId } = validatedData;

      // Store user message
      const userMessage = await storage.createMessage({
        content: prompt,
        sender: "user",
        sessionId,
        language
      });

      // Send prompt to Gemini API
      const response = await queryGeminiAPI(prompt, language);

      // Store assistant response
      const assistantMessage = await storage.createMessage({
        content: response,
        sender: "assistant",
        sessionId,
        language
      });

      // Return both messages
      res.json({
        userMessage,
        assistantMessage
      });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", details: error.message });
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "An unknown error occurred" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
