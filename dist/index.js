// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { GoogleGenAI } from "@google/genai";

// shared/textFormatter.ts
var defaultOptions = {
  enableMarkdown: true,
  enableEmojis: true,
  maxChunkLength: 300,
  addLineBreaks: true,
  cleanSymbols: true
};
var EMOJI_MAP = {
  // Places and locations
  restaurants: "\u{1F37D}\uFE0F",
  restaurant: "\u{1F37D}\uFE0F",
  makla: "\u{1F37D}\uFE0F",
  food: "\u{1F37D}\uFE0F",
  // Geography
  oran: "\u{1F4CD}",
  alger: "\u{1F4CD}",
  algiers: "\u{1F4CD}",
  constantine: "\u{1F4CD}",
  setif: "\u{1F4CD}",
  annaba: "\u{1F4CD}",
  // Weather
  m\u00E9t\u00E9o: "\u{1F324}\uFE0F",
  weather: "\u{1F324}\uFE0F",
  jaw: "\u{1F324}\uFE0F",
  rain: "\u{1F327}\uFE0F",
  sun: "\u2600\uFE0F",
  // Beaches and tourism
  beach: "\u{1F3D6}\uFE0F",
  plage: "\u{1F3D6}\uFE0F",
  sea: "\u{1F30A}",
  bahr: "\u{1F30A}",
  // Transportation
  transport: "\u{1F68C}",
  bus: "\u{1F68C}",
  metro: "\u{1F687}",
  taxi: "\u{1F695}",
  // Money and shopping
  prix: "\u{1F4B0}",
  price: "\u{1F4B0}",
  shopping: "\u{1F6CD}\uFE0F",
  // Greetings and emotions
  salam: "\u{1F44B}",
  ahla: "\u{1F44B}",
  merci: "\u{1F64F}",
  choukran: "\u{1F64F}",
  // Time
  time: "\u23F0",
  wa9t: "\u23F0",
  today: "\u{1F4C5}",
  lyoum: "\u{1F4C5}"
};
function cleanRawText(text, options = defaultOptions) {
  if (!options.cleanSymbols) return text;
  return text.replace(/\s+/g, " ").replace(/\*\*/g, "**").replace(/\*([^*]+)\*/g, "*$1*").replace(/\.{3,}/g, "...").replace(/!{2,}/g, "!").replace(/\?{2,}/g, "?").replace(/([a-zA-Z])([أ-ي])/g, "$1 $2").replace(/([أ-ي])([a-zA-Z])/g, "$1 $2").trim();
}
function addContextualEmojis(text, options = defaultOptions) {
  if (!options.enableEmojis) return text;
  let processedText = text;
  Object.entries(EMOJI_MAP).forEach(([keyword, emoji]) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    if (regex.test(processedText) && !processedText.includes(emoji)) {
      processedText = processedText.replace(
        new RegExp(`(^|\\. )([^.]*\\b${keyword}\\b[^.]*)`, "gi"),
        `$1${emoji} $2`
      );
    }
  });
  return processedText;
}
function addLineBreaks(text, options = defaultOptions) {
  if (!options.addLineBreaks) return text;
  return text.replace(/([.!?])(\s+)([A-Za-zأ-ي])/g, (match, punct, space, nextChar) => {
    const beforePunct = text.substring(0, text.indexOf(match));
    const lastSentenceStart = Math.max(
      beforePunct.lastIndexOf("."),
      beforePunct.lastIndexOf("!"),
      beforePunct.lastIndexOf("?")
    );
    const sentenceLength = beforePunct.length - lastSentenceStart;
    return sentenceLength > 60 ? `${punct}

${nextChar}` : match;
  }).replace(/([.!?])\s+(1\.|•|-|\*)/g, "$1\n\n$2").replace(/([.!?])\s+(Et|And|Walakin|Mais|But)/gi, "$1\n\n$2");
}
function applyMarkdownFormatting(text, options = defaultOptions) {
  if (!options.enableMarkdown) return text;
  return text.replace(/\b(Chriki|Chériki-1)\b/g, "**$1**").replace(/\b(important|mhim|important)\b/gi, "**$1**").replace(/\b(Oran|Alger|Algiers|Constantine|Sétif|Annaba)\b/g, "*$1*").replace(/(\d+)\s*(DA|dinars?|euros?)\b/gi, "**$1 $2**").replace(/\b(\d{1,2}:\d{2})\b/g, "**$1**");
}
function splitIntoChunks(text, options = defaultOptions) {
  const maxLength = options.maxChunkLength;
  if (text.length <= maxLength) {
    return [text];
  }
  const chunks = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = "";
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks.length > 0 ? chunks : [text];
}
function extractSuggestions(text) {
  const suggestions = [];
  const suggestionPatterns = [
    { pattern: /wach t7ebb\s+([^.!?]+)/gi, prefix: "" },
    { pattern: /t7ebb\s+([^.!?]+)/gi, prefix: "" },
    { pattern: /kifach\s+([^.!?]+)/gi, prefix: "Kifach " },
    { pattern: /est-ce que tu veux\s+([^.!?]+)/gi, prefix: "Est-ce que je peux " },
    { pattern: /vous voulez\s+([^.!?]+)/gi, prefix: "Je veux " },
    { pattern: /ça t'intéresse\s+([^.!?]+)/gi, prefix: "" }
  ];
  suggestionPatterns.forEach(({ pattern, prefix }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].trim().length > 5) {
        let suggestion = match[1].trim();
        suggestion = suggestion.replace(/[,;].*$/, "");
        suggestions.push(prefix + suggestion + "?");
      }
    }
  });
  if (suggestions.length === 0) {
    if (text.toLowerCase().includes("restaurant") || text.toLowerCase().includes("makla")) {
      suggestions.push("Fin nlaga restaurants mlah 9rib meni?", "Chnouwa makla traditionnel li tensa7 biha?", "Kemma prix mte3 makla fi restaurants?");
    } else if (text.toLowerCase().includes("m\xE9t\xE9o") || text.toLowerCase().includes("jaw")) {
      suggestions.push("Chnouwa l'jaw ghoudwa?", "Wach bard wela skhoun had nhar?", "Nlabas eh fi had l'jaw?");
    } else if (text.toLowerCase().includes("oran") || text.toLowerCase().includes("alger")) {
      suggestions.push("Wach andi blayess zouina fi had l'medina?", "Kifach nrouh l'centre ville?", "Chnouwa transport li y5dem mlah?");
    } else if (text.toLowerCase().includes("couscous") || text.toLowerCase().includes("chorba")) {
      suggestions.push("3allimni kifach ndir couscous?", "Wach andi recettes djazairiya o5ra?", "Chnouwa makla mte3 l'3id?");
    } else if (text.toLowerCase().includes("travail") || text.toLowerCase().includes("5edma")) {
      suggestions.push("Kifach nlaga 5edma fi dzayer?", "A3tini tips bach nekteb CV?", "Kemma salaire fi had l'5edma?");
    } else if (text.toLowerCase().includes("football") || text.toLowerCase().includes("koura")) {
      suggestions.push("Chnouwa a5bar l'\xE9quipe nationale?", "Wach match importante had semaine?", "Chkoun les joueurs li ya3jbouk?");
    } else if (text.toLowerCase().includes("universit\xE9") || text.toLowerCase().includes("\xE9tudes")) {
      suggestions.push("Wach andi universit\xE9s mlah fi dzayer?", "Kifach nekteb dossier inscription?", "Chnouwa sp\xE9cialit\xE9s li tansa7 biha?");
    } else if (text.toLowerCase().includes("transport") || text.toLowerCase().includes("metro")) {
      suggestions.push("Kifach ya5dem metro fi alger?", "Wach andi bus li yrouh l'centre?", "Kemma prix transport?");
    } else if (text.toLowerCase().includes("shopping") || text.toLowerCase().includes("centre commercial")) {
      suggestions.push("Fin nlaga centres commerciaux?", "Wach andi marques djazairiya mlah?", "Kifach nechri online fi dzayer?");
    } else {
      suggestions.push("Goulili akther 3la had l'haja", "Chnouwa 7aja o5ra mumkine ta3mil?", "Kifach mumkine nesta3lek akther?");
    }
  }
  return suggestions.slice(0, 3);
}
function formatChatResponse(rawText, options = {}, includeSuggestions = true) {
  const opts = { ...defaultOptions, ...options };
  let processedText = cleanRawText(rawText, opts);
  processedText = addLineBreaks(processedText, opts);
  processedText = applyMarkdownFormatting(processedText, opts);
  processedText = addContextualEmojis(processedText, opts);
  const chunks = splitIntoChunks(processedText, opts);
  const suggestions = includeSuggestions ? extractSuggestions(rawText) : void 0;
  return {
    chunks,
    hasFormatting: chunks.length > 1 || processedText !== rawText,
    suggestions
  };
}

