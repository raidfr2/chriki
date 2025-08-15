import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Message } from '@/types/message';
import { generateAIResponse } from '@/services/chatService';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';
import { 
  MessageSquare, 
  Lightbulb, 
  Heart, 
  BookOpen, 
  ChefHat, 
  Briefcase, 
  GraduationCap,
  Gamepad2,
  Search,
  User
} from 'lucide-react-native';

interface CategoryCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  prompt: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const categories: CategoryCard[] = [
    {
      id: '1',
      title: 'AI Generate',
      subtitle: 'Images, code, copy, and more',
      icon: <MessageSquare size={24} color="#FFFFFF" />,
      color: '#007AFF',
      prompt: 'Help me generate creative content'
    },
    {
      id: '2',
      title: 'Summarize',
      subtitle: 'Text, webpages, and files',
      icon: <BookOpen size={24} color="#FFFFFF" />,
      color: '#34C759',
      prompt: 'Help me summarize information'
    },
    {
      id: '3',
      title: 'Health',
      subtitle: 'Fitness, nutrition, and wellness',
      icon: <Heart size={24} color="#FFFFFF" />,
      color: '#FF9500',
      prompt: 'Give me health and wellness advice'
    },
    {
      id: '4',
      title: 'Translation',
      subtitle: 'Translate text and documents',
      icon: <Lightbulb size={24} color="#FFFFFF" />,
      color: '#FF3B30',
      prompt: 'Help me translate text'
    },
  ];

  const trendingPrompts = [
    { icon: '🎓', text: 'Education', category: 'Learning' },
    { icon: '🔬', text: 'Science', category: 'Research' },
    { icon: '🍳', text: 'Cooking', category: 'Lifestyle' },
    { icon: '📰', text: 'History', category: 'Knowledge' },
    { icon: '💼', text: 'Business', category: 'Professional' },
    { icon: '🎮', text: 'Fun Life', category: 'Entertainment' },
    { icon: '🏃', text: 'Sport', category: 'Fitness' },
  ];

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  const handleSendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setShowCategories(false);
    setIsTyping(true);

    try {
      const aiResponseText = await generateAIResponse(messageText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCategoryPress = (category: CategoryCard) => {
    handleSendMessage(category.prompt);
  };

  const handleTrendingPress = (prompt: any) => {
    handleSendMessage(`Tell me about ${prompt.text.toLowerCase()}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <User size={20} color="#007AFF" />
          </View>
          <Text style={styles.greeting}>Lana Alexander</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {showCategories && messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>How can I help you?</Text>
              
              <View style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryCard, { backgroundColor: category.color }]}
                    onPress={() => handleCategoryPress(category)}
                  >
                    {category.icon}
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.trendingSection}>
                <View style={styles.trendingHeader}>
                  <Text style={styles.trendingTitle}>Trending Prompt</Text>
                  <Text style={styles.seeAll}>See All</Text>
                </View>
                
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.trendingScroll}
                >
                  {trendingPrompts.map((prompt, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.trendingItem}
                      onPress={() => handleTrendingPress(prompt)}
                    >
                      <Text style={styles.trendingEmoji}>{prompt.icon}</Text>
                      <Text style={styles.trendingText}>{prompt.text}</Text>
                      <Text style={styles.trendingCategory}>{prompt.category}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
        </ScrollView>
        
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  searchButton: {
    padding: 8,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  welcomeContainer: {
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 32,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 16,
  },
  trendingSection: {
    marginTop: 8,
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  trendingScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  trendingItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  trendingEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  trendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  trendingCategory: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
    textAlign: 'center',
  },
});