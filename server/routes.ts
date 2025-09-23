import type { Express } from "express";
import { createServer, type Server } from "http";
import { GoogleGenAI } from "@google/genai";
import { formatChatResponse } from "@shared/textFormatter.js";
import { verifyUser, getUserProfile } from "./supabase.js";
import { saveSystemPrompt, getSystemPrompt, getDefaultSystemPrompt, saveApiKey, getAllApiKeys, getApiKeyById, deleteApiKey, toggleApiKeyStatus, getRandomActiveApiKey } from "./mongodb.js";

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
        model: "gemini-2.5-pro",
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

  // Get system prompt from MongoDB
  app.get("/api/system-prompt", async (req, res) => {
    try {
      // Verify authentication
      const { user, error: authError } = await verifyUser(req.headers.authorization);
      
      if (authError || !user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const systemPrompt = await getSystemPrompt();
      
      if (systemPrompt) {
        res.json({ systemPrompt });
      } else {
        // Return default system prompt if none exists in database
        const defaultPrompt = await getDefaultSystemPrompt();
        res.json({ systemPrompt: defaultPrompt });
      }
    } catch (error) {
      console.error("Error retrieving system prompt:", error);
      res.status(500).json({ error: "Failed to retrieve system prompt" });
    }
  });

  // Save system prompt to MongoDB
  app.post("/api/system-prompt", async (req, res) => {
    try {
      const { systemPrompt } = req.body;

      if (!systemPrompt || typeof systemPrompt !== 'string' || systemPrompt.trim().length < 10) {
        return res.status(400).json({ error: "System prompt must be at least 10 characters long" });
      }

      // Verify authentication
      const { user, error: authError } = await verifyUser(req.headers.authorization);
      
      if (authError || !user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const savedPrompt = await saveSystemPrompt(systemPrompt.trim());
      
      res.json({ 
        success: true, 
        message: "System prompt saved successfully",
        systemPrompt: savedPrompt.prompt,
        updatedAt: savedPrompt.updatedAt
      });
    } catch (error) {
      console.error("Error saving system prompt:", error);
      res.status(500).json({ error: "Failed to save system prompt" });
    }
  });

  // API Keys Management Endpoints
  
  // Get all API keys
  app.get("/api/api-keys", async (req, res) => {
    try {
      // Verify authentication
      const { user, error: authError } = await verifyUser(req.headers.authorization);
      
      if (authError || !user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const apiKeys = await getAllApiKeys();
      
      // Don't send the actual API key values to the client for security
      const safeApiKeys = apiKeys.map(key => ({
        id: key.id,
        name: key.name,
        provider: key.provider,
        isActive: key.isActive,
        createdAt: key.createdAt,
        updatedAt: key.updatedAt,
        // Mask the API key for security
        apiKeyPreview: key.apiKey.substring(0, 8) + '...' + key.apiKey.substring(key.apiKey.length - 4)
      }));
      
      res.json({ apiKeys: safeApiKeys });
    } catch (error) {
      console.error("Error retrieving API keys:", error);
      res.status(500).json({ error: "Failed to retrieve API keys" });
    }
  });

  // Save API key
  app.post("/api/api-keys", async (req, res) => {
    try {
      const { id, name, apiKey, provider = 'gemini' } = req.body;

      if (!id || !name || !apiKey) {
        return res.status(400).json({ error: "ID, name, and API key are required" });
      }

      // Verify authentication
      const { user, error: authError } = await verifyUser(req.headers.authorization);
      
      if (authError || !user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const savedApiKey = await saveApiKey(id, name, apiKey, provider);
      
      res.json({ 
        success: true, 
        message: "API key saved successfully",
        apiKey: {
          id: savedApiKey.id,
          name: savedApiKey.name,
          provider: savedApiKey.provider,
          isActive: savedApiKey.isActive,
          createdAt: savedApiKey.createdAt,
          updatedAt: savedApiKey.updatedAt
        }
      });
    } catch (error) {
      console.error("Error saving API key:", error);
      res.status(500).json({ error: "Failed to save API key" });
    }
  });

  // Delete API key
  app.delete("/api/api-keys/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Verify authentication
      const { user, error: authError } = await verifyUser(req.headers.authorization);
      
      if (authError || !user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const deleted = await deleteApiKey(id);
      
      if (deleted) {
        res.json({ success: true, message: "API key deleted successfully" });
      } else {
        res.status(404).json({ error: "API key not found" });
      }
    } catch (error) {
      console.error("Error deleting API key:", error);
      res.status(500).json({ error: "Failed to delete API key" });
    }
  });

  // Toggle API key status
  app.patch("/api/api-keys/:id/toggle", async (req, res) => {
    try {
      const { id } = req.params;

      // Verify authentication
      const { user, error: authError } = await verifyUser(req.headers.authorization);
      
      if (authError || !user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const updatedApiKey = await toggleApiKeyStatus(id);
      
      if (updatedApiKey) {
        res.json({ 
          success: true, 
          message: `API key ${updatedApiKey.isActive ? 'activated' : 'deactivated'} successfully`,
          apiKey: {
            id: updatedApiKey.id,
            name: updatedApiKey.name,
            provider: updatedApiKey.provider,
            isActive: updatedApiKey.isActive,
            updatedAt: updatedApiKey.updatedAt
          }
        });
      } else {
        res.status(404).json({ error: "API key not found" });
      }
    } catch (error) {
      console.error("Error toggling API key status:", error);
      res.status(500).json({ error: "Failed to toggle API key status" });
    }
  });

  // Test API key
  app.post("/api/api-keys/:id/test", async (req, res) => {
    try {
      const { id } = req.params;

      // Verify authentication
      const { user, error: authError } = await verifyUser(req.headers.authorization);
      
      if (authError || !user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const apiKeyDoc = await getApiKeyById(id);
      
      if (!apiKeyDoc) {
        return res.status(404).json({ error: "API key not found" });
      }

      // Test the API key with Gemini
      const ai = new GoogleGenAI({ apiKey: apiKeyDoc.apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: "Hello",
      });

      if (response.text) {
        res.json({ success: true, message: "API key is valid and working" });
      } else {
        res.status(400).json({ error: "API key test failed" });
      }
    } catch (error) {
      console.error("API key test error:", error);
      res.status(400).json({ error: "API key is invalid or has issues" });
    }
  });

  // Chat with Gemini
  app.post("/api/chat", async (req, res) => {
    const { message, conversationHistory = [], userLocation = null, customSystemPrompt = null } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Try to verify authentication (optional for anonymous users)
    const { user, error: authError } = await verifyUser(req.headers.authorization);
    
    let userProfile = null;
    let legacyProfile = null;
    
    if (user && !authError) {
      // Authenticated user - get profile from database
      userProfile = await getUserProfile(user.id);
      
      if (userProfile) {
        // Convert database profile to legacy format for AI prompt
        legacyProfile = {
          name: userProfile.full_name || user.email,
          age: userProfile.preferences?.age || 'Not specified',
          location: 'Not specified',
          wilaya: userLocation?.wilayaName || 'Algeria',
          occupation: userProfile.preferences?.occupation || 'Not specified',
          interests: userProfile.preferences?.interests || 'Various topics',
          preferredLanguage: userProfile.preferences?.preferredLanguage || 'mixed'
        };
      } else {
        // Authenticated user but no profile - use email as fallback
        legacyProfile = {
          name: user.email || 'User',
          age: 'Not specified',
          location: 'Not specified',
          wilaya: userLocation?.wilayaName || 'Algeria',
          occupation: 'Not specified',
          interests: 'Various topics',
          preferredLanguage: 'mixed'
        };
      }
    } else {
      // Anonymous user - create default profile
      legacyProfile = {
        name: 'Anonymous User',
        age: 'Not specified',
        location: 'Not specified',
        wilaya: userLocation?.wilayaName || 'Algeria',
        occupation: 'Not specified',
        interests: 'Various topics',
        preferredLanguage: 'mixed'
      };
    }

    // Log requests for monitoring (can be removed in production)
    const locationInfo = userLocation ? 
      (userLocation.wilayaName ? ` (wilaya: ${userLocation.wilayaName})` : ` (coords: ${userLocation.latitude}, ${userLocation.longitude})`) : '';
    const userName = userProfile?.full_name || user?.email || 'Anonymous User';
    console.log(`💬 Chat request from ${userName}${locationInfo}`);
    
    try {
      // Get a random active API key from the database
      const apiKey = await getRandomActiveApiKey();
      
      if (!apiKey) {
        return res.status(503).json({ 
          error: "No active API keys available. Please contact administrator to add API keys." 
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      // Build language directives from user preferences
      const preferred = (legacyProfile.preferredLanguage || 'mixed').toLowerCase();
      const languageLabel =
        preferred === 'darija' ? 'Algerian Darija' :
        preferred === 'french' ? 'French' :
        preferred === 'arabic' ? 'Standard Arabic' :
        'Mixed Darija and French';

      const languageDirectives =
        preferred === 'darija'
          ? `- Always answer in Algerian Darija using Arabic script.\n- Avoid mixing in French unless the user uses it.`
          : preferred === 'french'
          ? `- Always answer in French with Algerian expressions.\n- Do not use Arabic script unless the user asks.`
          : preferred === 'arabic'
          ? `- Always answer in Modern Standard Arabic (Fus'ha) using Arabic script.`
          : `- Mix Algerian Darija (Arabic script) and French naturally.\n- Prefer and mirror the user's current language.`;

      // Get system prompt from MongoDB or use custom/default
      let systemPrompt;
      
      if (customSystemPrompt && customSystemPrompt.trim().length > 0) {
        // Use custom system prompt and append user profile context
        systemPrompt = `${customSystemPrompt}

LANGUAGE PREFERENCES (STRICT):
- Preferred language from user settings: ${languageLabel}
${languageDirectives}

LOCATION-BASED ASSISTANCE:
${userLocation ? `- User's location: ${userLocation.wilayaName ? `${userLocation.wilayaName} wilaya, Algeria` : `${userLocation.latitude}, ${userLocation.longitude}`}
- When the user asks for nearby places (hospitals, restaurants, pharmacies, etc.), provide specific recommendations and include a Google Maps query in your response.
- When the user says "map" or asks for a map, always provide a helpful response and include a Google Maps query.
- Format location queries as: ${userLocation.wilayaName ? `"hospitals in ${userLocation.wilayaName}", "restaurants in ${userLocation.wilayaName}", "pharmacies in ${userLocation.wilayaName}", etc.` : `"hospitals near me", "restaurants in Algeria", "pharmacies nearby", etc.`}
- If the user asks for a specific location, use that exact location in the query.
- Always provide helpful information about the places you recommend.` : `- User location not available. If they ask for nearby places or maps, ask them to set their wilaya in settings or provide general recommendations for Algeria.`}

MAP FUNCTIONALITY:
- Whenever the user mentions "map", "maps", "خريطة", or "carte", respond helpfully and include a map query.
- Examples: "show me map" → provide general map, "map of Oran" → provide Oran map, "hospital map" → provide hospital map
- Always be enthusiastic about providing maps and location assistance.

GOOGLE MAPS SEARCH OPTIMIZATION (CRITICAL):
- When users ask for locations, you MUST include a special marker in your response.
- At the END of your response, add: "🗺️ MAPS_QUERY: [optimized_search_term]"
- Extract ONLY the core service/place type, ignore all other words including names, adjectives, and conversational phrases.
- Core service types: hospital, restaurant, pharmacy, cafe, bank, atm, school, university, park, museum, cinema, etc.
- Examples:
  * User: "give me location of hospital" → Add: "🗺️ MAPS_QUERY: hospital near me"
  * User: "win jay hospital" → Add: "🗺️ MAPS_QUERY: hospital near me"
  * User: "show me good restaurants" → Add: "🗺️ MAPS_QUERY: restaurants near me"
  * User: "where is Al Azhar pharmacy" → Add: "🗺️ MAPS_QUERY: pharmacy near me"
  * User: "find me a nice cafe downtown" → Add: "🗺️ MAPS_QUERY: cafe near me"
  * User: "pharmacies in Oran" → Add: "🗺️ MAPS_QUERY: pharmacies in Oran"
- IGNORE specific names, brands, or descriptive words - only use the core service type
- If user has location, add "near me" to the core term
- If user mentions a specific city, include that city name with the core term
- This marker helps the system provide accurate Google Maps integration

USER PROFILE CONTEXT (ALWAYS USE THIS INFORMATION):
- User's name: ${legacyProfile.name || 'Friend'}
- Age range: ${legacyProfile.age || 'Not specified'}
- Location: ${legacyProfile.location ? legacyProfile.location + ', ' : ''}${legacyProfile.wilaya || 'Algeria'} wilaya
- Occupation: ${legacyProfile.occupation || 'Not specified'}
- Interests: ${legacyProfile.interests || 'Various topics'}
- Preferred language: ${languageLabel}

MANDATORY: Always use this profile information to personalize your responses. Address the user by name, reference their location and interests, and adapt your language style to their preferences. Make your responses relevant to their age group and occupation. When asked about what you know about them, provide this information in a friendly, conversational way.`;
      } else {
        // Fetch system prompt from MongoDB, fallback to default if not found
        try {
          const mongoSystemPrompt = await getSystemPrompt();
          const basePrompt = mongoSystemPrompt || await getDefaultSystemPrompt();
          
          systemPrompt = `${basePrompt}

LANGUAGE PREFERENCES (STRICT):
- Preferred language from user settings: ${languageLabel}
${languageDirectives}

LOCATION-BASED ASSISTANCE:
${userLocation ? `- User's location: ${userLocation.wilayaName ? `${userLocation.wilayaName} wilaya, Algeria` : `${userLocation.latitude}, ${userLocation.longitude}`}
- When the user asks for nearby places (hospitals, restaurants, pharmacies, etc.), provide specific recommendations and include a Google Maps query in your response.
- When the user says "map" or asks for a map, always provide a helpful response and include a Google Maps query.
- Format location queries as: ${userLocation.wilayaName ? `"hospitals in ${userLocation.wilayaName}", "restaurants in ${userLocation.wilayaName}", "pharmacies in ${userLocation.wilayaName}", etc.` : `"hospitals near me", "restaurants in Algeria", "pharmacies nearby", etc.`}
- If the user asks for a specific location, use that exact location in the query.
- Always provide helpful information about the places you recommend.` : `- User location not available. If they ask for nearby places or maps, ask them to set their wilaya in settings or provide general recommendations for Algeria.`}

MAP FUNCTIONALITY:
- Whenever the user mentions "map", "maps", "خريطة", or "carte", respond helpfully and include a map query.
- Examples: "show me map" → provide general map, "map of Oran" → provide Oran map, "hospital map" → provide hospital map
- Always be enthusiastic about providing maps and location assistance.

GOOGLE MAPS SEARCH OPTIMIZATION (CRITICAL):
- When users ask for locations, you MUST include a special marker in your response.
- At the END of your response, add: "🗺️ MAPS_QUERY: [optimized_search_term]"
- Extract ONLY the core service/place type, ignore all other words including names, adjectives, and conversational phrases.
- Core service types: hospital, restaurant, pharmacy, cafe, bank, atm, school, university, park, museum, cinema, etc.
- Examples:
  * User: "give me location of hospital" → Add: "🗺️ MAPS_QUERY: hospital near me"
  * User: "win jay hospital" → Add: "🗺️ MAPS_QUERY: hospital near me"
  * User: "show me good restaurants" → Add: "🗺️ MAPS_QUERY: restaurants near me"
  * User: "where is Al Azhar pharmacy" → Add: "🗺️ MAPS_QUERY: pharmacy near me"
  * User: "find me a nice cafe downtown" → Add: "🗺️ MAPS_QUERY: cafe near me"
  * User: "pharmacies in Oran" → Add: "🗺️ MAPS_QUERY: pharmacies in Oran"
- IGNORE specific names, brands, or descriptive words - only use the core service type
- If user has location, add "near me" to the core term
- If user mentions a specific city, include that city name with the core term
- This marker helps the system provide accurate Google Maps integration

USER PROFILE CONTEXT (ALWAYS USE THIS INFORMATION):
- User's name: ${legacyProfile.name || 'Friend'}
- Age range: ${legacyProfile.age || 'Not specified'}
- Location: ${legacyProfile.location ? legacyProfile.location + ', ' : ''}${legacyProfile.wilaya || 'Algeria'} wilaya
- Occupation: ${legacyProfile.occupation || 'Not specified'}
- Interests: ${legacyProfile.interests || 'Various topics'}
- Preferred language: ${languageLabel}

MANDATORY: Always use this profile information to personalize your responses. Address the user by name, reference their location and interests, and adapt your language style to their preferences. Make your responses relevant to their age group and occupation. When asked about what you know about them, provide this information in a friendly, conversational way.`;
        } catch (error) {
          console.error("Error fetching system prompt from MongoDB:", error);
          // Fallback to hardcoded default if MongoDB fails
          const defaultPrompt = await getDefaultSystemPrompt();
          systemPrompt = `${defaultPrompt}

LANGUAGE PREFERENCES (STRICT):
- Preferred language from user settings: ${languageLabel}
${languageDirectives}

LOCATION-BASED ASSISTANCE:
${userLocation ? `- User's location: ${userLocation.wilayaName ? `${userLocation.wilayaName} wilaya, Algeria` : `${userLocation.latitude}, ${userLocation.longitude}`}
- When the user asks for nearby places (hospitals, restaurants, pharmacies, etc.), provide specific recommendations and include a Google Maps query in your response.
- When the user says "map" or asks for a map, always provide a helpful response and include a Google Maps query.
- Format location queries as: ${userLocation.wilayaName ? `"hospitals in ${userLocation.wilayaName}", "restaurants in ${userLocation.wilayaName}", "pharmacies in ${userLocation.wilayaName}", etc.` : `"hospitals near me", "restaurants in Algeria", "pharmacies nearby", etc.`}
- If the user asks for a specific location, use that exact location in the query.
- Always provide helpful information about the places you recommend.` : `- User location not available. If they ask for nearby places or maps, ask them to set their wilaya in settings or provide general recommendations for Algeria.`}

MAP FUNCTIONALITY:
- Whenever the user mentions "map", "maps", "خريطة", or "carte", respond helpfully and include a map query.
- Examples: "show me map" → provide general map, "map of Oran" → provide Oran map, "hospital map" → provide hospital map
- Always be enthusiastic about providing maps and location assistance.

GOOGLE MAPS SEARCH OPTIMIZATION (CRITICAL):
- When users ask for locations, you MUST include a special marker in your response.
- At the END of your response, add: "🗺️ MAPS_QUERY: [optimized_search_term]"
- Extract ONLY the core service/place type, ignore all other words including names, adjectives, and conversational phrases.
- Core service types: hospital, restaurant, pharmacy, cafe, bank, atm, school, university, park, museum, cinema, etc.
- Examples:
  * User: "give me location of hospital" → Add: "🗺️ MAPS_QUERY: hospital near me"
  * User: "win jay hospital" → Add: "🗺️ MAPS_QUERY: hospital near me"
  * User: "show me good restaurants" → Add: "🗺️ MAPS_QUERY: restaurants near me"
  * User: "where is Al Azhar pharmacy" → Add: "🗺️ MAPS_QUERY: pharmacy near me"
  * User: "find me a nice cafe downtown" → Add: "🗺️ MAPS_QUERY: cafe near me"
  * User: "pharmacies in Oran" → Add: "🗺️ MAPS_QUERY: pharmacies in Oran"
- IGNORE specific names, brands, or descriptive words - only use the core service type
- If user has location, add "near me" to the core term
- If user mentions a specific city, include that city name with the core term
- This marker helps the system provide accurate Google Maps integration

USER PROFILE CONTEXT (ALWAYS USE THIS INFORMATION):
- User's name: ${legacyProfile.name || 'Friend'}
- Age range: ${legacyProfile.age || 'Not specified'}
- Location: ${legacyProfile.location ? legacyProfile.location + ', ' : ''}${legacyProfile.wilaya || 'Algeria'} wilaya
- Occupation: ${legacyProfile.occupation || 'Not specified'}
- Interests: ${legacyProfile.interests || 'Various topics'}
- Preferred language: ${languageLabel}

MANDATORY: Always use this profile information to personalize your responses. Address the user by name, reference their location and interests, and adapt your language style to their preferences. Make your responses relevant to their age group and occupation. When asked about what you know about them, provide this information in a friendly, conversational way.`;
        }
      }

      // Build conversation history for Gemini
      const conversationContents = [];

      // Add system prompt as the first message
      conversationContents.push({
        role: "user",
        parts: [{ text: systemPrompt }],
      });
      
      conversationContents.push({
        role: "model",
        parts: [{ text: "I understand. I am Chériki-1, your Algerian AI assistant. I'll follow these instructions and respond accordingly. How can I help you today?" }],
      });

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

        // Extract map query from Gemini's response using the special marker
        let mapsQuery = null;
        let cleanedResponse = response.text;
        
        // Look for the special MAPS_QUERY marker in Gemini's response
        const mapsQueryMatch = response.text.match(/🗺️\s*MAPS_QUERY:\s*(.+?)(?:\n|$)/i);
        if (mapsQueryMatch) {
          mapsQuery = mapsQueryMatch[1].trim();
          // Remove the marker from the response text so it doesn't show to user
          cleanedResponse = response.text.replace(/🗺️\s*MAPS_QUERY:\s*.+?(?:\n|$)/i, '').trim();
        }
        
        res.json({ 
          response: cleanedResponse,
          formatted: formatChatResponse(cleanedResponse, {
            enableMarkdown: true,
            enableEmojis: true,
            maxChunkLength: 300,
            addLineBreaks: true,
            cleanSymbols: true
          }),
          mapsQuery
        });
      } else {
        res.status(500).json({ error: "Failed to generate response" });
      }
    } catch (error) {
      console.error("Gemini chat error:", error);
      
      // Check if this is a location query for fallback
      let mapsQuery = null;
      const lowerMessage = message.toLowerCase();
      const locationKeywords = [
        'hospital', 'hôpital', 'مستشفى', 'restaurant', 'pharmacy', 'cafe', 'bank', 'atm',
        'near me', 'près de moi', 'قريب مني', 'nearby', 'à proximité', 'قريب'
      ];
      const mapKeywords = ['map', 'maps', 'خريطة', 'carte'];
      
      if (locationKeywords.some(keyword => lowerMessage.includes(keyword)) || 
          mapKeywords.some(keyword => lowerMessage.includes(keyword))) {
        let query = message.replace(/[؟?]/g, '').trim();
        
        // Handle map-only requests  
        if (mapKeywords.some(keyword => lowerMessage.includes(keyword)) && 
            !locationKeywords.some(keyword => lowerMessage.includes(keyword))) {
          // Apply same optimization logic
          const conversationalWords = [
            'give me', 'show me', 'find me', 'i want', 'i need', 'can you', 'please',
            'location of', 'locations of', 'where are', 'where is', 'help me find',
            'search for', 'look for', 'find', 'get me', 'provide me'
          ];
          
          conversationalWords.forEach(phrase => {
            query = query.replace(new RegExp(`\\b${phrase}\\b`, 'gi'), '');
          });
          
          query = query.replace(/\b(map|maps|خريطة|carte)\b/gi, '');
          query = query.replace(/\bin google\b/gi, '');
          query = query.replace(/\bgoogle maps\b/gi, '');
          query = query.replace(/hostpitals?/gi, 'hospitals');
          query = query.trim();
          
          if (!query || query.length < 3) {
            query = "Algeria map";
          }
        }
        
        mapsQuery = query;
      }
      
      res.json({
        response: "Ma3lich khoya, andi mushkil fi connexion. Bs goulili wach t7ebb w ana nesta3lek.",
        formatted: { chunks: ["Ma3lich khoya, andi mushkil fi connexion. Bs goulili wach t7ebb w ana nesta3lek."], hasFormatting: false },
        mapsQuery
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
