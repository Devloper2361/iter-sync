import { useCommunityFeed } from '@/hooks/use-community';
import { PostCard } from './post-card';
import { PostEditor } from './post-editor';
import { Loader2 } from 'lucide-react';

export function CommunityFeed() {
  const { data: posts, isLoading } = useCommunityFeed();

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PostEditor />
      <div className="space-y-4">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
