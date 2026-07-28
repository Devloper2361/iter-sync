import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  isBookmarked?: boolean;
  count?: number;
  onToggle: () => void;
  className?: string;
  showLabel?: boolean;
}

export function BookmarkButton({ isBookmarked, count = 0, onToggle, className = "", showLabel = true }: BookmarkButtonProps) {
  return (
    <Button 
      variant="ghost" 
      onClick={onToggle}
      className={`hover:bg-primary/5 ${isBookmarked ? 'text-primary bg-primary/5 font-medium' : 'text-muted-foreground'} ${className}`}
    >
      <Bookmark className={`w-5 h-5 ${showLabel ? 'mr-2' : ''} ${isBookmarked ? 'fill-primary' : ''}`} />
      {showLabel && (isBookmarked ? 'Saved' : 'Save')}
      {!showLabel && count > 0 && <span className="ml-1 text-xs">{count}</span>}
    </Button>
  );
}
