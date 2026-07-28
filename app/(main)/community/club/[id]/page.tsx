"use client"
import { useClub } from '@/hooks/use-clubs';
import { ArrowLeft, MessageSquare, FileText, Users, CalendarDays, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Club Components
import { ClubHeader } from '@/components/community/club-details/club-header';
import { ClubFeedTab } from '@/components/community/club-details/club-feed-tab';
import { ClubEventsTab } from '@/components/community/club-details/club-events-tab';
import { ClubMembersTab } from '@/components/community/club-details/club-members-tab';
import { ClubMediaTab } from '@/components/community/club-details/club-media-tab';
import { ClubAIFeatures } from '@/components/community/club-details/club-ai-features';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClubDetailsPage({ params }: { params: { id: string } }) {
  const { data: club, isLoading } = useClub(params.id);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-8 px-4 sm:px-6 mt-6">
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  if (!club) return <div className="p-8 text-center text-destructive font-medium">Club not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8 px-4 sm:px-6 pt-6">
      <Link href="/community?tab=clubs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-2">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Community
      </Link>
      
      <ClubHeader club={club} />

      <div className="flex flex-col lg:flex-row gap-8 pt-4">
        <div className="flex-1 min-w-0">
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden border-b rounded-none bg-transparent p-0 h-auto gap-2 sm:gap-6 flex-nowrap scrollbar-hide">
              <TabsTrigger 
                value="feed" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 text-sm font-medium whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4 mr-2 hidden sm:inline-block" />
                Feed
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 text-sm font-medium whitespace-nowrap"
              >
                <CalendarDays className="w-4 h-4 mr-2 hidden sm:inline-block" />
                Events
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 text-sm font-medium whitespace-nowrap"
              >
                <Users className="w-4 h-4 mr-2 hidden sm:inline-block" />
                Members
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 text-sm font-medium whitespace-nowrap"
              >
                <ImageIcon className="w-4 h-4 mr-2 hidden sm:inline-block" />
                Media
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed">
              <ClubFeedTab clubId={club.id} />
            </TabsContent>
            
            <TabsContent value="events">
              <ClubEventsTab clubId={club.id} />
            </TabsContent>

            <TabsContent value="members">
              <ClubMembersTab clubId={club.id} />
            </TabsContent>
            
            <TabsContent value="media">
              <ClubMediaTab clubId={club.id} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <ClubAIFeatures />
        </div>
      </div>
    </div>
  );
}
