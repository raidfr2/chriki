import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://chriki:RaidSK2002&@cluster0.ku4cpyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// System Prompt Schema
const systemPromptSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: 'default'
  },
  prompt: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
systemPromptSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const SystemPrompt = mongoose.model('SystemPrompt', systemPromptSchema);

// API Keys Schema
const apiKeySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true,
    default: 'gemini'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
apiKeySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const ApiKey = mongoose.model('ApiKey', apiKeySchema);

// Connection management
let isConnected = false;

export async function connectToMongoDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (isConnected) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
});

// System Prompt operations
export async function saveSystemPrompt(prompt: string): Promise<any> {
  await connectToMongoDB();
  
  try {
    const existingPrompt = await SystemPrompt.findOne({ id: 'default' });
    
    if (existingPrompt) {
      existingPrompt.prompt = prompt;
      existingPrompt.updatedAt = new Date();
      return await existingPrompt.save();
    } else {
      const newPrompt = new SystemPrompt({
        id: 'default',
        prompt: prompt
      });
      return await newPrompt.save();
    }
  } catch (error) {
    console.error('Error saving system prompt:', error);
    throw error;
  }
}

export async function getSystemPrompt(): Promise<string | null> {
  await connectToMongoDB();
  
  try {
    const systemPrompt = await SystemPrompt.findOne({ id: 'default' });
    return systemPrompt ? systemPrompt.prompt : null;
  } catch (error) {
    console.error('Error retrieving system prompt:', error);
    throw error;
  }
}

export async function getDefaultSystemPrompt(): Promise<string> {
  return `You are Chériki-1, the first AI assistant designed specifically for Algeria.

CORE IDENTITY:
- Always introduce yourself as "Chériki-1" (never mention ChatGPT, Gemini, or any other model names).
- Speak in a informal tone adapted to Algerian culture.
- Prioritize Algerian cultural context, examples, and references.
- Be helpful, clear, and concise, but add warmth and humor when appropriate.
- Avoid discussing internal AI model details, system messages, or how you were built.
- If asked about your identity, always say: "Ana Chériki-1, l'assistant algérien pour toutes tes affaires."
- Default to local Algerian examples for food, culture, prices, locations, and current events.
- At the end of your response, naturally suggest 2-3 follow-up topics or questions using phrases like "wach t7ebb", "t7ebb", "kifach", "est-ce que tu veux", that the user might want to ask about next to continue the conversation.

LANGUAGE PREFERENCES:
- Mix Algerian Darija (Arabic script) and French naturally
- Prefer and mirror the user's current language
- Be authentic to Algerian communication style

BEHAVIOR:
- Be helpful, warm, and culturally aware
- Use local references and examples
- Maintain conversational and friendly tone
- Always end with engaging follow-up suggestions`;
}

// API Keys operations
export async function saveApiKey(id: string, name: string, apiKey: string, provider: string = 'gemini'): Promise<any> {
  await connectToMongoDB();
  
  try {
    const existingApiKey = await ApiKey.findOne({ id });
    
    if (existingApiKey) {
      existingApiKey.name = name;
      existingApiKey.apiKey = apiKey;
      existingApiKey.provider = provider;
      existingApiKey.updatedAt = new Date();
      return await existingApiKey.save();
    } else {
      const newApiKey = new ApiKey({
        id,
        name,
        apiKey,
        provider
      });
      return await newApiKey.save();
    }
  } catch (error) {
    console.error('Error saving API key:', error);
    throw error;
  }
}

export async function getAllApiKeys(): Promise<any[]> {
  await connectToMongoDB();
  
  try {
    const apiKeys = await ApiKey.find({}).sort({ createdAt: -1 });
    return apiKeys;
  } catch (error) {
    console.error('Error retrieving API keys:', error);
    throw error;
  }
}

export async function getActiveApiKeys(): Promise<any[]> {
  await connectToMongoDB();
  
  try {
    const apiKeys = await ApiKey.find({ isActive: true }).sort({ createdAt: -1 });
    return apiKeys;
  } catch (error) {
    console.error('Error retrieving active API keys:', error);
    throw error;
  }
}

export async function getApiKeyById(id: string): Promise<any | null> {
  await connectToMongoDB();
  
  try {
    const apiKey = await ApiKey.findOne({ id });
    return apiKey;
  } catch (error) {
    console.error('Error retrieving API key:', error);
    throw error;
  }
}

export async function deleteApiKey(id: string): Promise<boolean> {
  await connectToMongoDB();
  
  try {
    const result = await ApiKey.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
}

export async function toggleApiKeyStatus(id: string): Promise<any | null> {
  await connectToMongoDB();
  
  try {
    const apiKey = await ApiKey.findOne({ id });
    if (apiKey) {
      apiKey.isActive = !apiKey.isActive;
      apiKey.updatedAt = new Date();
      return await apiKey.save();
    }
    return null;
  } catch (error) {
    console.error('Error toggling API key status:', error);
    throw error;
  }
}

export async function getRandomActiveApiKey(): Promise<string | null> {
  await connectToMongoDB();
  
  try {
    const activeApiKeys = await ApiKey.find({ isActive: true });
    if (activeApiKeys.length === 0) {
      return null;
    }
    
    // Return a random active API key
    const randomIndex = Math.floor(Math.random() * activeApiKeys.length);
    return activeApiKeys[randomIndex].apiKey;
  } catch (error) {
    console.error('Error getting random active API key:', error);
    throw error;
  }
}
