import { Message } from '@/types/message';

// Store for API key (in a real app, use secure storage)
let googleApiKey = '';

export const setGoogleApiKey = (key: string) => {
  googleApiKey = key;
};

export const getGoogleApiKey = () => {
  return googleApiKey;
};

// Mock AI responses for demonstration
const mockResponses = [
  "I'm here to help! What would you like to know?",
  "That's an interesting question. Let me think about that for a moment.",
  "I understand what you're asking. Here's my perspective on that topic.",
  "Great question! I'd be happy to help you with that.",
  "That's a complex topic. Let me break it down for you.",
  "I see what you mean. Here's how I would approach that.",
  "Thanks for sharing that with me. I think I can help.",
  "That reminds me of something important I should mention.",
  "I appreciate you asking. Let me give you a detailed response.",
  "Based on what you've told me, here's what I think would be best."
];

export const generateAIResponse = async (userMessage: string): Promise<string> => {
  // Simulate AI thinking time
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Check if Google API key is configured
  if (!googleApiKey) {
    return "Please configure your Google API key in Settings to enable AI responses.";
  }
  
  // Simple keyword-based responses for better demo
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm your AI assistant. How can I help you today?";
  }
  
  if (lowerMessage.includes('how are you')) {
    return "I'm doing well, thank you for asking! I'm here and ready to assist you with any questions or tasks you might have.";
  }
  
  if (lowerMessage.includes('what') && lowerMessage.includes('name')) {
    return "I'm an AI assistant created to help you with various tasks and answer your questions. You can call me Assistant!";
  }
  
  if (lowerMessage.includes('help')) {
    return "I'd be happy to help! I can assist you with answering questions, providing information, helping with writing, problem-solving, and much more. What specific topic would you like help with?";
  }
  
  // Return a random response for other messages
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};