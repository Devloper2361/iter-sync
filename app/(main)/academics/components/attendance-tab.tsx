import { AcademicsData } from '@/types/academics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AttendanceCalculator } from './attendance-calculator';

export function AttendanceTab({ data }: { data: AcademicsData }) {
  const totalClasses = data.attendance.reduce((sum, subj) => sum + subj.totalClasses, 0);
  const totalAttended = data.attendance.reduce((sum, subj) => sum + subj.attendedClasses, 0);
  const overallPercentage = totalClasses === 0 ? 0 : (totalAttended / totalClasses) * 100;

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-primary/20">
               {/* simple CSS pie chart for attendance */}
               <div className="absolute inset-0 rounded-full border-8 border-primary" style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${100 - overallPercentage}%)` }} />
               <span className="text-3xl font-bold">{overallPercentage.toFixed(1)}%</span>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {totalAttended} / {totalClasses} Classes Attended
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <AttendanceCalculator />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Subject-wise Attendance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.attendance.map((subject) => (
            <Card key={subject.id} className="overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{subject.code}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{subject.name}</div>
                  </div>
                  <Badge variant="outline">{subject.type}</Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{subject.percentage.toFixed(1)}%</span>
                    <span className="text-muted-foreground">{subject.attendedClasses}/{subject.totalClasses}</span>
                  </div>
                  <Progress value={subject.percentage} className={`h-2 ${subject.percentage < 75 ? '[&>div]:bg-destructive' : ''}`} />
                </div>
                
                {subject.percentage < 75 ? (
                  <p className="text-xs text-destructive font-medium">Short of attendance!</p>
                ) : (
                  <p className="text-xs text-green-500 font-medium">Safe zone</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
