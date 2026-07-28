"use client"
import { useState } from 'react';
import { useStudyGroup } from '@/hooks/use-study-groups';
import { ArrowLeft, MessageSquare, FileText, Users, CheckSquare, CalendarDays, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroupHeader } from '@/components/community/group-details/group-header';
import { GroupInfoSidebar } from '@/components/community/group-details/group-info-sidebar';
import { DiscussionTab } from '@/components/community/group-details/discussion-tab';
import { ResourcesTab } from '@/components/community/group-details/resources-tab';
import { MembersTab } from '@/components/community/group-details/members-tab';
import { TasksTab } from '@/components/community/group-details/tasks-tab';
import { CalendarTab } from '@/components/community/group-details/calendar-tab';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function GroupDetailsPage({ params }: { params: { id: string } }) {
  const { data: group, isLoading } = useStudyGroup(params.id);
  const [showSidebar, setShowSidebar] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-8 px-4 sm:px-6 mt-6 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!group) return <div className="p-8 text-center text-destructive font-medium">Study group not found.</div>;

  return (
    <div className="max-w-6xl mx-auto pb-8 px-2 sm:px-6 pt-4 sm:pt-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4 shrink-0">
        <Link href="/community?tab=groups" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Groups
        </Link>
      </div>
      
      <div className="flex flex-1 min-h-0 bg-background rounded-xl border shadow-sm overflow-hidden">
        
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 h-[70vh] max-h-[800px]">
          
          <GroupHeader group={group} onInfoClick={() => setShowSidebar(prev => !prev)} />

          <Tabs defaultValue="chat" className="flex flex-col flex-1 min-h-0">
            <div className="bg-muted/10 border-b shrink-0 px-2 sm:px-4">
              <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden rounded-none bg-transparent p-0 h-auto gap-2 sm:gap-6 flex-nowrap scrollbar-hide py-1">
                <TabsTrigger value="chat" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap">
                  <MessageSquare className="w-4 h-4 mr-2" /> Chat
                </TabsTrigger>
                <TabsTrigger value="files" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap">
                  <FileText className="w-4 h-4 mr-2 hidden sm:inline-block" /> Files
                </TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap">
                  <CheckSquare className="w-4 h-4 mr-2 hidden sm:inline-block" /> Tasks
                </TabsTrigger>
                <TabsTrigger value="calendar" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap">
                  <CalendarDays className="w-4 h-4 mr-2 hidden sm:inline-block" /> Calendar
                </TabsTrigger>
                <TabsTrigger value="members" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap">
                  <Users className="w-4 h-4 mr-2 hidden sm:inline-block" /> Members
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="chat" className="h-full m-0 data-[state=inactive]:hidden border-0 shadow-none p-0 rounded-none">
                <DiscussionTab groupId={group.id} />
              </TabsContent>
              <TabsContent value="files" className="h-full m-0 data-[state=inactive]:hidden p-4">
                <ResourcesTab groupId={group.id} />
              </TabsContent>
              <TabsContent value="tasks" className="h-full m-0 data-[state=inactive]:hidden p-4">
                <TasksTab groupId={group.id} />
              </TabsContent>
              <TabsContent value="calendar" className="h-full m-0 data-[state=inactive]:hidden p-4">
                <CalendarTab groupId={group.id} />
              </TabsContent>
              <TabsContent value="members" className="h-full m-0 data-[state=inactive]:hidden p-4">
                <MembersTab groupId={group.id} />
              </TabsContent>
            </div>
          </Tabs>

        </div>

        {/* Info Sidebar */}
        {showSidebar && (
          <div className="hidden md:block shrink-0 h-[70vh] max-h-[800px]">
            <GroupInfoSidebar group={group} onClose={() => setShowSidebar(false)} />
          </div>
        )}

      </div>
    </div>
  );
}
