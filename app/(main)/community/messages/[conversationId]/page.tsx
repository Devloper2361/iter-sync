"use client"
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DiscussionTab } from '@/components/community/group-details/discussion-tab';

export default function DirectMessagePage({ params }: { params: { conversationId: string } }) {
  return (
    <div className="max-w-4xl mx-auto pb-8 px-2 sm:px-6 pt-4 sm:pt-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4 shrink-0 flex items-center justify-between">
        <Link href="/marketplace" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
        </Link>
        <h1 className="text-xl font-semibold">Private Chat</h1>
      </div>
      
      <div className="flex flex-1 min-h-0 bg-background rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-col flex-1 min-w-0 h-[70vh] max-h-[800px]">
          <DiscussionTab groupId={params.conversationId} />
        </div>
      </div>
    </div>
  );
}
