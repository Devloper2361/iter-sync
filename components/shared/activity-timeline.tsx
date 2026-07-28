import { ActivityItem } from '@/types/dashboard';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, FileText, Calendar, Users, ShoppingBag, Circle } from 'lucide-react';

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const iconMap = {
  attendance: CheckCircle2,
  assignment: FileText,
  exam: Calendar,
  community: Users,
  marketplace: ShoppingBag,
};

const colorMap = {
  attendance: "text-green-500",
  assignment: "text-blue-500",
  exam: "text-purple-500",
  community: "text-orange-500",
  marketplace: "text-pink-500",
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {activities.map((activity, index) => {
        const Icon = iconMap[activity.type] || Circle;
        const color = colorMap[activity.type] || "text-primary";
        
        return (
          <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full border bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${color}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border bg-card shadow-sm">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-semibold text-sm text-foreground">{activity.title}</div>
                <time className="text-xs font-medium text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </time>
              </div>
              <div className="text-sm text-muted-foreground">{activity.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
