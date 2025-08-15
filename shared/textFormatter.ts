// Text formatting utilities for better readability in chat responses

export interface FormattedMessage {
  chunks: string[];
  hasFormatting: boolean;
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

// Main formatting function that applies all transformations
export function formatChatResponse(
  rawText: string, 
  options: Partial<FormatOptions> = {}
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
  
  return {
    chunks,
    hasFormatting: chunks.length > 1 || processedText !== rawText
  };
}

// Utility to render markdown-like text to HTML for display
export function renderFormattedText(text: string): string {
  return text
    // Convert markdown bold to HTML
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert markdown italic to HTML  
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert line breaks to HTML
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}