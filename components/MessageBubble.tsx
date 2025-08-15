import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Message } from '@/types/message';
import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react-native';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
          {message.text}
        </Text>
      </View>
      {!isUser && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Copy size={14} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ThumbsUp size={14} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ThumbsDown size={14} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 6,
  },
  aiBubble: {
    backgroundColor: '#F8F9FA',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#000000',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 4,
  },
  actionButton: {
    padding: 6,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#F2F2F7',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    marginHorizontal: 4,
  },
});