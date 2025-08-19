import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LocationStatus from "./LocationStatus";
import GoogleMapsLink from "./GoogleMapsLink";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  delay: number;
  component?: 'GoogleMapsLink';
  mapsQuery?: string;
  useCurrentLocation?: boolean;
}

const demoConversations = [
  {
    title: "Everyday Conversation",
    subtitle: "Darija & French Mix",
    messages: [
      { id: 1, text: "Ahla w sahla! Ana Chriki, kifach n3awnek?", isUser: false, delay: 1000 },
      { id: 2, text: "Salam khoya! Ndir wahad l'présentation demain w khalas ma 3andi inspiration", isUser: true, delay: 2500 },
      { id: 3, text: "Maliche! Goulili 3la ach presentation mte3k? Ana n3awnek bech tdirlha structure w ideas bzef!", isUser: false, delay: 4000 },
      { id: 4, text: "C'est à propos digital marketing f Algeria", isUser: true, delay: 5500 },
      { id: 5, text: "Perfect! Digital marketing fi Algeria hadhi mawdo3 interessant bzef! Rani n9oullek plan wa7ed:", isUser: false, delay: 7000 }
    ]
  },
  {
    title: "Local Knowledge",
    subtitle: "Algerian Context & Culture",
    messages: [
      { id: 1, text: "Chriki, wach rak ta3ref 3la Oran?", isUser: true, delay: 1000 },
      { id: 2, text: "Oran? Ya salam! Wahran l'bahia, bled l'raï w Santa Cruz! T7ebb ta3ref 3la ach? Restaurants, sorties, wala histoire mte3ha?", isUser: false, delay: 2500 },
      { id: 3, text: "Restaurants tradionnels li yaklo fihom makla 7aloua", isUser: true, delay: 4000 },
      { id: 4, text: "Ah perfect! Fi Wahran 3andek restaurants bzef:\n\n🍽️ **Chez Ferhat** - Chorba, couscous royal\n🥘 **Le Petit Poucet** - Makla 3arabiya traditionelle\n🍖 **Restaurant Es-Salam** - L7am l7alal w tajine\n\nKamlin fi Medina Jdida, qrib men Place d'Armes!", isUser: false, delay: 5500 }
    ]
  },
  {
    title: "Location Services",
    subtitle: "Find Places Near You",
    messages: [
      { id: 1, text: "Ahla! Ana Chriki, assistant mte3k l'Algérien. Kifach nesta3lek?", isUser: false, delay: 1000 },
      { id: 2, text: "Salam! 3andi wahad l'rdv fi mustashfa, wach rak ta3ref mustashfayat qrib mink?", isUser: true, delay: 2500 },
      { id: 3, text: "Ah t7ebb mustashfa! Khassni n3ref location mte3k bech nwarilek l-qrib mink. T7ebb t7ell location access?", isUser: false, delay: 4000 },
      { id: 4, text: "Perfect! Ana nwarilek Google Maps bech tchouf l-mustashfayat l-qrib mink:", isUser: false, delay: 5500 },
      { id: 5, text: "", isUser: false, delay: 6500, component: 'GoogleMapsLink', mapsQuery: 'hospitals near you', useCurrentLocation: true },
      { id: 6, text: "Kamlin 3andek pharmacies itha t7ebb:", isUser: false, delay: 8000 },
      { id: 7, text: "", isUser: false, delay: 8500, component: 'GoogleMapsLink', mapsQuery: 'pharmacies near you', useCurrentLocation: true }
    ]
  }
];

