"use client"
import { ClubEvent } from '@/types/community';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, Users, Share2, Bookmark, Download, Presentation, ListTodo } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

interface EventDetailsDialogProps {
  event: ClubEvent;
  children: React.ReactNode;
  onRsvp: () => void;
  isPending: boolean;
}

export function EventDetailsDialog({ event, children, onRsvp, isPending }: EventDetailsDialogProps) {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Hackathon': return <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">{type}</Badge>;
      case 'Workshop': return <Badge variant="secondary" className="bg-amber-500/10 text-amber-700">{type}</Badge>;
      case 'Seminar': return <Badge variant="secondary" className="bg-blue-500/10 text-blue-700">{type}</Badge>;
      default: return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="relative h-48 sm:h-64 bg-muted w-full">
           <Image src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80" alt="Event Banner" fill className="object-cover" />
           <div className="absolute top-4 right-4 flex gap-2">
             <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm" onClick={() => alert('Event shared')}>
               <Share2 className="w-4 h-4" />
             </Button>
             <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm" onClick={() => alert('Event bookmarked')}>
               <Bookmark className="w-4 h-4" />
             </Button>
           </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <DialogHeader className="mb-4 text-left">
            <div className="flex items-center gap-2 mb-2">
              {getTypeBadge(event.type)}
            </div>
            <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
            <p className="text-sm text-muted-foreground pt-1">
              Organized by {event.creator?.name || 'Club'}
            </p>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg border shadow-sm">
               <div className="bg-background p-2 rounded-md shadow-sm border"><CalendarDays className="w-5 h-5 text-primary" /></div>
               <div>
                 <p className="text-sm font-semibold">{format(new Date(event.startTime), 'EEEE, MMMM d, yyyy')}</p>
                 <p className="text-xs text-muted-foreground">{format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}</p>
               </div>
            </div>
            <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg border shadow-sm">
               <div className="bg-background p-2 rounded-md shadow-sm border"><MapPin className="w-5 h-5 text-primary" /></div>
               <div>
                 <p className="text-sm font-semibold">Venue</p>
                 <p className="text-xs text-muted-foreground">{event.location || 'TBA'}</p>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">About Event</h4>
              <p className="text-sm leading-relaxed">{event.description}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <ListTodo className="w-4 h-4" /> Agenda
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2"><span className="font-medium min-w-[60px]">10:00 AM</span> <span>Registration & Welcome</span></li>
                  <li className="flex items-start gap-2"><span className="font-medium min-w-[60px]">10:30 AM</span> <span>Keynote Speech</span></li>
                  <li className="flex items-start gap-2"><span className="font-medium min-w-[60px]">11:15 AM</span> <span>Interactive Workshop</span></li>
                  <li className="flex items-start gap-2"><span className="font-medium min-w-[60px]">12:30 PM</span> <span>Networking Lunch</span></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <Presentation className="w-4 h-4" /> Speakers
                </h4>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">SJ</div>
                  <div>
                    <p className="text-sm font-medium">Sarah Jenkins</p>
                    <p className="text-xs text-muted-foreground">Senior Software Engineer</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Attachments</h4>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start h-auto py-2" onClick={() => alert('Downloading workshop materials...')}>
                  <Download className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">Workshop_Materials.pdf</p>
                    <p className="text-xs text-muted-foreground">2.4 MB</p>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
           <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <Users className="w-4 h-4" />
             <span><span className="font-bold text-foreground">{event.rsvpCount}</span> registered (Capacity: 150)</span>
           </div>
           <Button 
             variant={event.isJoinedByMe ? "secondary" : "default"} 
             onClick={onRsvp}
             disabled={isPending}
           >
             {event.isJoinedByMe ? 'Cancel RSVP' : 'RSVP Now'}
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
