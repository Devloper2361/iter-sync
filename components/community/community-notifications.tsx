import { useNotifications } from '@/hooks/use-notifications';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function CommunityNotifications() {
  const { data: notifications } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {notifications && notifications.some(n => !n.isRead) && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b font-semibold">Community Notifications</div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications?.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">No notifications</div>
          ) : (
            notifications?.map(notif => (
              <div key={notif.id} className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-primary/5' : ''}`}>
                <p className="text-sm">{notif.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
