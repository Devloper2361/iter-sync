"use client"
import { useClubPosts } from '@/hooks/use-clubs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PostCard } from '@/components/community/post-card';
import { PostComposer } from '@/components/community/post-composer';

interface ClubFeedTabProps {
  clubId: string;
}

export function ClubFeedTab({ clubId }: ClubFeedTabProps) {
  const { data: posts, isLoading } = useClubPosts(clubId);

  return (
    <div className="pt-6 space-y-6 animate-in fade-in duration-500">
      <PostComposer />
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center border-2 border-dashed rounded-lg">
              <p className="font-medium">No announcements yet</p>
              <p className="text-sm mt-1">Be the first to share something with the club.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
