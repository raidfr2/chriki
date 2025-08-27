import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleMapsLink from "./GoogleMapsLink";
import TransportTimeline from "./transport/TransportTimeline";
import { demoRoutePlan } from "@/lib/transportTypes";

// Animated thinking/analysis bubble used in Transport demo
function RouteThinking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    "Analyzing possible routes…",
    "Optimizing transfers",
    "Finding fastest arrival"
  ];

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    
    // Random timings for each step (800ms to 1800ms)
    const stepTimings = [
      Math.random() * 1000 + 800, // First step: 800-1800ms
      Math.random() * 1000 + 900, // Second step: 900-1900ms  
      Math.random() * 1000 + 700, // Third step: 700-1700ms
    ];
    
    let cumulativeTime = 0;
    
    stepTimings.forEach((timing, index) => {
      cumulativeTime += timing;
      
      const timeout = setTimeout(() => {
        if (index < steps.length - 1) {
          setCurrentStep(index + 1);
        } else {
          // After last step, immediately fade out
          setIsVisible(false);
        }
      }, cumulativeTime);
      
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div 
      className="bg-background border border-border px-4 py-3 rounded-lg"
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-xs font-mono text-muted-foreground mb-3 tracking-wider">// CHRIKI IS THINKING</div>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -15 }}
            animate={{ 
              opacity: index <= currentStep ? 1 : 0.4,
              x: index <= currentStep ? 0 : -15
            }}
            transition={{ duration: 0.5, delay: index === currentStep ? 0.15 : 0 }}
          >
            <div className="flex items-center gap-1.5">
              {index <= currentStep ? (
                <>
                  <motion.div 
                    className="w-2.5 h-2.5 bg-foreground rounded-full" 
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }} 
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0 }} 
                  />
                  <motion.div 
                    className="w-2.5 h-2.5 bg-foreground rounded-full" 
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }} 
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }} 
                  />
                  <motion.div 
                    className="w-2.5 h-2.5 bg-foreground rounded-full" 
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }} 
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.6 }} 
                  />
                </>
              ) : (
                <>
                  <div className="w-2.5 h-2.5 bg-foreground/20 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-foreground/20 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-foreground/20 rounded-full" />
                </>
              )}
            </div>
            <div className={`font-mono text-sm font-medium tracking-wide ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground/60'}`}>
              {step}
            </div>
            {index < currentStep && (
              <motion.div 
                className="ml-auto text-green-500 font-mono font-bold text-lg"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  delay: number;
  component?: 'GoogleMapsLink' | 'TransportTimeline' | 'RouteThinking';
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
      { id: 1, text: "Salam! 3andi wahad l'rdv fi mustashfa, wach rak ta3ref mustashfayat qrib mink?", isUser: true, delay: 1000 },
      { id: 3, text: "Perfect! Ana nwarilek Google Maps bech tchouf l-mustashfayat l-qrib mink:", isUser: false, delay: 4000 },
      { id: 4, text: "", isUser: false, delay: 5000, component: 'GoogleMapsLink', mapsQuery: 'hospitals near you', useCurrentLocation: true },
      { id: 5, text: "Kamlin 3andek pharmacies itha t7ebb:", isUser: false, delay: 6500 },
      { id: 6, text: "", isUser: false, delay: 7000, component: 'GoogleMapsLink', mapsQuery: 'pharmacies near you', useCurrentLocation: true }
    ]
  },
  {
    title: "Transport (Preview)",
    subtitle: "Public Transport Timeline",
    messages: [
      { id: 1, text: "Salam! Bghit nrouh men Rouïba (Sidi Dris) l'Hôpital Mustapha‑Pacha. achi nssib route l'mliha?", isUser: true, delay: 1000 },
      { id: 2, text: "ok! Nbeddha n9alb 3la meilleur itinéraire... chwiyya sabr ✨", isUser: false, delay: 2500 },
      { id: 3, text: "", isUser: false, delay: 4500, component: 'RouteThinking' },
      { id: 4, text: "", isUser: false, delay: 8000, component: 'TransportTimeline' }
    ],
    // Custom flag used for UI tweaks (e.g., hide highlights if needed)
    isTransport: true
  }
];

interface ChatDemoProps {
  initialConversation?: number;
}

export default function ChatDemo({ initialConversation = 0 }: ChatDemoProps) {
  // Use the initialConversation directly, don't allow it to change
  const conversationIndex = initialConversation;
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentDemo = demoConversations[conversationIndex];

  useEffect(() => {
    const conversation: any = demoConversations[conversationIndex] as any;

    if (!isPlaying) return;

    if (currentMessageIndex < conversation.messages.length) {
      const currentMessage = conversation.messages[currentMessageIndex];
      
      const timer = setTimeout(() => {
        if (!currentMessage.isUser) {
          // Skip typing indicator for TransportTimeline (after RouteThinking)
          if (currentMessage.component === 'TransportTimeline') {
            setVisibleMessages(prev => [...prev, currentMessage]);
            setCurrentMessageIndex(prev => prev + 1);
          } else {
            setIsTyping(true);
            // Show typing indicator for bot messages
            setTimeout(() => {
              setIsTyping(false);
              setVisibleMessages(prev => [...prev, currentMessage]);
              setCurrentMessageIndex(prev => prev + 1);
            }, 1500);
          }
        } else {
          // User messages appear instantly
          setVisibleMessages(prev => [...prev, currentMessage]);
          setCurrentMessageIndex(prev => prev + 1);
        }
      }, currentMessage.delay);

      return () => clearTimeout(timer);
    } else {
      // Conversation finished
      // Keep results visible on Transport tab (no auto-advance)
      if ((conversation as any).isTransport) {
        return;
      }
      // Otherwise, wait then reset to initial conversation
      const resetTimer = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentMessageIndex(0);
        // Stay on the same conversation (don't cycle)
      }, 3000);

      return () => clearTimeout(resetTimer);
    }
  }, [currentMessageIndex, conversationIndex, isPlaying]);

  const resetDemo = () => {
    setVisibleMessages([]);
    setCurrentMessageIndex(0);
    setIsTyping(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-4xl mx-auto h-[750px] flex flex-col">

      {/* Current Demo Title */}
      <motion.div 
        key={conversationIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 flex-shrink-0"
      >
        <h3 className="font-mono text-xl font-bold mb-2">{currentDemo.title}</h3>
        <p className="text-muted-foreground text-sm">{currentDemo.subtitle}</p>
      </motion.div>
      {/* Chat Interface Mockup */}
      <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0">
          {/* Mock Header */}
          <div className="bg-foreground text-background px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="font-mono font-bold text-sm">CHRIKI</div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-xs font-mono opacity-80">// DEMO MODE</div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 min-h-[500px]">
            <AnimatePresence mode="popLayout">
              {visibleMessages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut", layout: { duration: 0.1 } }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`${message.component === 'TransportTimeline' ? 'w-full max-w-full' : 'max-w-[70%]'} rounded-lg relative ${
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
                    ) : message.component === 'TransportTimeline' ? (
                      <div className="w-full">
                        <TransportTimeline plan={demoRoutePlan} />
                        <div className="mt-2 text-center text-xs text-muted-foreground">
                          Preview only — live routing and real-time data integration are coming soon
                        </div>
                      </div>
                    ) : message.component === 'RouteThinking' ? (
                      <RouteThinking />
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
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, layout: { duration: 0.1 } }}
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
            </AnimatePresence>
          </div>

          {/* Mock Input */}
          <div className="border-t border-border p-4 bg-background flex-shrink-0">
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

      
    </div>
  );
}
