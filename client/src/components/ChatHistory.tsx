
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit3, Check, X, Plus } from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ChatHistoryProps {
  currentChatId: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatHistory({ currentChatId, onChatSelect, onNewChat }: ChatHistoryProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    // Load chats from localStorage
    const savedChats = localStorage.getItem('chriki-chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  const handleEditStart = (chat: Chat) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleEditSave = () => {
    const updatedChats = chats.map(chat => 
      chat.id === editingId ? { ...chat, title: editTitle } : chat
    );
    setChats(updatedChats);
    localStorage.setItem('chriki-chats', JSON.stringify(updatedChats));
    setEditingId(null);
  };

  const handleDelete = (chatId: string) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    localStorage.setItem('chriki-chats', JSON.stringify(updatedChats));
  };

  return (
    <div className="w-64 bg-background border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Button onClick={onNewChat} className="w-full justify-start" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Chat jdid
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-3 rounded-lg cursor-pointer mb-2 group hover:bg-muted ${
              currentChatId === chat.id ? 'bg-muted' : ''
            }`}
            onClick={() => onChatSelect(chat.id)}
          >
            {editingId === chat.id ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-sm"
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={handleEditSave}>
                  <Check className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStart(chat);
                      }}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(chat.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {chat.lastMessage}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {chat.timestamp.toLocaleDateString()}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
