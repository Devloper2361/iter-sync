import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, History, Users, MessageSquare, Tent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export function CommunitySearch() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query) {
      // Mock search routing
      setIsFocused(false);
      alert(`Mock: Searching for "${query}"`);
    }
  };

  return (
    <div className="relative max-w-2xl w-full">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search posts, Q&A, groups, or people..."
          className="pl-10 bg-muted/50 border-transparent focus-visible:border-primary focus-visible:bg-background transition-all shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleSearch}
        />
      </div>
      
      {isFocused && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg border-muted">
          <CardContent className="p-0">
            {query ? (
              <div className="p-2 space-y-1">
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search Results</div>
                <div className="px-3 py-2 text-sm hover:bg-muted cursor-pointer rounded-md flex items-center gap-2 transition-colors">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  Search for &quot;{query}&quot;
                </div>
                <div className="px-3 py-2 text-sm hover:bg-muted cursor-pointer rounded-md flex items-center gap-2 transition-colors">
                  <Users className="w-4 h-4 text-primary" />
                  Find people named &quot;{query}&quot;
                </div>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  Recent Searches
                </div>
                <div className="px-3 py-2 text-sm hover:bg-muted cursor-pointer rounded-md flex items-center gap-2 transition-colors">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span>Midterm syllabus <span className="text-xs text-muted-foreground ml-2">in Q&A</span></span>
                </div>
                <div className="px-3 py-2 text-sm hover:bg-muted cursor-pointer rounded-md flex items-center gap-2 transition-colors">
                  <Tent className="w-4 h-4 text-muted-foreground" />
                  <span>Coding club timings <span className="text-xs text-muted-foreground ml-2">in Clubs</span></span>
                </div>
                <div className="px-3 py-2 text-sm hover:bg-muted cursor-pointer rounded-md flex items-center gap-2 transition-colors">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  Data structures help
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
