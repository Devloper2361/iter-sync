import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const COMMON_EMOJIS = [
  '😀', '😂', '🥺', '😎', '😍', '🤔', '🙌', '👍', '🔥', '✨', '🎉', '💯',
  '❤️', '💡', '🚀', '👀', '💻', '📚', '🎓', '📝'
];

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50" title="Add Emoji">
          <Smile className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="grid grid-cols-5 gap-1">
          {COMMON_EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              className="h-10 w-10 text-xl hover:bg-muted"
              onClick={() => onEmojiSelect(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
