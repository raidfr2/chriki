import { useState, useEffect } from "react";
import { renderFormattedText, getTextDirection } from "@shared/textFormatter";

interface FormattedMessageProps {
  chunks: string[];
  isFormatted: boolean;
  className?: string;
  delay?: number;
}

export default function FormattedMessage({ 
  chunks, 
  isFormatted, 
  className = "",
  delay = 800
}: FormattedMessageProps) {
  const [visibleChunks, setVisibleChunks] = useState<number>(1);
  
  useEffect(() => {
    if (!isFormatted || chunks.length <= 1) {
      setVisibleChunks(chunks.length);
      return;
    }
    
    // Show chunks progressively with delay
    const timer = setTimeout(() => {
      if (visibleChunks < chunks.length) {
        setVisibleChunks(prev => prev + 1);
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, [visibleChunks, chunks.length, isFormatted, delay]);
  
  if (!isFormatted || chunks.length <= 1) {
    // Single chunk or unformatted - render as HTML
    const content = chunks[0] || "";
    const textDirection = getTextDirection(content);
    
    return (
      <div 
        className={`chat-message ${className}`}
        dir={textDirection}
        dangerouslySetInnerHTML={{ __html: renderFormattedText(content) }}
      />
    );
  }
  
  // Multiple chunks - render progressively
  return (
    <div className={`space-y-2 ${className}`}>
      {chunks.slice(0, visibleChunks).map((chunk, index) => {
        const textDirection = getTextDirection(chunk);
        return (
          <div 
            key={index}
            className={`chat-message ${
              index === visibleChunks - 1 ? 'animate-fade-in' : ''
            }`}
            dir={textDirection}
            dangerouslySetInnerHTML={{ 
              __html: renderFormattedText(chunk) 
            }}
          />
        );
      })}
      
      {visibleChunks < chunks.length && (
        <div className="flex items-center space-x-1 text-muted-foreground opacity-60">
          <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <span className="text-xs ml-2">More coming...</span>
        </div>
      )}
    </div>
  );
}