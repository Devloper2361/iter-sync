"use client"
import { useGroupEvents } from '@/hooks/use-study-groups';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarPlus, CalendarDays, Clock, MapPin, Users, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface CalendarTabProps {
  groupId: string;
}

export function CalendarTab({ groupId }: CalendarTabProps) {
  const { data: events, isLoading } = useGroupEvents(groupId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Study Session': return <span className="text-[10px] bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded-md">{type}</span>;
      case 'Deadline': return <span className="text-[10px] bg-red-500/10 text-red-600 px-1.5 py-0.5 rounded-md">{type}</span>;
      default: return <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-md">{type}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold tracking-tight">Upcoming Events</h3>
        <Button className="shadow-sm h-9" variant="outline">
          <CalendarPlus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="space-y-4">
        {events && events.length > 0 ? (
          events.map(event => (
            <Card key={event.id} className="shadow-none border bg-card/50 hover:bg-card hover:border-primary/50 transition-colors overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="bg-muted/30 sm:w-24 flex sm:flex-col items-center justify-center py-2 sm:py-4 border-b sm:border-b-0 sm:border-r">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2 sm:mr-0">
                    {format(new Date(event.startTime), 'MMM')}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-foreground">
                    {format(new Date(event.startTime), 'dd')}
                  </span>
                </div>
                
                <CardContent className="p-4 flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(event.type)}
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium text-muted-foreground pt-1">
                      <span className="flex items-center bg-muted px-1.5 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                      </span>
                      {event.location && (
                        <span className="flex items-center bg-muted px-1.5 py-0.5 rounded-md">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="self-end sm:self-center">
                    <Button variant={event.isJoinedByMe ? "secondary" : "outline"} size="sm" className="shadow-sm h-7 text-xs">
                      {event.isJoinedByMe ? 'Attending' : 'RSVP'}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center border-2 border-dashed rounded-xl">
            <CalendarDays className="w-10 h-10 mb-3 text-muted/50" />
            <p className="font-medium text-sm">No upcoming events</p>
            <p className="text-xs mt-1">Schedule a study session or meeting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
