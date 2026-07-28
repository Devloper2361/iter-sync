import { useState, useMemo } from 'react';
import { useCommunityFeed } from '@/hooks/use-community';
import { PostCard } from './post-card';
import { PostComposer } from './post-composer';
import { Loader2, TrendingUp, Filter, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CommunityFeed() {
  const { data: posts, isLoading, error } = useCommunityFeed();
  const [filter, setFilter] = useState('Latest');
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const postsPerPage = 5;
  
  // Mock trending tags
  const trendingTags = ['ComputerScience', 'Midterms', 'CampusLife', 'Hackathon2026', 'Internships'];

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let filtered = [...posts];
    if (filter === 'Trending') {
      filtered = filtered.filter(post => post.likes > 10 || post.commentsCount > 2);
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (filter === 'Following') {
      // Mock following filter
      filtered = filtered.filter(post => post.author.role === 'Faculty' || post.author.role === 'Admin');
    } else {
      // Latest
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return filtered;
  }, [posts, filter]);

  const paginatedPosts = filteredPosts.slice(0, page * postsPerPage);
  const hasMore = paginatedPosts.length < filteredPosts.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage(p => p + 1);
      setIsLoadingMore(false);
    }, 500);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Main Feed */}
      <div className="flex-1 max-w-3xl">
        <PostComposer />
        
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div className="flex gap-4">
            <button 
              className={`text-sm font-medium pb-2 border-b-2 transition-colors ${filter === 'Latest' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              onClick={() => handleFilterChange('Latest')}
            >
              Latest
            </button>
            <button 
              className={`text-sm font-medium pb-2 border-b-2 transition-colors ${filter === 'Trending' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              onClick={() => handleFilterChange('Trending')}
            >
              Trending
            </button>
            <button 
              className={`text-sm font-medium pb-2 border-b-2 transition-colors ${filter === 'Following' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              onClick={() => handleFilterChange('Following')}
            >
              Following
            </button>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {error ? (
          <div className="p-8 text-center border rounded-lg bg-destructive/10 text-destructive">
            <p className="font-semibold">Failed to load feed</p>
            <p className="text-sm mt-1">Please try again later.</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : paginatedPosts.length > 0 ? (
          <div className="space-y-4">
            {paginatedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            
            {hasMore && (
              <div className="flex justify-center p-6">
                <Button 
                  variant="outline" 
                  className="w-full max-w-xs text-muted-foreground"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
            {!hasMore && paginatedPosts.length > 0 && (
              <div className="text-center p-6 text-sm text-muted-foreground">
                You have caught up with all posts.
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center border-2 border-dashed rounded-lg text-muted-foreground">
            <Inbox className="w-12 h-12 mx-auto mb-4 text-muted" />
            <p className="font-semibold">No posts found</p>
            <p className="text-sm mt-1">Try changing your filters or be the first to post!</p>
          </div>
        )}
      </div>

      {/* Right Sidebar - Trending */}
      <div className="w-full lg:w-80 space-y-6 hidden lg:block">
        <div className="bg-card border rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-lg mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            Trending Topics
          </div>
          <div className="space-y-3">
            {trendingTags.map((tag, i) => (
              <div key={tag} className="flex justify-between items-center group cursor-pointer">
                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">#{tag}</span>
                <span className="text-xs text-muted-foreground">{120 - i * 15} posts</span>
              </div>
            ))}
          </div>
          <Button variant="link" className="w-full mt-4 text-xs h-auto p-0 text-muted-foreground hover:text-primary">
            View all topics
          </Button>
        </div>
        
        <div className="bg-card border rounded-lg p-5 shadow-sm">
          <div className="font-semibold text-lg mb-4">Featured Discussions</div>
          <div className="space-y-4">
            <div className="cursor-pointer group">
              <p className="text-sm font-medium group-hover:text-primary line-clamp-2 transition-colors">What are the best electives for 3rd semester CS students?</p>
              <p className="text-xs text-muted-foreground mt-1">45 replies • Academics</p>
            </div>
            <div className="cursor-pointer group">
              <p className="text-sm font-medium group-hover:text-primary line-clamp-2 transition-colors">Upcoming campus hackathon: team formation thread</p>
              <p className="text-xs text-muted-foreground mt-1">112 replies • Events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
