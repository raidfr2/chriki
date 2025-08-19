import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { renderFormattedText, getTextDirection, type FormattedMessage } from "@shared/textFormatter";
import FormattedMessageComponent from "@/components/FormattedMessage";
import SuggestionButtons from "@/components/SuggestionButtons";
import { Settings } from "lucide-react";
import SettingsModal from "@/components/SettingsModal";
import GoogleMapsLink from "@/components/GoogleMapsLink";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "@/lib/location-context";
import { useTutorial } from "@/lib/tutorial-context";
import TutorialOverlay from "@/components/TutorialOverlay";
import LocationStatus from "@/components/LocationStatus";
import { supabase } from "@/lib/supabase";


interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  chunks?: string[];
  isFormatted?: boolean;
  suggestions?: string[];
  mapsQuery?: string;
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
  const { user, profile, session, signOut } = useAuth();
  const { location, hasLocation, getGoogleMapsUrl } = useLocation();

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('chriki-sidebar-width');
    return saved ? parseInt(saved, 10) : 320; // Default width in pixels
  });
  const [isResizing, setIsResizing] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Generate a chat title based on the first user message
  const generateChatTitle = (firstMessage: string): string => {
    const truncated = firstMessage.length > 30 ? firstMessage.substring(0, 30) + "..." : firstMessage;
    return truncated || "New Chat";
  };

  // Sidebar resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = e.clientX;
    // Set min and max width constraints
    const minWidth = 250;
    const maxWidth = 500;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add global mouse event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Save sidebar width to localStorage
  useEffect(() => {
    localStorage.setItem('chriki-sidebar-width', sidebarWidth.toString());
  }, [sidebarWidth]);

  // Check if user profile is complete and show modal if needed
  useEffect(() => {
    if (user && (!profile || !profile.full_name)) {
      // Show settings modal for new users who haven't completed their profile
      setShowSettingsModal(true);
    }
  }, [user, profile]);



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
  const [inputMessage, setInputMessage] = useState("");
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
  const getChirikiResponse = async (userMessage: string, conversationHistory: Message[]): Promise<{text: string, formatted?: FormattedMessage, mapsQuery?: string}> => {
    try {
      // Get access token from Supabase session
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        throw new Error("No authentication token available");
      }
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ 
          message: userMessage,
          conversationHistory: conversationHistory.map(msg => ({
            text: msg.text,
            isUser: msg.isUser
          })),
          userLocation: hasLocation ? {
            latitude: location?.latitude,
            longitude: location?.longitude
          } : null
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        return {
          text: data.response,
          formatted: data.formatted,
          mapsQuery: data.mapsQuery
        };
      } else if (response.status === 401) {
        throw new Error("Authentication failed. Please sign in again.");
      } else if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Bad request");
      }
    } catch (error) {
      console.error("Failed to get API response:", error);
    }
    
    // Fallback to sample responses in Algerian dialect
    const lowerMessage = userMessage.toLowerCase();
    let fallbackText = "";
    let mapsQuery = null;
    
    // Check for location-based queries and map keywords
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
    
    const mapKeywords = ['map', 'maps', 'خريطة', 'carte'];
    
    const hasLocationQuery = locationKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    const hasMapKeyword = mapKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    // Function to optimize search queries (same as server-side)
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

    // Handle map keyword or location queries
    if (hasLocationQuery || hasMapKeyword) {
      if (hasMapKeyword && !hasLocationQuery) {
        // User specifically asked for "map"
        let query = optimizeSearchQuery(userMessage);
        if (!query || query.length < 3) {
          query = hasLocation ? "places near me" : "Algeria map";
          fallbackText = hasLocation ? 
            "Ana nwarilek Google Maps bech tchouf l-7oulet l-qrib mink!" :
            "Ana nwarilek l-khariita mte3 Algeria. T7ebb t7ell location access bech nwarilek akther?";
        } else {
          fallbackText = `Ana nwarilek Google Maps l ${query}!`;
        }
        mapsQuery = query;
      } else if (hasLocationQuery) {
        if (!hasLocation) {
          fallbackText = "Ah t7ebb ta3ref 3la chi 7aja qrib mink? Khassni n3ref location mte3k bech nwarilek. T7ebb t7ell location access?";
        } else {
          // Generate appropriate response based on query type
          if (lowerMessage.includes('hospital') || lowerMessage.includes('hôpital') || lowerMessage.includes('مستشفى')) {
            fallbackText = "Ah t7ebb mustashfa! Fi Alger andi barsha l-mustashfayat bzef. Ana nwarilek Google Maps bech tchouf l-qrib mink.";
            mapsQuery = "hospitals near me";
          } else if (lowerMessage.includes('restaurant') || lowerMessage.includes('مطعم')) {
            fallbackText = "Ah makla! Fi Alger andi restaurants bzef. T7ebb traditionnel wala occidental? Ana nwarilek Google Maps.";
            mapsQuery = "restaurants near me";
          } else if (lowerMessage.includes('pharmacy') || lowerMessage.includes('pharmacie') || lowerMessage.includes('صيدلية')) {
            fallbackText = "Ah saydaliya! Fi Alger andi saydaliyat bzef. Ana nwarilek Google Maps bech tchouf l-qrib mink.";
            mapsQuery = "pharmacies near me";
          } else {
            fallbackText = "Ah t7ebb ta3ref 3la chi 7aja qrib mink! Ana nwarilek Google Maps bech tchouf.";
            mapsQuery = optimizeSearchQuery(userMessage);
            if (!mapsQuery || mapsQuery.length < 3) {
              mapsQuery = hasLocation ? "places near me" : "Algeria";
            }
          }
        }
      }
    } else if (lowerMessage.includes("salam") || lowerMessage.includes("ahla")) {
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
    
    return { text: fallbackText, mapsQuery: mapsQuery || undefined };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (!profile || !profile.full_name) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile before chatting.",
        variant: "destructive",
      });
      setShowSettingsModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
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
    }

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Get bot response (async now)
    const getBotResponse = async () => {
      const currentMessages = [...messages, userMessage];
      const response = await getChirikiResponse(inputMessage, currentMessages);
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        chunks: response.formatted?.chunks,
        isFormatted: response.formatted?.hasFormatting,
        suggestions: response.formatted?.suggestions,
        mapsQuery: response.mapsQuery
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
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
    setIsTyping(true);

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
        suggestions: response.formatted?.suggestions,
        mapsQuery: response.mapsQuery
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
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
        <div 
          className="bg-muted border-r-2 border-foreground flex flex-col animate-slide-in-left relative"
          style={{ width: `${sidebarWidth}px` }}
        >
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
                  .map((session, index) => (
                    <div
                      key={session.id}
                      className={`p-3 mb-2 rounded border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-slide-in-left ${
                        session.id === currentSessionId
                          ? 'accent-bg text-white accent-border'
                          : 'bg-background border-border hover:bg-muted'
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
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
                              className="font-mono text-sm font-medium h-6 px-1 py-0 border-0 bg-white dark:bg-gray-800 text-black dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border focus:border-foreground"
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
                                className="text-xs opacity-50 hover:opacity-100 p-1 transition-all duration-200 hover:scale-110"
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
                                className="text-xs opacity-50 hover:opacity-100 p-1 transition-all duration-200 hover:scale-110 hover:text-red-500"
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
          
          <div className="p-4 border-t-2 border-border space-y-2">
            <Button 
              onClick={createNewChat}
              className="w-full font-mono text-xs transition-all duration-200 hover:scale-105 active:scale-95 accent-bg hover:accent-bg text-white"
              size="sm"
            >
              + NEW CHAT
            </Button>

            {/* User Info with Dropdown Menu */}
            {profile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-muted/50 border border-border rounded p-3 space-y-2 cursor-pointer hover:bg-muted/70 transition-colors">
                    <div className="font-mono text-xs text-muted-foreground">SIGNED IN AS:</div>
                    <div className="font-mono text-sm font-bold">{profile.full_name || user?.email}</div>
                    <div className="font-mono text-xs text-muted-foreground opacity-60">Click for options ▼</div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 font-mono">
                  <DropdownMenuItem 
                    onClick={() => setShowSettingsModal(true)}
                    className="cursor-pointer"
                  >
                    ⚙️ Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

          </div>
          
          {/* Resize Handle */}
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-foreground/30 transition-colors group"
            onMouseDown={handleMouseDown}
          >
            <div className="w-1 h-full bg-transparent group-hover:bg-foreground/20"></div>
          </div>
        </div>
      )}
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
      
      {/* Header */}
      <header className="bg-background border-b-2 border-foreground px-4 py-3 flex items-center justify-between" data-tutorial="chat-header">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="font-mono font-bold text-lg tracking-tight transition-all duration-200 group-hover:scale-105">CHRIKI</div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
          </Link>
          <div className="hidden sm:block">
            <div className="text-xs font-mono text-muted-foreground">
              // CHRIKI-1.MODEL.ACTIVE
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Location Status for tutorial */}
          <div data-tutorial="location-status">
            <LocationStatus />
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSettingsModal(true)}
            className="font-mono text-xs transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1 accent-border hover:accent-bg hover:text-white"
            title="Settings"
            data-tutorial="settings-button"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="font-mono text-xs transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1"
            data-testid="button-show-chats"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            MENU
          </Button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-tutorial="chat-messages">
        <div className="max-w-4xl mx-auto space-y-4" data-tutorial="chat-container">

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`message-${message.isUser ? 'user' : 'bot'}-${message.id}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-lg relative group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                  message.isUser
                    ? 'accent-bg text-white border-2 accent-border hover:bg-opacity-90'
                    : 'bg-muted border-2 border-border hover:bg-opacity-80'
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
                
                {/* Google Maps Link */}
                {!message.isUser && message.mapsQuery && (
                  <div className="mt-3 max-w-full">
                    <GoogleMapsLink 
                      query={message.mapsQuery}
                      useCurrentLocation={hasLocation}
                      className="w-full"
                    />
                  </div>
                )}
                
                {/* Show suggestions for bot messages */}
                {!message.isUser && message.suggestions && (
                  <SuggestionButtons 
                    suggestions={message.suggestions}
                    onSuggestionClick={(suggestion) => setInputMessage(suggestion)}
                    disabled={isTyping}
                  />
                )}
                
                {/* Hover buttons for bot messages */}
                {!message.isUser && hoveredMessageId === message.id && (
                  <div className="absolute -top-2 right-2 flex space-x-1 z-10 animate-fade-in-scale">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs font-mono bg-background border-foreground hover:bg-foreground hover:text-background transition-all duration-200 hover:scale-105"
                      onClick={() => copyToClipboard(message.text)}
                      data-testid={`button-copy-${message.id}`}
                    >
                      COPY
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs font-mono bg-background border-foreground hover:bg-foreground hover:text-background transition-all duration-200 hover:scale-105"
                      onClick={() => regenerateResponse(message.id)}
                      disabled={isTyping}
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
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-muted border-2 accent-border px-4 py-3 rounded-lg max-w-[70%] animate-pulse">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 accent-bg rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 accent-bg rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 accent-bg rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <div className="chat-timestamp accent-text opacity-80 mt-2">
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
          <div className="flex space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Kteb message mte3k fi darija..."
              className="flex-1 border-2 accent-border font-chat text-sm h-12 transition-all duration-200 focus:scale-[1.01] focus:shadow-md focus:accent-border"
              disabled={isTyping}
              data-testid="input-message"
              data-tutorial="message-input"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 font-mono font-bold tracking-wide h-12 transition-all duration-200 hover:scale-105 active:scale-95 accent-bg hover:accent-bg text-white disabled:opacity-50"
              data-testid="button-send-message"
            >
              SEND
            </Button>
          </div>
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

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      
      {/* Tutorial Overlay */}
      <TutorialOverlay />
    </div>
  );
}