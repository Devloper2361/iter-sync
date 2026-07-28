"use client"
import { useState } from 'react';
import { useClubEvents, useRsvpEvent, useCancelRsvpEvent, useDeleteEvent } from '@/hooks/use-events';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarPlus, CalendarDays, Clock, MapPin, Users, Edit, Trash2, MoreVertical, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EventDetailsDialog } from './event-details-dialog';

interface ClubEventsTabProps {
  clubId: string;
}

export function ClubEventsTab({ clubId }: ClubEventsTabProps) {
  const { data: events, isLoading } = useClubEvents(clubId);
  const rsvpMutation = useRsvpEvent(clubId);
  const cancelRsvpMutation = useCancelRsvpEvent(clubId);
  const deleteMutation = useDeleteEvent(clubId);
  const [filter, setFilter] = useState<'Upcoming' | 'Past'>('Upcoming');

  if (isLoading) {
    return (
      <div className="pt-6 space-y-4">
        {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
      </div>
    );
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Hackathon': return <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/20 shadow-none border-0">{type}</Badge>;
      case 'Workshop': return <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 shadow-none border-0">{type}</Badge>;
      case 'Seminar': return <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 shadow-none border-0">{type}</Badge>;
      default: return <Badge variant="secondary" className="shadow-none border-0">{type}</Badge>;
    }
  };

  const now = new Date();
  const filteredEvents = events?.filter(event => {
    const isPast = new Date(event.endTime) < now;
    return filter === 'Past' ? isPast : !isPast;
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div className="pt-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button variant={filter === 'Upcoming' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('Upcoming')}>Upcoming</Button>
          <Button variant={filter === 'Past' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('Past')}>Past</Button>        </div>
        <Button className="shadow-sm" onClick={() => alert('Create event modal opened')}>          <CalendarPlus className="w-4 h-4 mr-2" />          Create Event        </Button>      </div>      <div className="space-y-4">        {filteredEvents && filteredEvents.length > 0 ? (          filteredEvents.map(event => (            <Card key={event.id} className="shadow-sm hover:shadow-md transition-shadow overflow-hidden group relative">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1">
                <EventDetailsDialog 
                  event={event} 
                  onRsvp={() => event.isJoinedByMe ? cancelRsvpMutation.mutate(event.id) : rsvpMutation.mutate(event.id)}
                  isPending={rsvpMutation.isPending || cancelRsvpMutation.isPending}
                >
                  <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </EventDetailsDialog>
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm"><MoreVertical className="w-4 h-4" /></Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => alert('Edit event modal opened')}>
                       <Edit className="w-4 h-4 mr-2" /> Edit Event
                     </DropdownMenuItem>
                     <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteMutation.mutate(event.id)}>
                       <Trash2 className="w-4 h-4 mr-2" /> Delete Event                     </DropdownMenuItem>                   </DropdownMenuContent>                 </DropdownMenu>              </div>
              <div className="flex flex-col sm:flex-row">
                <div className="bg-muted/50 sm:w-32 flex sm:flex-col items-center justify-center p-4 border-b sm:border-b-0 sm:border-r">
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mr-2 sm:mr-0">                    {format(new Date(event.startTime), 'MMM')}                  </span>                  <span className="text-2xl sm:text-3xl font-bold text-foreground">                    {format(new Date(event.startTime), 'dd')}                  </span>                </div>                <CardContent className="p-5 flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">                  <div className="space-y-2">                    <div className="flex items-center gap-2">                      {getTypeBadge(event.type)}                      <h4 className="font-semibold pr-12">{event.title}</h4>                    </div>                    <p className="text-sm text-muted-foreground line-clamp-2">                      {event.description}                    </p>                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground pt-1">                      <span className="flex items-center">                        <Clock className="w-3.5 h-3.5 mr-1" />                        {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}                      </span>                      {event.location && (                        <span className="flex items-center">                          <MapPin className="w-3.5 h-3.5 mr-1" />                          {event.location}                        </span>                      )}                      <span className="flex items-center">                        <Users className="w-3.5 h-3.5 mr-1" />                        {event.rsvpCount} RSVPs                      </span>                    </div>                  </div>                  <div className="self-end sm:self-center">                    {filter === 'Upcoming' ? (                      <Button                         variant={event.isJoinedByMe ? "secondary" : "outline"}                         size="sm"                         className="shadow-sm min-w-[100px]"                        disabled={rsvpMutation.isPending || cancelRsvpMutation.isPending}                        onClick={(e) => { e.stopPropagation(); event.isJoinedByMe ? cancelRsvpMutation.mutate(event.id) : rsvpMutation.mutate(event.id) }}                      >                        {event.isJoinedByMe ? 'Attending' : 'RSVP'}                      </Button>                    ) : (                      <Badge variant="outline">Completed</Badge>                    )}                  </div>                </CardContent>              </div>            </Card>          ))        ) : (          <Card className="shadow-sm">            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center border-2 border-dashed rounded-lg">              <CalendarDays className="w-12 h-12 mb-4 text-muted" />              <p className="font-medium">No {filter.toLowerCase()} events</p>              <p className="text-sm mt-1">Check back later for new events.</p>            </CardContent>          </Card>        )}      </div>    </div>  );
}
