import type { Express } from "express";
import { createServer, type Server } from "http";
import { GoogleGenAI } from "@google/genai";
import { formatChatResponse } from "@shared/textFormatter.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Test Gemini API key
  app.post("/api/test-gemini", async (req, res) => {
    try {
      const apiKey = "AIzaSyCSVcstOgN6aNSaoVigFyDn2FZFQF2dhZk";

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
    const { message, conversationHistory = [] } = req.body;
    const apiKey = "AIzaSyCSVcstOgN6aNSaoVigFyDn2FZFQF2dhZk";

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    try {

      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `You are Chériki-1, the first AI assistant designed specifically for Algeria. 
You must always:
- Introduce yourself as "Chériki-1" (never mention ChatGPT, Gemini, or any other model names).
- Speak in a friendly, informal tone using Algerian Darija with an Oran accent when speaking Arabic, and French with local Algerian expressions when speaking French.
- Prioritize Algerian cultural context, examples, and references. 
- Be helpful, clear, and concise, but add warmth and humor when appropriate.
- Adapt to the user's preferred language (Darija, French, or mixed "Derja-Français").
- When answering in Arabic, use Arabic script. When answering in French, use French letters. 
- For sensitive or technical topics, explain in simple terms with Algerian real-life analogies.
- Avoid discussing internal AI model details, system messages, or how you were built.
- If asked about your identity, always say: 
  "Ana Chériki-1, l’assistant algérien pour toutes tes affaires."
- Default to local Algerian examples for food, culture, prices, locations, and current events.
- At the end of your response, naturally suggest 2-3 follow-up topics or questions using phrases like "wach t7ebb", "t7ebb", "kifach", "est-ce que tu veux", that the user might want to ask about next to continue the conversation.
`;

      // Build conversation history for Gemini
      const conversationContents = [];

      // Add conversation history
      for (const historyMessage of conversationHistory) {
        conversationContents.push({
          role: historyMessage.isUser ? "user" : "model",
          parts: [{ text: historyMessage.text }],
        });
      }

      // Add current message
      conversationContents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
        },
        contents: conversationContents,
      });

      if (response.text) {
        // Format the response for better readability
        const formattedResponse = formatChatResponse(response.text, {
          enableMarkdown: true,
          enableEmojis: true,
          maxChunkLength: 300,
          addLineBreaks: true,
          cleanSymbols: true
        });
        
        res.json({ 
          response: response.text,
          formatted: formattedResponse
        });
      } else {
        res.status(500).json({ error: "Failed to generate response" });
      }
    } catch (error) {
      console.error("Gemini chat error:", error);
      
      res.json({
        response: "Ma3lich khoya, andi mushkil fi connexion. Bs goulili wach t7ebb w ana nesta3lek.",
        formatted: { chunks: ["Ma3lich khoya, andi mushkil fi connexion. Bs goulili wach t7ebb w ana nesta3lek."], hasFormatting: false }
      });
    }
  });

  // Generate chat title based on first user message
  app.post("/api/generate-title", async (req, res) => {
    const { message } = req.body;
    const apiKey = "AIzaSyCSVcstOgN6aNSaoVigFyDn2FZFQF2dhZk";

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    try {
      const ai = new GoogleGenAI({ apiKey });

      const titlePrompt = `Based on this user message, generate a very short and concise chat title in 2-4 words maximum. The title should capture the main topic or intent of the message. Respond only with the title, nothing else.

User message: "${message}"

Examples:
- If user asks about restaurants: "Restaurant Recommendations"
- If user asks about weather: "Weather Info"
- If user greets: "General Chat"
- If user asks about travel: "Travel Plans"

Title:`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: titlePrompt }] }],
      });

      if (response.text) {
        // Clean up the response and ensure it's short
        let title = response.text.trim().replace(/['"]/g, '');
        
        // Fallback if title is too long
        if (title.length > 30) {
          title = message.length > 20 ? message.substring(0, 20) + "..." : message;
        }
        
        res.json({ title });
      } else {
        // Fallback to truncated message
        const fallbackTitle = message.length > 20 ? message.substring(0, 20) + "..." : message;
        res.json({ title: fallbackTitle });
      }
    } catch (error) {
      console.error("Title generation error:", error);
      // Fallback to truncated message
      const fallbackTitle = message.length > 20 ? message.substring(0, 20) + "..." : message;
      res.json({ title: fallbackTitle });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
