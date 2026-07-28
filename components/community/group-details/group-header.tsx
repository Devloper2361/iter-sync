import { StudyGroup } from '@/types/community';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Search, MoreVertical, Globe, Lock, Info, Users } from 'lucide-react';

interface GroupHeaderProps {
  group: StudyGroup;
  onInfoClick?: () => void;
}

export function GroupHeader({ group, onInfoClick }: GroupHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card border-b shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={onInfoClick}>
        <Avatar className="w-10 h-10 border bg-muted shrink-0">
          {group.avatarUrl ? (
            <AvatarImage src={group.avatarUrl} className="object-cover" />
          ) : (
            <AvatarFallback className="font-semibold text-primary bg-primary/10">
              {group.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col min-w-0">
          <h2 className="text-base font-semibold truncate hover:underline cursor-pointer">{group.name}</h2>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
            {group.privacy === 'Public' ? <Globe className="w-3 h-3 shrink-0" /> : <Lock className="w-3 h-3 shrink-0" />}
            <span className="truncate">{group.department}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30 shrink-0"></span>
            <span className="truncate flex items-center gap-1"><Users className="w-3 h-3" /> {group.membersCount}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Search className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground md:hidden" onClick={onInfoClick}>
          <Info className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
