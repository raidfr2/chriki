
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: any[];
  onMessageSelect: (index: number) => void;
}

export function SearchDialog({ open, onOpenChange, messages, onMessageSelect }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-mono">SEARCH.MESSAGES</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Qalleb fi messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredMessages.slice(0, 20).map((message, index) => (
              <div
                key={index}
                className="p-3 border border-border rounded cursor-pointer hover:bg-muted"
                onClick={() => {
                  onMessageSelect(index);
                  onOpenChange(false);
                }}
              >
                <div className="text-sm font-medium mb-1">
                  {message.role === 'user' ? 'You' : 'Chriki'}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {message.content}
                </div>
              </div>
            ))}
            
            {searchQuery && filteredMessages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Ma lqinach 7aga...
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
