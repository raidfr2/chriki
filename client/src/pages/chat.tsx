import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { renderFormattedText, getTextDirection, type FormattedMessage } from "@shared/textFormatter";
import FormattedMessageComponent from "@/components/FormattedMessage";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  chunks?: string[];
  isFormatted?: boolean;
}

export default function Chat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);

  // Load saved conversation on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chriki_conversation");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error("Failed to load saved messages:", error);
        // Clear corrupted data and start fresh
        localStorage.removeItem("chriki_conversation");
        const welcomeMessage: Message = {
          id: 1,
          text: "Ahla w sahla! Ana Chriki, l'assistant mte3k l'Algérien. Kifach nesta3lek?",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    } else {
      // Set initial welcome message
      const welcomeMessage: Message = {
        id: 1,
        text: "Ahla w sahla! Ana Chriki, l'assistant mte3k l'Algérien. Kifach nesta3lek?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chriki_conversation", JSON.stringify(messages));
    }
  }, [messages]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get response from Gemini API or fallback to sample responses
  const getChirikiResponse = async (userMessage: string, conversationHistory: Message[]): Promise<{text: string, formatted?: FormattedMessage}> => {
    const apiKey = localStorage.getItem("gemini_api_key");
    
    if (apiKey) {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            message: userMessage,
            apiKey,
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
        console.error("Failed to get Gemini response:", error);
      }
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

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
        isFormatted: response.formatted?.hasFormatting
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

  const clearChat = () => {
    const welcomeMessage: Message = {
      id: 1,
      text: "Ahla w sahla! Ana Chriki, l'assistant mte3k l'Algérien. Kifach nesta3lek?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    localStorage.removeItem("chriki_conversation");
    toast({
      title: "Chat cleared",
      description: "Started a new conversation with Chriki.",
    });
  };

  return (
    <div className="font-sans bg-background text-foreground h-screen flex flex-col">
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
        
        <div className="flex items-center space-x-4">
          <Link href="/settings">
            <Button 
              variant="outline" 
              size="sm"
              className="font-mono text-xs"
              data-testid="button-settings"
            >
              SETTINGS
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearChat}
            className="font-mono text-xs"
            data-testid="button-clear-chat"
          >
            CLEAR
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
                className={`max-w-[70%] px-4 py-3 rounded-lg ${
                  message.isUser
                    ? 'bg-foreground text-background border-2 border-foreground'
                    : 'bg-muted border-2 border-border'
                }`}
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
          <div className="flex space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Kteb message mte3k fi darija..."
              className="flex-1 border-2 border-foreground font-chat text-sm h-12"
              disabled={isTyping}
              data-testid="input-message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 font-mono font-bold tracking-wide h-12"
              data-testid="button-send-message"
            >
              SEND
            </Button>
          </div>
          
          {/* Quick Suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Salam Chriki!",
              "Kifach rak?",
              "Wach andi restaurants 9rib?",
              "Goulili 3la l'météo",
              "Choukran bzef!"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                className="text-xs px-3 py-1 border border-border rounded hover:bg-muted transition-colors font-chat"
                disabled={isTyping}
                data-testid={`suggestion-${suggestion.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {suggestion}
              </button>
            ))}
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
  );
}