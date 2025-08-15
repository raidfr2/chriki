import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoogleGenAI } from "@google/genai";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Test Gemini API key
  app.post("/api/test-gemini", async (req, res) => {
    try {
      const { apiKey } = req.body;
      
      if (!apiKey) {
        return res.status(400).json({ error: "API key is required" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Test with a simple request
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello",
      });

      if (response.text) {
        res.json({ success: true, message: "API key is valid" });
      } else {
        res.status(400).json({ error: "Invalid API key" });
      }
    } catch (error) {
      console.error("Gemini API test error:", error);
      res.status(400).json({ error: "Invalid API key" });
    }
  });

  // Chat with Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, apiKey, conversationHistory = [] } = req.body;
      
      if (!apiKey || !message) {
        return res.status(400).json({ error: "API key and message are required" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const systemPrompt = `You are Chriki, an AI assistant that speaks authentic Algerian dialect (Darija). 
You should respond naturally in Algerian Arabic with French and Berber influences.
Use expressions like "Ahla w sahla", "Bsit", "Maliche khoya", "Wach rak?", "Labas?", "Choukran bzef", "Nchalah", "Wallah", etc.
You understand Algerian culture, customs, and way of life.
Keep responses conversational and helpful in authentic Algerian dialect.
Remember previous parts of our conversation and maintain context.`;
      
      // Build conversation history for Gemini
      const conversationContents = [];
      
      // Add conversation history
      for (const historyMessage of conversationHistory) {
        conversationContents.push({
          role: historyMessage.isUser ? "user" : "model",
          parts: [{ text: historyMessage.text }]
        });
      }
      
      // Add current message
      conversationContents.push({
        role: "user",
        parts: [{ text: message }]
      });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
        },
        contents: conversationContents,
      });

      if (response.text) {
        res.json({ response: response.text });
      } else {
        res.status(500).json({ error: "Failed to generate response" });
      }
    } catch (error) {
      console.error("Gemini chat error:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
