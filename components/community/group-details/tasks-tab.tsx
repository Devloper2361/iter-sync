"use client"
import { useGroupTasks } from '@/hooks/use-study-groups';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckCircle2, Clock, Circle, CalendarIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface TasksTabProps {
  groupId: string;
}

export function TasksTab({ groupId }: TasksTabProps) {
  const { data: tasks, isLoading } = useGroupTasks(groupId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'InProgress': return <Clock className="w-5 h-5 text-amber-500" />;
      default: return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return <span className="text-[10px] bg-red-500/10 text-red-600 px-1.5 py-0.5 rounded-md">High</span>;
      case 'Medium': return <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-md">Medium</span>;
      default: return <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-md">Low</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold tracking-tight">Assigned Tasks</h3>
        <Button className="shadow-sm h-9" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      <div className="space-y-3">
        {tasks && tasks.length > 0 ? (
          tasks.map(task => (
            <Card key={task.id} className="shadow-none border bg-card/50 hover:bg-card hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5 shrink-0 cursor-pointer">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className={`font-semibold text-sm ${task.status === 'Completed' ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {task.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {getPriorityBadge(task.priority)}
                      <span className="flex items-center text-[10px] text-muted-foreground font-medium bg-muted px-1.5 py-0.5 rounded-md">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 self-end sm:self-auto sm:ml-0 mt-2 sm:mt-0">
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 border shadow-sm">
                        <AvatarImage src={task.assignee.avatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                          {task.assignee.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ) : (
                    <Button variant="secondary" size="sm" className="h-7 text-xs">Assign to me</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center border-2 border-dashed rounded-xl">
            <AlertCircle className="w-10 h-10 mb-3 text-muted/50" />
            <p className="font-medium text-sm">No tasks assigned</p>
            <p className="text-xs mt-1">Create a task to keep the group organized.</p>
          </div>
        )}
      </div>
    </div>
  );
}
