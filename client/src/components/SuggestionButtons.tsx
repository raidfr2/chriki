import { Button } from "@/components/ui/button";

interface SuggestionButtonsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  disabled?: boolean;
}

export default function SuggestionButtons({ 
  suggestions, 
  onSuggestionClick, 
  disabled = false 
}: SuggestionButtonsProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="text-xs text-muted-foreground opacity-70 font-mono">
        💬 Ask Chriki:
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => onSuggestionClick(suggestion)}
            disabled={disabled}
            className="text-xs px-3 py-1 h-auto border border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-200 font-chat text-left"
            data-testid={`suggestion-${index}`}
          >
            <span className="max-w-[200px] truncate">
              {suggestion}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}