// Text formatting utilities for better readability in chat responses

export interface FormattedMessage {
  chunks: string[];
  hasFormatting: boolean;
  suggestions?: string[];
}

export interface FormatOptions {
  enableMarkdown: boolean;
  enableEmojis: boolean;
  maxChunkLength: number;
  addLineBreaks: boolean;
  cleanSymbols: boolean;
}

const defaultOptions: FormatOptions = {
  enableMarkdown: true,
  enableEmojis: true,
  maxChunkLength: 300,
  addLineBreaks: true,
  cleanSymbols: true
};

// Emoji mappings for different content types
const EMOJI_MAP = {
  // Places and locations
  restaurants: "🍽️",
  restaurant: "🍽️", 
  makla: "🍽️",
  food: "🍽️",
  
  // Geography
  oran: "📍",
  alger: "📍", 
  algiers: "📍",
  constantine: "📍",
  setif: "📍",
  annaba: "📍",
  
  // Weather
  météo: "🌤️",
  weather: "🌤️",
  jaw: "🌤️",
  rain: "🌧️",
  sun: "☀️",
  
  // Beaches and tourism
  beach: "🏖️",
  plage: "🏖️",
  sea: "🌊",
  bahr: "🌊",
  
  // Transportation
  transport: "🚌",
  bus: "🚌",
  metro: "🚇",
  taxi: "🚕",
  
  // Money and shopping
  prix: "💰",
  price: "💰",
  shopping: "🛍️",
  
  // Greetings and emotions
  salam: "👋",
  ahla: "👋",
  merci: "🙏",
  choukran: "🙏",
  
  // Time
  time: "⏰",
  wa9t: "⏰",
  today: "📅",
  lyoum: "📅"
};

// Clean raw API text by removing unwanted symbols and normalizing spaces
export function cleanRawText(text: string, options: FormatOptions = defaultOptions): string {
  if (!options.cleanSymbols) return text;
  
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Clean up common API artifacts
    .replace(/\*\*/g, '**') // Normalize markdown bold
    .replace(/\*([^*]+)\*/g, '*$1*') // Normalize markdown italics
    // Remove redundant punctuation
    .replace(/\.{3,}/g, '...')
    .replace(/!{2,}/g, '!')
    .replace(/\?{2,}/g, '?')
    // Normalize Arabic/French mixed text spacing
    .replace(/([a-zA-Z])([أ-ي])/g, '$1 $2')
    .replace(/([أ-ي])([a-zA-Z])/g, '$1 $2')
    .trim();
}

// Add emojis to relevant sections of text
export function addContextualEmojis(text: string, options: FormatOptions = defaultOptions): string {
  if (!options.enableEmojis) return text;
  
  let processedText = text;
  
  // Add emojis based on keyword detection
  Object.entries(EMOJI_MAP).forEach(([keyword, emoji]) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    if (regex.test(processedText) && !processedText.includes(emoji)) {
      // Add emoji at the beginning of sentences containing the keyword
      processedText = processedText.replace(
        new RegExp(`(^|\\. )([^.]*\\b${keyword}\\b[^.]*)`, 'gi'),
        `$1${emoji} $2`
      );
    }
  });
  
  return processedText;
}

// Add strategic line breaks for better readability
export function addLineBreaks(text: string, options: FormatOptions = defaultOptions): string {
  if (!options.addLineBreaks) return text;
  
  return text
    // Break after long sentences (> 60 chars)
    .replace(/([.!?])(\s+)([A-Za-zأ-ي])/g, (match, punct, space, nextChar) => {
      const beforePunct = text.substring(0, text.indexOf(match));
      const lastSentenceStart = Math.max(
        beforePunct.lastIndexOf('.'),
        beforePunct.lastIndexOf('!'),
        beforePunct.lastIndexOf('?')
      );
      const sentenceLength = beforePunct.length - lastSentenceStart;
      
      return sentenceLength > 60 ? `${punct}\n\n${nextChar}` : match;
    })
    // Break before lists or enumerations
    .replace(/([.!?])\s+(1\.|•|-|\*)/g, '$1\n\n$2')
    // Break before conjunctions in long text
    .replace(/([.!?])\s+(Et|And|Walakin|Mais|But)/gi, '$1\n\n$2');
}

