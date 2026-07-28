import { useState } from 'react';
import { AcademicsData } from '@/types/academics';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function TimetableTab({ data }: { data: AcademicsData }) {
  const currentDay = new Date().getDay();
  const defaultDay = currentDay === 0 ? 1 : currentDay; // Default to Monday if Sunday
  const [selectedDay, setSelectedDay] = useState(defaultDay.toString());

  const dayClasses = data.timetable
    .filter(c => c.dayOfWeek === parseInt(selectedDay))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-64">
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select Day" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((day, index) => (
                <SelectItem key={index} value={index.toString()} disabled={index === 0}>
                  {day} {index === currentDay ? '(Today)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" onClick={() => alert('Downloading Mock PDF...')}>
          Download PDF
        </Button>
      </div>

      {dayClasses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-dashed">
          <Clock className="w-12 h-12 mb-4 opacity-20" />
          <p>No classes scheduled for {DAYS[parseInt(selectedDay)]}.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {dayClasses.map((cls) => {
            // Very simple current class logic based on time (mock)
            const now = new Date();
            const currentHour = now.getHours();
            const startHour = parseInt(cls.startTime.split(':')[0]);
            const endHour = parseInt(cls.endTime.split(':')[0]);
            const isOngoing = parseInt(selectedDay) === currentDay && currentHour >= startHour && currentHour < endHour;

            return (
              <Card key={cls.id} className={`overflow-hidden transition-all hover:shadow-md ${isOngoing ? 'border-primary ring-1 ring-primary' : ''}`}>
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  <div className={`p-4 sm:w-48 flex sm:flex-col justify-between items-center sm:items-start sm:justify-center border-b sm:border-b-0 sm:border-r ${isOngoing ? 'bg-primary/10' : 'bg-muted/30'}`}>
                    <div className="font-semibold text-lg">{cls.startTime}</div>
                    <div className="text-muted-foreground text-sm">to {cls.endTime}</div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{cls.courseName}</h4>
                        <p className="text-sm text-muted-foreground">{cls.courseCode}</p>
                      </div>
                      <div className="flex gap-2">
                        {isOngoing && <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full animate-pulse">Live Now</span>}
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">{cls.type}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span>{cls.faculty}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{cls.room}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
