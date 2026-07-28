"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityFeed } from '@/components/community/community-feed';
import { QuestionsTab } from '@/components/community/questions-tab';
import { StudyGroupsTab } from '@/components/community/study-groups-tab';
import { ClubsTab } from '@/components/community/clubs-tab';
import { CommunitySearch } from '@/components/community/community-search';
import { CommunityNotifications } from '@/components/community/community-notifications';
import { Rss, HelpCircle, Users, Tent } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Hub</h1>
          <p className="text-muted-foreground mt-1">Connect, share, and collaborate with your campus network.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-80">
             <CommunitySearch />
          </div>
          <CommunityNotifications />
        </div>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden border-b rounded-none bg-transparent p-0 h-auto gap-4">
          <TabsTrigger 
            value="feed" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 text-sm font-medium"
          >
            <Rss className="w-4 h-4 mr-2" />
            Home Feed
          </TabsTrigger>
          <TabsTrigger 
            value="qa" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 text-sm font-medium"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Q&A Forum
          </TabsTrigger>
          <TabsTrigger 
            value="groups" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 text-sm font-medium"
          >
            <Users className="w-4 h-4 mr-2" />
            Study Groups
          </TabsTrigger>
          <TabsTrigger 
            value="clubs" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 text-sm font-medium"
          >
            <Tent className="w-4 h-4 mr-2" />
            Clubs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="pt-6">
          <CommunityFeed />
        </TabsContent>
        
        <TabsContent value="qa" className="pt-6">
          <QuestionsTab />
        </TabsContent>
        
        <TabsContent value="groups" className="pt-6">
          <StudyGroupsTab />
        </TabsContent>
        
        <TabsContent value="clubs" className="pt-6">
          <ClubsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