// Apply markdown formatting for emphasis
export function applyMarkdownFormatting(text: string, options: FormatOptions = defaultOptions): string {
  if (!options.enableMarkdown) return text;
  
  return text
    // Bold important terms
    .replace(/\b(Chriki|Chériki-1)\b/g, '**$1**')
    .replace(/\b(important|mhim|important)\b/gi, '**$1**')
    // Italicize place names and specific terms
    .replace(/\b(Oran|Alger|Algiers|Constantine|Sétif|Annaba)\b/g, '*$1*')
    // Format prices and numbers
    .replace(/(\d+)\s*(DA|dinars?|euros?)\b/gi, '**$1 $2**')
    // Format time expressions
    .replace(/\b(\d{1,2}:\d{2})\b/g, '**$1**');
}

// Split text into manageable chunks for better UX
export function splitIntoChunks(text: string, options: FormatOptions = defaultOptions): string[] {
  const maxLength = options.maxChunkLength;
  
  // If text is short enough, return as single chunk
  if (text.length <= maxLength) {
    return [text];
  }
  
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    // If adding this sentence would exceed limit, start new chunk
    if (currentChunk.length + sentence.length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  // Add remaining text as final chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [text];
}

// Extract suggested follow-up questions from response text
export function extractSuggestions(text: string): string[] {
  const suggestions: string[] = [];
  
  // Look for explicit suggestion patterns in the response and convert them to user questions
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
        // Clean up and format as user question
        suggestion = suggestion.replace(/[,;].*$/, ''); // Remove trailing clauses
        suggestions.push(prefix + suggestion + "?");
      }
    }
  });
  
  // If no patterns found, generate contextual suggestions based on content
  if (suggestions.length === 0) {
    if (text.toLowerCase().includes('restaurant') || text.toLowerCase().includes('makla')) {
      suggestions.push("Fin nlaga restaurants mlah 9rib meni?", "Chnouwa makla traditionnel li tensa7 biha?", "Kemma prix mte3 makla fi restaurants?");
    } else if (text.toLowerCase().includes('météo') || text.toLowerCase().includes('jaw')) {
      suggestions.push("Chnouwa l'jaw ghoudwa?", "Wach bard wela skhoun had nhar?", "Nlabas eh fi had l'jaw?");
    } else if (text.toLowerCase().includes('oran') || text.toLowerCase().includes('alger')) {
      suggestions.push("Wach andi blayess zouina fi had l'medina?", "Kifach nrouh l'centre ville?", "Chnouwa transport li y5dem mlah?");
    } else if (text.toLowerCase().includes('couscous') || text.toLowerCase().includes('chorba')) {
      suggestions.push("3allimni kifach ndir couscous?", "Wach andi recettes djazairiya o5ra?", "Chnouwa makla mte3 l'3id?");
    } else if (text.toLowerCase().includes('travail') || text.toLowerCase().includes('5edma')) {
      suggestions.push("Kifach nlaga 5edma fi dzayer?", "A3tini tips bach nekteb CV?", "Kemma salaire fi had l'5edma?");
    } else if (text.toLowerCase().includes('football') || text.toLowerCase().includes('koura')) {
      suggestions.push("Chnouwa a5bar l'équipe nationale?", "Wach match importante had semaine?", "Chkoun les joueurs li ya3jbouk?");
    } else if (text.toLowerCase().includes('université') || text.toLowerCase().includes('études')) {
      suggestions.push("Wach andi universités mlah fi dzayer?", "Kifach nekteb dossier inscription?", "Chnouwa spécialités li tansa7 biha?");
    } else if (text.toLowerCase().includes('transport') || text.toLowerCase().includes('metro')) {
      suggestions.push("Kifach ya5dem metro fi alger?", "Wach andi bus li yrouh l'centre?", "Kemma prix transport?");
    } else if (text.toLowerCase().includes('shopping') || text.toLowerCase().includes('centre commercial')) {
      suggestions.push("Fin nlaga centres commerciaux?", "Wach andi marques djazairiya mlah?", "Kifach nechri online fi dzayer?");
    } else {
      // Generic conversational suggestions that sound like natural user questions
      suggestions.push("Goulili akther 3la had l'haja", "Chnouwa 7aja o5ra mumkine ta3mil?", "Kifach mumkine nesta3lek akther?");
    }
  }
  
  return suggestions.slice(0, 3); // Limit to 3 suggestions
}

