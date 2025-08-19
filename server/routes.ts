import type { Express } from "express";
import { createServer, type Server } from "http";
import { GoogleGenAI } from "@google/genai";
import { formatChatResponse } from "@shared/textFormatter.js";
import { verifyUser, getUserProfile } from "./supabase.js";

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
    const { message, conversationHistory = [], userLocation = null } = req.body;
    const apiKey = "AIzaSyCSVcstOgN6aNSaoVigFyDn2FZFQF2dhZk";

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Verify authentication
    const { user, error: authError } = await verifyUser(req.headers.authorization);
    
    if (authError || !user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Get user profile from database
    const userProfile = await getUserProfile(user.id);
    
    if (!userProfile) {
      return res.status(400).json({ error: "User profile not found. Please complete your profile setup." });
    }

    // Log requests for monitoring (can be removed in production)
    console.log(`💬 Chat request from ${userProfile.full_name || user.email} in ${userProfile.wilaya || 'Algeria'}${userLocation ? ` (with location: ${userLocation.latitude}, ${userLocation.longitude})` : ''}`);

    // Convert database profile to legacy format for AI prompt
    const legacyProfile = {
      name: userProfile.full_name || user.email,
      age: userProfile.preferences?.age || 'Not specified',
      location: userProfile.city || 'Not specified',
      wilaya: userProfile.wilaya || 'Algeria',
      occupation: userProfile.preferences?.occupation || 'Not specified',
      interests: userProfile.preferences?.interests || 'Various topics',
      preferredLanguage: userProfile.preferences?.preferredLanguage || 'mixed'
    };
    
    try {

      const ai = new GoogleGenAI({ apiKey });

      // Build personalized system prompt with mandatory user profile
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
  "Ana Chériki-1, l'assistant algérien pour toutes tes affaires."
- Default to local Algerian examples for food, culture, prices, locations, and current events.
- At the end of your response, naturally suggest 2-3 follow-up topics or questions using phrases like "wach t7ebb", "t7ebb", "kifach", "est-ce que tu veux", that the user might want to ask about next to continue the conversation.

LOCATION-BASED ASSISTANCE:
${userLocation ? `- User's current location: ${userLocation.latitude}, ${userLocation.longitude}
- When the user asks for nearby places (hospitals, restaurants, pharmacies, etc.), provide specific recommendations and include a Google Maps query in your response.
- When the user says "map" or asks for a map, always provide a helpful response and include a Google Maps query.
- Format location queries as: "hospitals near me", "restaurants in Algeria", "pharmacies nearby", etc.
- If the user asks for a specific location, use that exact location in the query.
- Always provide helpful information about the places you recommend.` : `- User location not available. If they ask for nearby places or maps, ask them to enable location access or provide general recommendations for Algeria.`}

MAP FUNCTIONALITY:
- Whenever the user mentions "map", "maps", "خريطة", or "carte", respond helpfully and include a map query.
- Examples: "show me map" → provide general map, "map of Oran" → provide Oran map, "hospital map" → provide hospital map
- Always be enthusiastic about providing maps and location assistance.

USER PROFILE CONTEXT (ALWAYS USE THIS INFORMATION):
- User's name: ${legacyProfile.name || 'Friend'}
- Age range: ${legacyProfile.age || 'Not specified'}
- Location: ${legacyProfile.location ? legacyProfile.location + ', ' : ''}${legacyProfile.wilaya || 'Algeria'} wilaya
- Occupation: ${legacyProfile.occupation || 'Not specified'}
- Interests: ${legacyProfile.interests || 'Various topics'}
- Preferred language: ${legacyProfile.preferredLanguage === 'darija' ? 'Algerian Darija' : legacyProfile.preferredLanguage === 'french' ? 'French' : legacyProfile.preferredLanguage === 'arabic' ? 'Standard Arabic' : 'Mixed Darija and French'}

MANDATORY: Always use this profile information to personalize your responses. Address the user by name, reference their location and interests, and adapt your language style to their preferences. Make your responses relevant to their age group and occupation. When asked about what you know about them, provide this information in a friendly, conversational way.`;

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

        // Detect location-based queries and generate Google Maps URL
        let mapsQuery = null;
        const lowerMessage = message.toLowerCase();
        
        // Primary keywords that always trigger maps
        const locationKeywords = [
          'hospital', 'hôpital', 'مستشفى', 'مستشفيات',
          'restaurant', 'مطعم', 'مطاعم',
          'pharmacy', 'pharmacie', 'صيدلية', 'صيدليات',
          'cafe', 'café', 'قهوة', 'كافيه',
          'bank', 'banque', 'بنك', 'بنوك',
          'atm', 'distributeur',
          'gas station', 'station service', 'محطة بنزين',
          'police', 'شرطة',
          'fire station', 'pompiers', 'إطفاء',
          'school', 'école', 'مدرسة', 'مدارس',
          'university', 'université', 'جامعة', 'جامعات',
          'park', 'parc', 'حديقة', 'حدائق',
          'museum', 'musée', 'متحف', 'متاحف',
          'cinema', 'cinéma', 'سينما',
          'shopping', 'centre commercial', 'مركز تجاري',
          'near me', 'près de moi', 'قريب مني',
          'around me', 'autour de moi', 'حولي',
          'nearby', 'à proximité', 'قريب'
        ];

        // Map keyword detection - triggers map widget for any message containing "map"
        const mapKeywords = ['map', 'maps', 'خريطة', 'carte'];
        const hasMapKeyword = mapKeywords.some(keyword => lowerMessage.includes(keyword));
        
        const hasLocationQuery = locationKeywords.some(keyword => 
          lowerMessage.includes(keyword)
        );

        // Generate map query if either location keywords or map keyword is present
        if (hasLocationQuery || hasMapKeyword) {
          let query = message;
          
          // Function to extract and optimize search terms
          const optimizeSearchQuery = (input: string): string => {
            let optimized = input.toLowerCase();
            
            // Remove conversational words and phrases
            const conversationalWords = [
              'give me', 'show me', 'find me', 'i want', 'i need', 'can you', 'please',
              'location of', 'locations of', 'where are', 'where is', 'help me find',
              'search for', 'look for', 'find', 'get me', 'provide me',
              'في', 'أين', 'أعطني', 'أريد', 'ابحث عن', 'دلني على',
              'donne moi', 'montre moi', 'trouve moi', 'je veux', 'je cherche',
              'où sont', 'où est', 'aide moi', 'chercher', 'localiser'
            ];
            
            conversationalWords.forEach(phrase => {
              optimized = optimized.replace(new RegExp(`\\b${phrase}\\b`, 'gi'), '');
            });
            
            // Remove location trigger words that aren't needed in search
            optimized = optimized.replace(/\bin google\b/gi, '');
            optimized = optimized.replace(/\bon google maps\b/gi, '');
            optimized = optimized.replace(/\bgoogle maps\b/gi, '');
            optimized = optimized.replace(/\bmaps\b/gi, '');
            optimized = optimized.replace(/\bmap\b/gi, '');
            optimized = optimized.replace(/\bخريطة\b/gi, '');
            optimized = optimized.replace(/\bcarte\b/gi, '');
            
            // Fix common spelling mistakes
            optimized = optimized.replace(/hostpitals?/gi, 'hospitals');
            optimized = optimized.replace(/resturants?/gi, 'restaurants');
            optimized = optimized.replace(/farmacies?/gi, 'pharmacies');
            
            // Clean up extra spaces and punctuation
            optimized = optimized.replace(/[؟?!.]/g, '');
            optimized = optimized.replace(/\s+/g, ' ').trim();
            
            return optimized;
          };
          
          // Special handling for explicit map requests
          if (hasMapKeyword && !hasLocationQuery) {
            query = optimizeSearchQuery(message);
            if (!query) {
              query = userLocation ? "places near me" : "Algeria map";
            }
          } else {
            query = optimizeSearchQuery(message);
          }
          
          // Extract specific location names if mentioned
          const algerianCities = [
            'algiers', 'alger', 'الجزائر',
            'oran', 'wahran', 'وهران',
            'constantine', 'قسنطينة',
            'annaba', 'عنابة',
            'setif', 'سطيف',
            'batna', 'باتنة',
            'blida', 'البليدة',
            'tlemcen', 'تلمسان',
            'bejaia', 'béjaïa', 'بجاية',
            'biskra', 'بسكرة',
            'mascara', 'معسكر',
            'mostaganem', 'مستغانم'
          ];
          
          // Check if a specific Algerian city is mentioned
          let specificLocation = null;
          algerianCities.forEach(city => {
            if (lowerMessage.includes(city.toLowerCase())) {
              specificLocation = city;
            }
          });
          
          if (specificLocation) {
            // If specific city mentioned, search in that city
            query = query.replace(new RegExp(specificLocation, 'gi'), '').trim();
            if (hasLocationQuery) {
              query = `${query} in ${specificLocation}, Algeria`;
            } else {
              query = `${specificLocation}, Algeria`;
            }
          } else if (userLocation && !lowerMessage.includes('in ') && !lowerMessage.includes('à ') && !lowerMessage.includes('في ')) {
            // If user has location and no specific city mentioned, add "near me"
            if (!lowerMessage.includes('near me') && !lowerMessage.includes('près de moi') && !lowerMessage.includes('قريب مني')) {
              query = `${query} near me`;
            }
          }
          
          // Final cleanup
          query = query.replace(/\s+/g, ' ').trim();
          
          // Ensure we have a meaningful query
          if (!query || query.length < 3) {
            if (hasLocationQuery) {
              // Extract the main service type
              if (lowerMessage.includes('hospital') || lowerMessage.includes('مستشفى')) {
                query = userLocation ? "hospitals near me" : "hospitals Algeria";
              } else if (lowerMessage.includes('restaurant') || lowerMessage.includes('مطعم')) {
                query = userLocation ? "restaurants near me" : "restaurants Algeria";
              } else if (lowerMessage.includes('pharmacy') || lowerMessage.includes('صيدلية')) {
                query = userLocation ? "pharmacies near me" : "pharmacies Algeria";
              } else {
                query = userLocation ? "places near me" : "Algeria";
              }
            } else {
              query = userLocation ? "places near me" : "Algeria";
            }
          }
          
          mapsQuery = query;
        }
        
        res.json({ 
          response: response.text,
          formatted: formattedResponse,
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
