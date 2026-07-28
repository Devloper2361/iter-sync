"use client"
import { useAuth } from '@/hooks/use-auth';
import { useDashboardData } from '@/hooks/use-dashboard';
import { format } from 'date-fns';
import { StatCard } from '@/components/shared/stat-card';
import { SectionCard } from '@/components/shared/section-card';
import { ActivityTimeline } from '@/components/shared/activity-timeline';
import { AnnouncementCard } from '@/components/shared/announcement-card';
import { ScheduleTimeline } from '@/components/shared/schedule-timeline';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, GraduationCap, BookOpen, Clock, Calendar, Bell, ArrowRight, Users, Bot } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: dashboard, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Failed to load dashboard</h2>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground font-medium mb-1">
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Good Morning, <span className="text-primary">{user?.name.split(' ')[0]}</span>
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <span>{user?.department}</span>
            <span>&bull;</span>
            <span>Semester {user?.semester}</span>
          </div>
        </div>
        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 max-w-sm">
          <p className="text-sm italic text-muted-foreground">&quot;{dashboard.quote}&quot;</p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Attendance" value={`${dashboard.stats.attendance}%`} icon={CheckCircle2} />
        <StatCard title="CGPA" value={dashboard.stats.cgpa} icon={GraduationCap} />
        <StatCard title="Credits" value={dashboard.stats.currentCredits} icon={BookOpen} />
        <StatCard title="Assignments" value={dashboard.stats.pendingAssignments} icon={Clock} />
        <StatCard title="Exams" value={dashboard.stats.upcomingExams} icon={Calendar} />
        <StatCard title="Notifications" value={dashboard.stats.unreadNotifications} icon={Bell} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <SectionCard 
            title="Today's Schedule" 
            description="Your classes and events for today."
            action={
              <Button variant="ghost" size="sm" asChild>
                <Link href="/academics">View full schedule <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            }
          >
            <ScheduleTimeline schedule={dashboard.schedule} />
          </SectionCard>

          {/* Recent Activity */}
          <SectionCard title="Recent Activity" description="Latest updates across the campus.">
            <ActivityTimeline activities={dashboard.activities} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          {/* Announcements */}
          <SectionCard title="Announcements" description="Important notices and updates.">
            <div className="space-y-4">
              {dashboard.announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/campus">View all announcements</Link>
            </Button>
          </SectionCard>

          {/* Quick Actions */}
          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2" asChild>
                <Link href="/academics">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-xs">Mark Attendance</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2" asChild>
                <Link href="/academics">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-xs">Academic Calendar</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2" asChild>
                <Link href="/community">
                  <Users className="w-5 h-5 text-orange-500" />
                  <span className="text-xs">Join Clubs</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2" asChild>
                <Link href="/ai-assistant">
                  <Bot className="w-5 h-5 text-purple-500" />
                  <span className="text-xs">Ask AI</span>
                </Link>
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
