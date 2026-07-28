import { AcademicsData } from '@/types/academics';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

const typeIconMap = {
  Exam: AlertCircle,
  Holiday: CheckCircle,
  Registration: BookOpen,
  Other: CalendarIcon
};

const typeColorMap = {
  Exam: "text-destructive border-destructive/20 bg-destructive/5",
  Holiday: "text-green-500 border-green-500/20 bg-green-500/5",
  Registration: "text-blue-500 border-blue-500/20 bg-blue-500/5",
  Other: "text-primary border-primary/20 bg-primary/5"
};

export function CalendarTab({ data }: { data: AcademicsData }) {
  const sortedEvents = [...data.calendar].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedEvents.map(event => {
          const Icon = typeIconMap[event.type] || CalendarIcon;
          const colors = typeColorMap[event.type] || typeColorMap.Other;
          
          return (
            <Card key={event.id} className={`overflow-hidden border-t-4 ${colors.split(' ')[0].replace('text', 'border')}`}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${colors}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="outline">{event.type}</Badge>
                </div>
                <h4 className="font-semibold text-lg mb-1">{event.title}</h4>
                <div className="text-sm font-medium mb-3">
                  {format(event.date, 'MMM do, yyyy')}
                  {event.endDate && ` - ${format(event.endDate, 'MMM do, yyyy')}`}
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