export default function ChatDemo() {
  const [currentConversation, setCurrentConversation] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentDemo = demoConversations[currentConversation];

  useEffect(() => {
    if (!isPlaying) return;

    const conversation = demoConversations[currentConversation];
    
    if (currentMessageIndex < conversation.messages.length) {
      const currentMessage = conversation.messages[currentMessageIndex];
      
      const timer = setTimeout(() => {
        if (!currentMessage.isUser) {
          setIsTyping(true);
          // Show typing indicator for bot messages
          setTimeout(() => {
            setIsTyping(false);
            setVisibleMessages(prev => [...prev, currentMessage]);
            setCurrentMessageIndex(prev => prev + 1);
          }, 1500);
        } else {
          // User messages appear instantly
          setVisibleMessages(prev => [...prev, currentMessage]);
          setCurrentMessageIndex(prev => prev + 1);
        }
      }, currentMessage.delay);

      return () => clearTimeout(timer);
    } else {
      // Conversation finished, wait then reset or move to next
      const resetTimer = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentMessageIndex(0);
        setCurrentConversation(prev => (prev + 1) % demoConversations.length);
      }, 3000);

      return () => clearTimeout(resetTimer);
    }
  }, [currentMessageIndex, currentConversation, isPlaying]);

  const resetDemo = () => {
    setVisibleMessages([]);
    setCurrentMessageIndex(0);
    setIsTyping(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Demo Controls */}
      <div className="flex flex-col items-center gap-4 mb-8">
        {/* Conversation Navigation */}
        <div className="flex flex-wrap justify-center gap-3">
          {demoConversations.map((conversation, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentConversation(index);
                resetDemo();
              }}
              className={`px-4 py-2 text-xs font-mono rounded-lg border-2 transition-all duration-300 ${
                index === currentConversation 
                  ? 'bg-foreground text-background border-foreground scale-105' 
                  : 'bg-background text-foreground border-border hover:border-foreground/50 hover:scale-102'
              }`}
            >
              {conversation.title.toUpperCase()}
            </button>
          ))}
        </div>
        
        {/* Progress Indicators */}
        <div className="flex gap-1">
          {demoConversations.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentConversation 
                  ? 'bg-foreground' 
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Demo Title */}
      <motion.div 
        key={currentConversation}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h3 className="font-mono text-xl font-bold mb-2">{currentDemo.title}</h3>
        <p className="text-muted-foreground text-sm">{currentDemo.subtitle}</p>
      </motion.div>

      {/* Chat Interface Mockup */}
      <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden shadow-2xl">
        {/* Mock Header */}
        <div className="bg-foreground text-background px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="font-mono font-bold text-sm">CHRIKI</div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-xs font-mono opacity-80">// DEMO MODE</div>
          </div>
          {/* Location Status in Demo */}
          {currentConversation === 2 && (
            <div className="mt-2">
              <LocationStatus />
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-muted/20">
          <AnimatePresence>
            {visibleMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg relative ${
                    message.component 
                      ? 'p-0' // No padding for component messages
                      : message.isUser
                      ? 'bg-foreground text-background px-4 py-3'
                      : 'bg-background border border-border px-4 py-3'
                  }`}
                >
                  {message.component === 'GoogleMapsLink' ? (
                    <GoogleMapsLink 
                      query={message.mapsQuery || ''} 
                      useCurrentLocation={message.useCurrentLocation}
                      className="w-full"
                    />
                  ) : (
                    <>
                      <div 
                        className="text-sm whitespace-pre-line"
                        dir="auto"
                        style={{ 
                          textAlign: /[\u0600-\u06FF]/.test(message.text) ? 'right' : 'left' 
                        }}
                      >
                        {message.text}
                      </div>
                      
                      {/* Timestamp */}
                      <div className={`text-xs mt-2 opacity-60 ${
                        message.isUser ? 'text-background/80' : 'text-muted-foreground'
                      }`}>
                        {new Date().toLocaleTimeString('en-US', { 
                          hour12: false,
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-background border border-border px-4 py-3 rounded-lg max-w-[70%]">
                <div className="flex space-x-1">
                  <motion.div 
                    className="w-2 h-2 bg-foreground rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-foreground rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-foreground rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Chriki is typing...
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Mock Input */}
        <div className="border-t border-border p-4 bg-background">
          <div className="flex space-x-3">
            <div className="flex-1 px-3 py-2 border border-border rounded-lg bg-muted/50 text-muted-foreground font-mono text-sm">
              Type your message in Darija...
            </div>
            <button className="px-4 py-2 bg-foreground text-background rounded-lg font-mono text-sm">
              SEND
            </button>
          </div>
        </div>
      </div>

      {/* Features Highlight */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center"
      >
        <div className="p-4 border border-border rounded-lg bg-background">
          <div className="text-2xl mb-2">🗣️</div>
          <div className="font-mono text-sm font-bold">Natural Darija</div>
          <div className="text-xs text-muted-foreground mt-1">Authentic Algerian dialect</div>
        </div>
        
        <div className="p-4 border border-border rounded-lg bg-background">
          <div className="text-2xl mb-2">🇩🇿</div>
          <div className="font-mono text-sm font-bold">Local Context</div>
          <div className="text-xs text-muted-foreground mt-1">Algeria-specific knowledge</div>
        </div>
        
        <div className="p-4 border border-border rounded-lg bg-background">
          <div className="text-2xl mb-2">⚡</div>
          <div className="font-mono text-sm font-bold">Real-time</div>
          <div className="text-xs text-muted-foreground mt-1">Instant responses</div>
        </div>
      </motion.div>
      
      {/* Additional feature highlight for location services when showing location demo */}
      {currentConversation === 2 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-4 p-4 border border-border rounded-lg bg-background text-center"
        >
          <div className="text-2xl mb-2">🗺️</div>
          <div className="font-mono text-sm font-bold">Location Services</div>
          <div className="text-xs text-muted-foreground mt-1">Find places near you with Google Maps integration</div>
        </motion.div>
      )}
    </div>
  );
}
