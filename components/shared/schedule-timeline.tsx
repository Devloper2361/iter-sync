import { ScheduleItem } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { Clock, MapPin, User } from 'lucide-react';

interface ScheduleTimelineProps {
  schedule: ScheduleItem[];
}

export function ScheduleTimeline({ schedule }: ScheduleTimelineProps) {
  if (schedule.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
        <Clock className="w-8 h-8 mb-2 opacity-20" />
        <p className="text-sm">No classes scheduled for today.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {schedule.map((item, index) => {
        const isOngoing = item.status === 'ongoing';
        const isCompleted = item.status === 'completed';
        
        return (
          <div key={item.id} className="relative pl-6">
            <div 
              className={cn(
                "absolute left-0 top-1 w-2 h-2 rounded-full ring-4 ring-background",
                isOngoing ? "bg-primary ring-primary/20" : isCompleted ? "bg-muted-foreground/30" : "bg-border"
              )}
            />
            {index !== schedule.length - 1 && (
              <div className="absolute left-[3px] top-4 w-[2px] h-[calc(100%+8px)] bg-border" />
            )}
            
            <div className={cn("space-y-2", isCompleted && "opacity-60")}>
              <div className="flex items-center justify-between">
                <span className={cn("text-xs font-semibold", isOngoing ? "text-primary" : "text-muted-foreground")}>
                  {item.startTime} - {item.endTime}
                </span>
                {isOngoing && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full animate-pulse">
                    Live Now
                  </span>
                )}
              </div>
              
              <div className={cn("p-3 rounded-lg border", isOngoing ? "bg-primary/5 border-primary/20" : "bg-card")}>
                <h4 className="font-semibold text-sm mb-2">{item.subject}</h4>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{item.faculty}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.room}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
