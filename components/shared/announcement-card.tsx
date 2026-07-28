import { Announcement } from '@/types/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Pin } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${announcement.isPriority ? 'border-primary/50 border-l-4' : ''}`}>
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2">
            {announcement.isPinned && <Pin className="h-3 w-3 text-muted-foreground fill-current rotate-45" />}
            <h4 className="font-semibold text-sm leading-tight">{announcement.title}</h4>
          </div>
          {announcement.isPriority && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Priority</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
          <span>{announcement.author}</span>
          <span>{formatDistanceToNow(announcement.date, { addSuffix: true })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