// server/supabase.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = "https://qzqldzgbxesvlxkjtxzt.supabase.co";
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cWxkemdieGVzdmx4a2p0eHp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ2MDI5MywiZXhwIjoyMDcxMDM2MjkzfQ.jlhWgpIB8rISz3i_ybvmyVNGMh5G_KTl9ydEsitFyCc";
var supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
var supabaseClient = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cWxkemdieGVzdmx4a2p0eHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NjAyOTMsImV4cCI6MjA3MTAzNjI5M30.3fzr9iSmYb-YV2UckwdsXk1f6XkdgXlR-U25JKaZoJU");
async function verifyUser(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, error: "No valid authorization header" };
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);
    if (error || !user) {
      return { user: null, error: error?.message || "Invalid token" };
    }
    return { user, error: null };
  } catch (error) {
    return { user: null, error: "Token verification failed" };
  }
}
async function getUserProfile(userId) {
  try {
    console.log("\u{1F50D} [Server] Fetching profile for user:", userId);
    const { data: profile, error } = await supabaseAdmin.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (error) {
      console.error("\u274C [Server] Error fetching profile:", error);
      return null;
    }
    console.log("\u{1F4CA} [Server] Profile fetch result:", profile ? "Found" : "Not found");
    return profile;
  } catch (error) {
    console.error("\u274C [Server] Error fetching profile:", error);
    return null;
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/test-gemini", async (req, res) => {
    try {
      const apiKey = "AIzaSyCSVcstOgN6aNSaoVigFyDn2FZFQF2dhZk";
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello"
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
  app2.post("/api/chat", async (req, res) => {
    const { message, conversationHistory = [], userLocation = null } = req.body;
    const apiKey = "AIzaSyCSVcstOgN6aNSaoVigFyDn2FZFQF2dhZk";
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const { user, error: authError } = await verifyUser(req.headers.authorization);
    if (authError || !user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const userProfile = await getUserProfile(user.id);
    if (!userProfile) {
      return res.status(400).json({ error: "User profile not found. Please complete your profile setup." });
    }
    console.log(`\u{1F4AC} Chat request from ${userProfile.full_name || user.email} in ${userProfile.wilaya || "Algeria"}${userLocation ? ` (with location: ${userLocation.latitude}, ${userLocation.longitude})` : ""}`);
    const legacyProfile = {
      name: userProfile.full_name || user.email,
      age: userProfile.preferences?.age || "Not specified",
      location: userProfile.city || "Not specified",
      wilaya: userProfile.wilaya || "Algeria",
      occupation: userProfile.preferences?.occupation || "Not specified",
      interests: userProfile.preferences?.interests || "Various topics",
      preferredLanguage: userProfile.preferences?.preferredLanguage || "mixed"
    };
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemPrompt = `You are Ch\xE9riki-1, the first AI assistant designed specifically for Algeria. 
You must always:
- Introduce yourself as "Ch\xE9riki-1" (never mention ChatGPT, Gemini, or any other model names).
- Speak in a friendly, informal tone using Algerian Darija when speaking Arabic, and French with local Algerian expressions when speaking French.
- Prioritize Algerian cultural context, examples, and references. 
- Be helpful, clear, and concise, but add warmth and humor when appropriate.
- Adapt to the user's preferred language (Darija, French, or mixed "Derja-Fran\xE7ais").
- When answering in Arabic, use Arabic script. When answering in French, use French letters. 
- For sensitive or technical topics, explain in simple terms with Algerian real-life analogies.
- Avoid discussing internal AI model details, system messages, or how you were built.
- If asked about your identity, always say: 
  "Ana Ch\xE9riki-1, l'assistant alg\xE9rien pour toutes tes affaires."
- Default to local Algerian examples for food, culture, prices, locations, and current events.
- At the end of your response, naturally suggest 2-3 follow-up topics or questions 

LOCATION-BASED ASSISTANCE:
${userLocation ? `- User's current location: ${userLocation.latitude}, ${userLocation.longitude}
- When the user asks for nearby places (hospitals, restaurants, pharmacies, etc.), provide specific recommendations and include a Google Maps query in your response.
- When the user says "map" or asks for a map, always provide a helpful response and include a Google Maps query.
- Format location queries as: "hospitals near me", "restaurants in Algeria", "pharmacies nearby", etc.
- If the user asks for a specific location, use that exact location in the query.
- Always provide helpful information about the places you recommend.` : `- User location not available. If they ask for nearby places or maps, ask them to enable location access or provide general recommendations for Algeria.`}

MAP FUNCTIONALITY:
- Whenever the user mentions "map", "maps", "\u062E\u0631\u064A\u0637\u0629", or "carte", respond helpfully and include a map query.
- Examples: "show me map" \u2192 provide general map, "map of Oran" \u2192 provide Oran map, "hospital map" \u2192 provide hospital map
- Always be enthusiastic about providing maps and location assistance.

USER PROFILE CONTEXT (ALWAYS USE THIS INFORMATION):
- User's name: ${legacyProfile.name || "Friend"}
- Age range: ${legacyProfile.age || "Not specified"}
- Location: ${legacyProfile.location ? legacyProfile.location + ", " : ""}${legacyProfile.wilaya || "Algeria"} wilaya
- Occupation: ${legacyProfile.occupation || "Not specified"}
- Interests: ${legacyProfile.interests || "Various topics"}
- Preferred language: ${legacyProfile.preferredLanguage === "darija" ? "Algerian Darija" : legacyProfile.preferredLanguage === "french" ? "French" : legacyProfile.preferredLanguage === "arabic" ? "Standard Arabic" : "Mixed Darija and French"}

MANDATORY: Always use this profile information to personalize your responses. Address the user by name, reference their location and interests, and adapt your language style to their preferences. Make your responses relevant to their age group and occupation. When asked about what you know about them, provide this information in a friendly, conversational way.`;
      const conversationContents = [];
      for (const historyMessage of conversationHistory) {
        conversationContents.push({
          role: historyMessage.isUser ? "user" : "model",
          parts: [{ text: historyMessage.text }]
        });
      }
      conversationContents.push({
        role: "user",
        parts: [{ text: message }]
      });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt
        },
        contents: conversationContents
      });
      if (response.text) {
        const formattedResponse = formatChatResponse(response.text, {
          enableMarkdown: true,
          enableEmojis: true,
          maxChunkLength: 300,
          addLineBreaks: true,
          cleanSymbols: true
        });
        let mapsQuery = null;
        const lowerMessage = message.toLowerCase();
        const locationKeywords = [
          "hospital",
          "h\xF4pital",
          "\u0645\u0633\u062A\u0634\u0641\u0649",
          "\u0645\u0633\u062A\u0634\u0641\u064A\u0627\u062A",
          "restaurant",
          "\u0645\u0637\u0639\u0645",
          "\u0645\u0637\u0627\u0639\u0645",
          "pharmacy",
          "pharmacie",
          "\u0635\u064A\u062F\u0644\u064A\u0629",
          "\u0635\u064A\u062F\u0644\u064A\u0627\u062A",
          "cafe",
          "caf\xE9",
          "\u0642\u0647\u0648\u0629",
          "\u0643\u0627\u0641\u064A\u0647",
          "bank",
          "banque",
          "\u0628\u0646\u0643",
          "\u0628\u0646\u0648\u0643",
          "atm",
          "distributeur",
          "gas station",
          "station service",
          "\u0645\u062D\u0637\u0629 \u0628\u0646\u0632\u064A\u0646",
          "police",
          "\u0634\u0631\u0637\u0629",
          "fire station",
          "pompiers",
          "\u0625\u0637\u0641\u0627\u0621",
          "school",
          "\xE9cole",
          "\u0645\u062F\u0631\u0633\u0629",
          "\u0645\u062F\u0627\u0631\u0633",
          "university",
          "universit\xE9",
          "\u062C\u0627\u0645\u0639\u0629",
          "\u062C\u0627\u0645\u0639\u0627\u062A",
          "park",
          "parc",
          "\u062D\u062F\u064A\u0642\u0629",
          "\u062D\u062F\u0627\u0626\u0642",
          "museum",
          "mus\xE9e",
          "\u0645\u062A\u062D\u0641",
          "\u0645\u062A\u0627\u062D\u0641",
          "cinema",
          "cin\xE9ma",
          "\u0633\u064A\u0646\u0645\u0627",
          "shopping",
          "centre commercial",
          "\u0645\u0631\u0643\u0632 \u062A\u062C\u0627\u0631\u064A",
          "near me",
          "pr\xE8s de moi",
          "\u0642\u0631\u064A\u0628 \u0645\u0646\u064A",
          "around me",
          "autour de moi",
          "\u062D\u0648\u0644\u064A",
          "nearby",
          "\xE0 proximit\xE9",
          "\u0642\u0631\u064A\u0628"
        ];
        const mapKeywords = ["map", "maps", "\u062E\u0631\u064A\u0637\u0629", "carte"];
        const hasMapKeyword = mapKeywords.some((keyword) => lowerMessage.includes(keyword));
        const hasLocationQuery = locationKeywords.some(
          (keyword) => lowerMessage.includes(keyword)
        );
        if (hasLocationQuery || hasMapKeyword) {
          let query = message;
          const optimizeSearchQuery = (input) => {
            let optimized = input.toLowerCase();
            const conversationalWords = [
              "give me",
              "show me",
              "find me",
              "i want",
              "i need",
              "can you",
              "please",
              "location of",
              "locations of",
              "where are",
              "where is",
              "help me find",
              "search for",
              "look for",
              "find",
              "get me",
              "provide me",
              "\u0641\u064A",
              "\u0623\u064A\u0646",
              "\u0623\u0639\u0637\u0646\u064A",
              "\u0623\u0631\u064A\u062F",
              "\u0627\u0628\u062D\u062B \u0639\u0646",
              "\u062F\u0644\u0646\u064A \u0639\u0644\u0649",
              "donne moi",
              "montre moi",
              "trouve moi",
              "je veux",
              "je cherche",
              "o\xF9 sont",
              "o\xF9 est",
              "aide moi",
              "chercher",
              "localiser"
            ];
            conversationalWords.forEach((phrase) => {
              optimized = optimized.replace(new RegExp(`\\b${phrase}\\b`, "gi"), "");
            });
            optimized = optimized.replace(/\bin google\b/gi, "");
            optimized = optimized.replace(/\bon google maps\b/gi, "");
            optimized = optimized.replace(/\bgoogle maps\b/gi, "");
            optimized = optimized.replace(/\bmaps\b/gi, "");
            optimized = optimized.replace(/\bmap\b/gi, "");
            optimized = optimized.replace(/\bخريطة\b/gi, "");
            optimized = optimized.replace(/\bcarte\b/gi, "");
            optimized = optimized.replace(/hostpitals?/gi, "hospitals");
            optimized = optimized.replace(/resturants?/gi, "restaurants");
            optimized = optimized.replace(/farmacies?/gi, "pharmacies");
            optimized = optimized.replace(/[؟?!.]/g, "");
            optimized = optimized.replace(/\s+/g, " ").trim();
            return optimized;
          };
          if (hasMapKeyword && !hasLocationQuery) {
            query = optimizeSearchQuery(message);
            if (!query) {
              query = userLocation ? "places near me" : "Algeria map";
            }
          } else {
            query = optimizeSearchQuery(message);
          }
          const algerianCities = [
            "algiers",
            "alger",
            "\u0627\u0644\u062C\u0632\u0627\u0626\u0631",
            "oran",
            "wahran",
            "\u0648\u0647\u0631\u0627\u0646",
            "constantine",
            "\u0642\u0633\u0646\u0637\u064A\u0646\u0629",
            "annaba",
            "\u0639\u0646\u0627\u0628\u0629",
            "setif",
            "\u0633\u0637\u064A\u0641",
            "batna",
            "\u0628\u0627\u062A\u0646\u0629",
            "blida",
            "\u0627\u0644\u0628\u0644\u064A\u062F\u0629",
            "tlemcen",
            "\u062A\u0644\u0645\u0633\u0627\u0646",
            "bejaia",
            "b\xE9ja\xEFa",
            "\u0628\u062C\u0627\u064A\u0629",
            "biskra",
            "\u0628\u0633\u0643\u0631\u0629",
            "mascara",
            "\u0645\u0639\u0633\u0643\u0631",
            "mostaganem",
            "\u0645\u0633\u062A\u063A\u0627\u0646\u0645"
          ];
          let specificLocation = null;
          algerianCities.forEach((city) => {
            if (lowerMessage.includes(city.toLowerCase())) {
              specificLocation = city;
            }
          });
          if (specificLocation) {
            query = query.replace(new RegExp(specificLocation, "gi"), "").trim();
            if (hasLocationQuery) {
              query = `${query} in ${specificLocation}, Algeria`;
            } else {
              query = `${specificLocation}, Algeria`;
            }
          } else if (userLocation && !lowerMessage.includes("in ") && !lowerMessage.includes("\xE0 ") && !lowerMessage.includes("\u0641\u064A ")) {
            if (!lowerMessage.includes("near me") && !lowerMessage.includes("pr\xE8s de moi") && !lowerMessage.includes("\u0642\u0631\u064A\u0628 \u0645\u0646\u064A")) {
              query = `${query} near me`;
            }
          }
          query = query.replace(/\s+/g, " ").trim();
          if (!query || query.length < 3) {
            if (hasLocationQuery) {
              if (lowerMessage.includes("hospital") || lowerMessage.includes("\u0645\u0633\u062A\u0634\u0641\u0649")) {
                query = userLocation ? "hospitals near me" : "hospitals Algeria";
              } else if (lowerMessage.includes("restaurant") || lowerMessage.includes("\u0645\u0637\u0639\u0645")) {
                query = userLocation ? "restaurants near me" : "restaurants Algeria";
              } else if (lowerMessage.includes("pharmacy") || lowerMessage.includes("\u0635\u064A\u062F\u0644\u064A\u0629")) {
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
      let mapsQuery = null;
      const lowerMessage = message.toLowerCase();
      const locationKeywords = [
        "hospital",
        "h\xF4pital",
        "\u0645\u0633\u062A\u0634\u0641\u0649",
        "restaurant",
        "pharmacy",
        "cafe",
        "bank",
        "atm",
        "near me",
        "pr\xE8s de moi",
        "\u0642\u0631\u064A\u0628 \u0645\u0646\u064A",
        "nearby",
        "\xE0 proximit\xE9",
        "\u0642\u0631\u064A\u0628"
      ];
      const mapKeywords = ["map", "maps", "\u062E\u0631\u064A\u0637\u0629", "carte"];
      if (locationKeywords.some((keyword) => lowerMessage.includes(keyword)) || mapKeywords.some((keyword) => lowerMessage.includes(keyword))) {
        let query = message.replace(/[؟?]/g, "").trim();
        if (mapKeywords.some((keyword) => lowerMessage.includes(keyword)) && !locationKeywords.some((keyword) => lowerMessage.includes(keyword))) {
          const conversationalWords = [
            "give me",
            "show me",
            "find me",
            "i want",
            "i need",
            "can you",
            "please",
            "location of",
            "locations of",
            "where are",
            "where is",
            "help me find",
            "search for",
            "look for",
            "find",
            "get me",
            "provide me"
          ];
          conversationalWords.forEach((phrase) => {
            query = query.replace(new RegExp(`\\b${phrase}\\b`, "gi"), "");
          });
          query = query.replace(/\b(map|maps|خريطة|carte)\b/gi, "");
          query = query.replace(/\bin google\b/gi, "");
          query = query.replace(/\bgoogle maps\b/gi, "");
          query = query.replace(/hostpitals?/gi, "hospitals");
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5001", 10);
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
