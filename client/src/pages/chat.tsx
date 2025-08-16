import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { renderFormattedText, getTextDirection, type FormattedMessage } from "@shared/textFormatter";
import FormattedMessageComponent from "@/components/FormattedMessage";
import SuggestionButtons from "@/components/SuggestionButtons";


interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  chunks?: string[];
  isFormatted?: boolean;
  suggestions?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}

export default function Chat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [inputValue, setInputValue] = useState(""); // State for input value

  // Generate a chat title based on the first user message
  const generateChatTitle = (firstMessage: string): string => {
    const truncated = firstMessage.length > 30 ? firstMessage.substring(0, 30) + "..." : firstMessage;
    return truncated || "New Chat";
  };

  // Load saved chat sessions on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("chriki_chat_sessions");
    const savedCurrentId = localStorage.getItem("chriki_current_session");

    if (savedSessions) {
      try {
        const parsed: ChatSession[] = JSON.parse(savedSessions);
        // Convert timestamp strings back to Date objects
        const sessionsWithDates = parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          lastActivity: new Date(session.lastActivity),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatSessions(sessionsWithDates);

        // Load the current session or the most recent one
        const sessionIdToLoad = savedCurrentId || (sessionsWithDates.length > 0 ? sessionsWithDates[0].id : "");
        if (sessionIdToLoad) {
          const currentSession = sessionsWithDates.find(s => s.id === sessionIdToLoad);
          if (currentSession) {
            setMessages(currentSession.messages);
            setCurrentSessionId(sessionIdToLoad);
          } else {
            // Create new session if saved session not found
            createNewChat();
          }
        } else {
          createNewChat();
        }
      } catch (error) {
        console.error("Failed to load saved sessions:", error);
        localStorage.removeItem("chriki_chat_sessions");
        localStorage.removeItem("chriki_current_session");
        createNewChat();
      }
    } else {
      // Create initial chat session
      createNewChat();
    }
  }, []);

  // Save current session whenever messages change, but only if user has sent at least one message
  useEffect(() => {
    if (messages.length > 1 && currentSessionId) { // Changed from > 0 to > 1 to require user interaction
      // Check if there's at least one user message
      const hasUserMessage = messages.some(msg => msg.isUser);

      if (hasUserMessage) {
        const updatedSessions = chatSessions.map(session => {
          if (session.id === currentSessionId) {
            return {
              ...session,
              messages,
              lastActivity: new Date(),
              // Update title based on first user message if not already set
              title: session.title === "New Chat" && messages.length > 1 && messages[1]?.isUser
                ? generateChatTitle(messages[1].text)
                : session.title
            };
          }
          return session;
        });

        setChatSessions(updatedSessions);
        localStorage.setItem("chriki_chat_sessions", JSON.stringify(updatedSessions));
        localStorage.setItem("chriki_current_session", currentSessionId);
      }
    }
  }, [messages, currentSessionId]);

  // Create a new chat session (but don't save to localStorage until user sends a message)
  const createNewChat = () => {
    const newSessionId = `chat_${Date.now()}`;
    const welcomeMessage: Message = {
      id: 1,
      text: "Ahla w sahla! Ana Chriki, l'assistant mte3k l'Algérien. Kifach nesta3lek?",
      isUser: false,
      timestamp: new Date(),
    };

    // Don't add to chatSessions or save to localStorage yet - wait for user interaction
    setMessages([welcomeMessage]);
    setCurrentSessionId(newSessionId);
    setShowSidebar(false);

    // Only save current session ID temporarily
    localStorage.setItem("chriki_current_session", newSessionId);

    toast({
      title: "New chat started",
      description: "Started a fresh conversation with Chriki.",
    });
  };

  // Switch to a different chat session
  const switchToSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
      setShowSidebar(false);
      localStorage.setItem("chriki_current_session", sessionId);
    }
  };

  // Delete a chat session
  const deleteSession = (sessionId: string) => {
    const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(updatedSessions);
    localStorage.setItem("chriki_chat_sessions", JSON.stringify(updatedSessions));

    if (sessionId === currentSessionId) {
      if (updatedSessions.length > 0) {
        switchToSession(updatedSessions[0].id);
      } else {
        createNewChat();
      }
    }

    toast({
      title: "Chat deleted",
      description: "Chat session has been removed.",
    });
  };

  const [isTyping, setIsTyping] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get response from Gemini API or fallback to sample responses
  const getChirikiResponse = async (userMessage: string, conversationHistory: Message[]): Promise<{text: string, formatted?: FormattedMessage}> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.map(msg => ({
            text: msg.text,
            isUser: msg.isUser
          }))
        }),
      });

      if (response.ok) {
        const data = await response.json();

        return {
          text: data.response,
          formatted: data.formatted
        };
      }
    } catch (error) {
      console.error("Failed to get API response:", error);
    }

    // Fallback to sample responses in Algerian dialect
    const lowerMessage = userMessage.toLowerCase();
    let fallbackText = "";

    if (lowerMessage.includes("salam") || lowerMessage.includes("ahla")) {
      fallbackText = "Wa alaykum salam khoya! Labas? Kifach n9eder n3awnek lyoum?";
    } else if (lowerMessage.includes("kifach") || lowerMessage.includes("comment")) {
      fallbackText = "Bsit! Goulili kén wach t7ebb ta3mel w ana nwarilek ta9a.";
    } else if (lowerMessage.includes("restaurant") || lowerMessage.includes("makla")) {
      fallbackText = "Ah makla! Fi Alger andi barsha restaurants bzef. T7ebb occidental wala traditionnel?";
    } else if (lowerMessage.includes("météo") || lowerMessage.includes("jaw")) {
      fallbackText = "Lyoum l'jaw 3adi, ma kansh 7arr bzef. T7ebb t5rej fi weekend?";
    } else if (lowerMessage.includes("merci") || lowerMessage.includes("choukran")) {
      fallbackText = "3afwan khoya! Daymen mawjoud bech n3awnek. Wach andi chi 7aja o5ra?";
    } else if (lowerMessage.includes("prix") || lowerMessage.includes("price")) {
      fallbackText = "Les prix? Ça dépend wach t7ebb. Goulili kén budget mte3k w ana ndirlék suggestions.";
    } else if (lowerMessage.includes("weekend") || lowerMessage.includes("sortie")) {
      fallbackText = "Weekend? Maliche! Fi Alger andi barsha l7oulet: cinéma, cafés, parcs... Wach t7ebb ta3mel?";
    } else {
      // Default responses
      const defaultResponses = [
        "Hmm, ma fahemtch bien. Tnajem t3awdeli bi darija dyalna?",
        "Ah wach t9oul! Ana malaqi, explain liya akther bech nfahem.",
        "Intéressant! Goulili akther 3la hadhi l7kaya.",
        "Maliche khoya, nfahem. Wach thebb n3awnek fi 7aja o5ra?",
        "Bsit! Ena ndoublizi, wach rak t7ebb exactly?",
      ];
      fallbackText = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    return { text: fallbackText };
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault(); // Prevent default form submission if called from form
    if (!inputValue.trim()) return;

    setIsLoading(true); // Set loading state

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    // Check if this is the first user message and we need to create the session
    const isFirstUserMessage = messages.length === 1 && !messages.some(msg => msg.isUser);

    if (isFirstUserMessage) {
      // This is the first user message, so now we create and save the session
      const newSession: ChatSession = {
        id: currentSessionId,
        title: "New Chat",
        messages: messages, // Include the welcome message
        createdAt: new Date(),
        lastActivity: new Date()
      };

      const updatedSessions = [newSession, ...chatSessions];
      setChatSessions(updatedSessions);
      localStorage.setItem("chriki_chat_sessions", JSON.stringify(updatedSessions));
      localStorage.setItem("chriki_current_session", currentSessionId);
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputValue(""); // Clear input after adding message

    // Get bot response
    const getBotResponse = async () => {
      const currentMessages = [...messages, userMessage]; // Use state before update
      const response = await getChirikiResponse(inputValue, currentMessages);

      const botResponse: Message = {
        id: Date.now() + 1,
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        chunks: response.formatted?.chunks,
        isFormatted: response.formatted?.hasFormatting,
        suggestions: response.formatted?.suggestions
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false); // Reset loading state
    };

    // Simulate delay then get response
    setTimeout(getBotResponse, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearAllChats = () => {
    setChatSessions([]);
    setMessages([]);
    setCurrentSessionId("");
    localStorage.removeItem("chriki_chat_sessions");
    localStorage.removeItem("chriki_current_session");
    localStorage.removeItem("chriki_conversation"); // Remove old storage format
    createNewChat();
    toast({
      title: "All chats cleared",
      description: "All chat history has been removed.",
    });
  };

  // Copy message to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Regenerate response for a message
  const regenerateResponse = async (messageId: number) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    // Find the user message that prompted this bot response
    let userMessageText = "";
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].isUser) {
        userMessageText = messages[i].text;
        break;
      }
    }

    if (!userMessageText) return;

    // Remove all messages after and including the bot message we're regenerating
    const newMessages = messages.slice(0, messageIndex);
    setMessages(newMessages);
    setIsTyping(true); // Indicate typing

    // Get new bot response
    const getBotResponse = async () => {
      const response = await getChirikiResponse(userMessageText, newMessages);

      const botResponse: Message = {
        id: Date.now() + 1,
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        chunks: response.formatted?.chunks,
        isFormatted: response.formatted?.hasFormatting,
        suggestions: response.formatted?.suggestions
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false); // Stop typing indicator
    };

    // Simulate delay then get response
    setTimeout(getBotResponse, 1500 + Math.random() * 1000);
  };

  // Start editing a chat title
  const startEditingTitle = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
  };

  // Save edited title
  const saveEditedTitle = (sessionId: string) => {
    if (!editingTitle.trim()) {
      setEditingSessionId(null);
      return;
    }

    const updatedSessions = chatSessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          title: editingTitle.trim()
        };
      }
      return session;
    });

    setChatSessions(updatedSessions);
    localStorage.setItem("chriki_chat_sessions", JSON.stringify(updatedSessions));
    setEditingSessionId(null);
    setEditingTitle("");

    toast({
      title: "Chat renamed",
      description: "Chat title has been updated",
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSessionId(null);
    setEditingTitle("");
  };

  // Handle key press in edit mode
  const handleEditKeyPress = (e: React.KeyboardEvent, sessionId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEditedTitle(sessionId);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="font-sans bg-background text-foreground h-screen flex">

      {/* Sidebar for Chat Sessions */}
      {showSidebar && (
        <div className="w-80 bg-muted border-r-2 border-foreground flex flex-col">
          <div className="p-4 border-b-2 border-border">
            <h3 className="font-mono font-bold text-lg">CHAT HISTORY</h3>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              {chatSessions.length} session{chatSessions.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatSessions.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">No chat sessions yet</p>
                <Button
                  onClick={createNewChat}
                  variant="outline"
                  size="sm"
                  className="mt-2 font-mono text-xs"
                >
                  START FIRST CHAT
                </Button>
              </div>
            ) : (
              <div className="p-2">
                {chatSessions
                  .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
                  .map((session) => (
                    <div
                      key={session.id}
                      className={`p-3 mb-2 rounded border cursor-pointer transition-colors ${
                        session.id === currentSessionId
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-background border-border hover:bg-muted'
                      }`}
                      onClick={() => switchToSession(session.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          {editingSessionId === session.id ? (
                            <Input
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={(e) => handleEditKeyPress(e, session.id)}
                              onBlur={() => saveEditedTitle(session.id)}
                              className="font-mono text-sm font-medium h-6 px-1 py-0 border-0 bg-white text-black focus:bg-white focus:border focus:border-foreground"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                              data-testid={`input-rename-${session.id}`}
                            />
                          ) : (
                            <p className="font-mono text-sm font-medium truncate">
                              {session.title}
                            </p>
                          )}
                          <p className="text-xs opacity-60 mt-1">
                            {session.lastActivity.toLocaleDateString()} • {session.messages.length} messages
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {editingSessionId === session.id ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  saveEditedTitle(session.id);
                                }}
                                className="text-xs opacity-70 hover:opacity-100 p-1"
                                title="Save"
                                data-testid={`button-save-${session.id}`}
                              >
                                ✓
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cancelEditing();
                                }}
                                className="text-xs opacity-70 hover:opacity-100 p-1"
                                title="Cancel"
                                data-testid={`button-cancel-${session.id}`}
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditingTitle(session.id, session.title);
                                }}
                                className="text-xs opacity-50 hover:opacity-100 p-1"
                                title="Rename chat"
                                data-testid={`button-rename-${session.id}`}
                              >
                                ✏
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSession(session.id);
                                }}
                                className="text-xs opacity-50 hover:opacity-100 p-1"
                                title="Delete chat"
                                data-testid={`button-delete-${session.id}`}
                              >
                                ×
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          <div className="p-4 border-t-2 border-border">
            <Button
              onClick={createNewChat}
              className="w-full font-mono text-xs mb-2"
              size="sm"
            >
              + NEW CHAT
            </Button>
            <Button
              onClick={clearAllChats}
              variant="outline"
              className="w-full font-mono text-xs"
              size="sm"
            >
              CLEAR ALL
            </Button>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">

      {/* Header */}
      <header className="bg-background border-b-2 border-foreground px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-mono font-bold text-lg tracking-tight">CHRIKI</div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </Link>
          <div className="hidden sm:block">
            <div className="text-xs font-mono text-muted-foreground">
              // CHRIKI-1.MODEL.ACTIVE
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="font-mono text-xs"
            data-testid="button-show-chats"
          >
            CHATS
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={createNewChat}
            className="font-mono text-xs"
            data-testid="button-new-chat"
          >
            NEW
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllChats}
            className="font-mono text-xs"
            data-testid="button-clear-all"
          >
            CLEAR ALL
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs"
              data-testid="button-exit-chat"
            >
              EXIT
            </Button>
          </Link>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${message.isUser ? 'user' : 'bot'}-${message.id}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-lg relative group ${
                  message.isUser
                    ? 'bg-foreground text-background border-2 border-foreground'
                    : 'bg-muted border-2 border-border'
                }`}
                onMouseEnter={() => !message.isUser && setHoveredMessageId(message.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                {message.chunks && message.isFormatted ? (
                  <FormattedMessageComponent
                    chunks={message.chunks}
                    isFormatted={message.isFormatted}
                  />
                ) : (
                  <div
                    className="chat-message"
                    dir={getTextDirection(message.text)}
                    dangerouslySetInnerHTML={{
                      __html: renderFormattedText(message.text)
                    }}
                  />
                )}

                {/* Show suggestions for bot messages */}
                {!message.isUser && message.suggestions && (
                  <SuggestionButtons
                    suggestions={message.suggestions}
                    onSuggestionClick={(suggestion) => setInputValue(suggestion)} // Use setInputValue
                    disabled={isLoading}
                  />
                )}

                {/* Hover buttons for bot messages */}
                {!message.isUser && hoveredMessageId === message.id && (
                  <div className="absolute -top-2 right-2 flex space-x-1 z-10">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs font-mono bg-background border-foreground hover:bg-foreground hover:text-background"
                      onClick={() => copyToClipboard(message.text)}
                      data-testid={`button-copy-${message.id}`}
                    >
                      COPY
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs font-mono bg-background border-foreground hover:bg-foreground hover:text-background"
                      onClick={() => regenerateResponse(message.id)}
                      disabled={isLoading}
                      data-testid={`button-try-again-${message.id}`}
                    >
                      TRY AGAIN
                    </Button>
                  </div>
                )}

                <div className="chat-timestamp opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted border-2 border-border px-4 py-3 rounded-lg max-w-[70%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <div className="chat-timestamp opacity-60 mt-2">
                  Chriki is typing...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t-2 border-foreground bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Kteb message mte3k fi darija..."
                  className="flex-1 border-2 border-foreground font-chat text-sm h-12 pr-12"
                  disabled={isLoading}
                  data-testid="input-message"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  title="Voice message"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>

              <Button
                type="submit"
                onClick={handleSendMessage} // Explicitly call handleSendMessage
                disabled={!inputValue.trim() || isLoading}
                className="px-6 font-mono font-bold tracking-wide h-12"
                data-testid="button-send-message"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'SEND'
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Ctrl + Enter to send</span>
              <span>{inputValue.length}/1000</span>
            </div>
          </form>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-muted border-t border-border px-4 py-2">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-xs font-mono text-muted-foreground">
          <div>// STATUS: CONNECTED</div>
          <div>// MODEL: CHRIKI-1</div>
          <div>// REGION: ALGERIA.DZ</div>
        </div>
        </div>
      </div>
    </div>
  );
}