// Extract user information from conversation text
export function extractUserInfo(message: string, response: string): Partial<{
  name: string;
  location: string;
  job: string;
  hobbies: string[];
  notes: string;
}> {
  const userInfo: any = {};
  // Focus primarily on the user's message for extraction  
  const text = message.toLowerCase();
  console.log("Extracting from text:", text);
  
  // Extract name patterns  
  const namePatterns = [
    /my name is ([a-zA-Z]+)/i,
    /i'm ([a-zA-Z]+)/i,
    /je m'appelle ([a-zA-Z]+)/i,
    /ana ismî ([a-zA-Z]+)/i,
    /smiti ([a-zA-Z]+)/i,
  ];
  
  namePatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 1) {
      userInfo.name = match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
  });
  
  // Extract location patterns
  const locationPatterns = [
    /i live in ([^.!?]+)/i,
    /from ([^.!?]+)/i,
    /fi ([^.!?]+)/i,
    /j'habite à ([^.!?]+)/i,
    /ana min ([^.!?]+)/i,
    /saken fi ([^.!?]+)/i,
  ];
  
  locationPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 2) {
      userInfo.location = match[1].trim();
    }
  });
  
  // Extract job patterns
  const jobPatterns = [
    /i work as ([^.!?]+)/i,
    /my job is ([^.!?]+)/i,
    /i'm a ([^.!?]+)/i,
    /je suis ([^.!?]+)/i,
    /ana ([^.!?]+) fi/i,
    /5dami ([^.!?]+)/i,
  ];
  
  jobPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 2) {
      userInfo.job = match[1].trim();
    }
  });
  
  // Extract hobbies patterns
  const hobbies = [];
  if (text.includes('football') || text.includes('koura')) hobbies.push('Football');
  if (text.includes('music') || text.includes('musiqa')) hobbies.push('Music');
  if (text.includes('cook') || text.includes('tabe5')) hobbies.push('Cooking');
  if (text.includes('travel') || text.includes('safar')) hobbies.push('Travel');
  if (text.includes('read') || text.includes('qra')) hobbies.push('Reading');
  if (text.includes('games') || text.includes('al3ab')) hobbies.push('Gaming');
  
  if (hobbies.length > 0) {
    userInfo.hobbies = hobbies;
  }
  
  return userInfo;
}

// Main formatting function that applies all transformations
export function formatChatResponse(
  rawText: string, 
  options: Partial<FormatOptions> = {},
  includeSuggestions: boolean = true
): FormattedMessage {
  const opts = { ...defaultOptions, ...options };
  
  // Step 1: Clean raw text
  let processedText = cleanRawText(rawText, opts);
  
  // Step 2: Add line breaks for readability
  processedText = addLineBreaks(processedText, opts);
  
  // Step 3: Apply markdown formatting
  processedText = applyMarkdownFormatting(processedText, opts);
  
  // Step 4: Add contextual emojis
  processedText = addContextualEmojis(processedText, opts);
  
  // Step 5: Split into chunks
  const chunks = splitIntoChunks(processedText, opts);
  
  // Step 6: Extract suggestions if enabled
  const suggestions = includeSuggestions ? extractSuggestions(rawText) : undefined;
  
  return {
    chunks,
    hasFormatting: chunks.length > 1 || processedText !== rawText,
    suggestions
  };
}

// Detect if text contains Arabic characters
export function hasArabicText(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
}

// Detect text direction based on content
export function getTextDirection(text: string): 'ltr' | 'rtl' {
  return hasArabicText(text) ? 'rtl' : 'ltr';
}

// Utility to render markdown-like text to HTML for display
export function renderFormattedText(text: string): string {
  const direction = getTextDirection(text);
  const alignmentClass = direction === 'rtl' ? 'text-right' : 'text-left';
  
  const processedText = text
    // Convert markdown bold to HTML
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert markdown italic to HTML  
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert line breaks to HTML
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
  
  return `<div dir="${direction}" class="${alignmentClass}">${processedText}</div>`;
}