import { StudyGroup } from '@/types/community';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pin, Users, Lock, Globe, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export function GroupCard({ group }: { group: StudyGroup }) {
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) { // Less than 24h
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Link href={`/community/group/${group.id}`} className="block hover:bg-muted/30 transition-colors group p-4 sm:p-5">
      <div className="flex items-start sm:items-center gap-4">
        <div className="relative shrink-0">
          <Avatar className="w-14 h-14 sm:w-16 sm:h-16 border bg-muted/50">
            {group.avatarUrl ? (
              <AvatarImage src={group.avatarUrl} className="object-cover" />
            ) : (
              <AvatarFallback className="text-lg font-semibold bg-primary/5 text-primary">
                {group.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2 overflow-hidden pr-2">
              <h3 className="font-semibold text-base sm:text-lg truncate group-hover:text-primary transition-colors">
                {group.name}
              </h3>
              {group.isPinned && <Pin className="w-3.5 h-3.5 text-muted-foreground shrink-0 fill-muted-foreground" />}
            </div>
            
            {(group.lastActivity || group.createdAt) && (
              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-1">
                {formatTime(group.lastActivity || group.createdAt)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground truncate">
            {group.privacy === 'Public' ? <Globe className="w-3 h-3 shrink-0" /> : <Lock className="w-3 h-3 shrink-0" />}
            <span className="truncate">{group.department}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30 shrink-0"></span>
            <span className="truncate">{group.subject}</span>
            {group.semester && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30 shrink-0"></span>
                <span>Sem {group.semester}</span>
              </>
            )}
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 min-w-0">
              {group.lastMessage ? (
                <p className="text-sm text-foreground truncate flex items-center gap-1.5">
                  <span className="font-medium text-xs text-muted-foreground shrink-0">{group.lastMessage.author.name}:</span>
                  <span className="truncate">{group.lastMessage.content}</span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> No messages yet
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Members">
                <Users className="w-3.5 h-3.5" />
                {group.membersCount}
              </div>
              
              {group.unreadCount !== undefined && group.unreadCount > 0 && (
                <Badge variant="default" className="h-5 min-w-[20px] flex items-center justify-center rounded-full px-1.5 py-0 text-[10px]">
                  {group.unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
