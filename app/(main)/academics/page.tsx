"use client"

import { useAcademicsData } from '@/hooks/use-academics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceTab } from './components/attendance-tab';
import { TimetableTab } from './components/timetable-tab';
import { ResultsTab } from './components/results-tab';
import { CalendarTab } from './components/calendar-tab';
import { Loader2, BookOpen, Clock, Calendar, GraduationCap, LayoutDashboard } from 'lucide-react';

export default function AcademicsPage() {
  const { data, isLoading, error } = useAcademicsData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Failed to load academics data</h2>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academics Hub</h1>
        <p className="text-muted-foreground mt-1">Manage your attendance, schedule, and academic performance.</p>
      </div>

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden border-b rounded-none bg-transparent p-0 h-auto gap-4">
          <TabsTrigger 
            value="attendance" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 text-sm font-medium"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger 
            value="timetable" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 text-sm font-medium"
          >
            <Clock className="w-4 h-4 mr-2" />
            Timetable
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 text-sm font-medium"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Results & Grades
          </TabsTrigger>
          <TabsTrigger 
            value="calendar" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 text-sm font-medium"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Academic Calendar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance">
          <AttendanceTab data={data} />
        </TabsContent>
        
        <TabsContent value="timetable">
          <TimetableTab data={data} />
        </TabsContent>
        
        <TabsContent value="results">
          <ResultsTab data={data} />
        </TabsContent>
        
        <TabsContent value="calendar">
          <CalendarTab data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
