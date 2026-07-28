export interface QuickStats {
  attendance: number;
  cgpa: number;
  currentCredits: number;
  pendingAssignments: number;
  upcomingExams: number;
  unreadNotifications: number;
}

export interface ScheduleItem {
  id: string;
  subject: string;
  faculty: string;
  room: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'attendance' | 'assignment' | 'exam' | 'community' | 'marketplace';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: Date;
  isPinned: boolean;
  isPriority: boolean;
  author: string;
}

export interface DashboardData {
  stats: QuickStats;
  schedule: ScheduleItem[];
  activities: ActivityItem[];
  announcements: Announcement[];
  quote: string;
}
