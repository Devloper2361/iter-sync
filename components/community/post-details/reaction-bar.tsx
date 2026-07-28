import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ReactionType, ReactionCounts } from '@/types/community';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Heart, ThumbsUp, PartyPopper, Lightbulb, Smile, Frown, Plus } from 'lucide-react';

interface ReactionBarProps {
  reactions?: ReactionCounts;
  myReaction?: ReactionType;
  likes: number;
  onReact: (reaction: ReactionType) => void;
  isLikedByMe?: boolean;
}

const REACTION_ICONS: Record<ReactionType, React.ReactNode> = {
  Like: <ThumbsUp className="w-4 h-4 text-blue-500" />,
  Love: <Heart className="w-4 h-4 text-red-500" />,
  Celebrate: <PartyPopper className="w-4 h-4 text-yellow-500" />,
  Insightful: <Lightbulb className="w-4 h-4 text-emerald-500" />,
  Funny: <Smile className="w-4 h-4 text-amber-500" />,
  Confused: <Frown className="w-4 h-4 text-purple-500" />
};

const REACTION_LABELS: Record<ReactionType, string> = {
  Like: 'Like',
  Love: 'Love',
  Celebrate: 'Celebrate',
  Insightful: 'Insightful',
  Funny: 'Funny',
  Confused: 'Confused'
};

export function ReactionBar({ reactions, myReaction, likes, onReact, isLikedByMe }: ReactionBarProps) {
  const [open, setOpen] = useState(false);

  const handleReact = (reaction: ReactionType) => {
    onReact(reaction);
    setOpen(false);
  };

  const hasReactions = reactions && Object.keys(reactions).length > 0;
  
  const displayCount = likes > 0 ? likes : 0;
  
  const activeIcon = myReaction 
    ? REACTION_ICONS[myReaction] 
    : (isLikedByMe ? <Heart className="w-5 h-5 mr-2 fill-primary text-primary" /> : <Heart className="w-5 h-5 mr-2" />);
    
  const activeLabel = myReaction 
    ? REACTION_LABELS[myReaction] 
    : (isLikedByMe ? 'Liked' : 'Like');

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            className={`flex items-center gap-2 rounded-full px-4 hover:bg-primary/5 ${myReaction || isLikedByMe ? 'bg-primary/5 font-medium' : 'text-muted-foreground'}`}
          >
            {myReaction ? <span className="flex items-center gap-2">{activeIcon} <span className="capitalize">{activeLabel}</span></span> : activeIcon}
            {(!myReaction && !isLikedByMe) && 'Like'}
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-auto p-1 rounded-full shadow-lg border-muted">
          <div className="flex items-center gap-1">
            {(Object.keys(REACTION_ICONS) as ReactionType[]).map((reaction) => (
              <Button
                key={reaction}
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:scale-125 transition-transform hover:bg-transparent"
                title={REACTION_LABELS[reaction]}
                onClick={() => handleReact(reaction)}
              >
                {REACTION_ICONS[reaction]}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      {hasReactions && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
          <div className="flex -space-x-1.5">
            {Object.entries(reactions || {})
              .filter(([_, count]) => count > 0)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([reaction, _]) => (
                <div key={reaction} className="w-5 h-5 rounded-full bg-background border flex items-center justify-center text-[10px]">
                  {REACTION_ICONS[reaction as ReactionType]}
                </div>
              ))}
          </div>
          <span className="font-medium">{displayCount}</span>
        </div>
      )}
    </div>
  );
}
