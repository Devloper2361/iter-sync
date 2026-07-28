import { useState } from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, Check, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function CommunityNotifications() {
  const { data: notifications } = useNotifications();
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;
  
  const filteredNotifs = notifications?.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative shadow-sm hover:bg-muted/50">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 shadow-lg border-muted" align="end">
        <div className="p-4 border-b flex justify-between items-center bg-muted/20">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">{unreadCount} new</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Filter" onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}>
              <Filter className={`w-4 h-4 ${filter === 'unread' ? 'text-primary' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-primary">
              <Check className="w-3.5 h-3.5 mr-1" />
              Mark all read
            </Button>
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {filteredNotifs?.length === 0 ? (
            <div className="p-8 text-sm text-muted-foreground text-center flex flex-col items-center">
              <Bell className="w-8 h-8 opacity-20 mb-3" />
              <p>You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifs?.map(notif => (
                <div key={notif.id} className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer group ${!notif.isRead ? 'bg-primary/5 relative' : ''}`}>
                  {!notif.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"></div>
                  )}
                  <p className="text-sm leading-snug">{notif.content}</p>
                  <p className="text-xs text-primary font-medium mt-1.5">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-2 border-t text-center bg-muted/20">
          <Button variant="link" className="text-xs text-muted-foreground h-auto p-1">View all notifications</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
