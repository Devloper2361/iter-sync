import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function CommunitySearch() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div className="relative max-w-2xl w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search posts, questions, groups, clubs..."
          className="pl-10 bg-muted/50 border-transparent focus-visible:border-primary transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </div>
      
      {isFocused && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent Searches</h4>
            <div className="space-y-2">
              <div className="text-sm cursor-pointer hover:text-primary transition-colors">Midterm syllabus</div>
              <div className="text-sm cursor-pointer hover:text-primary transition-colors">Coding club timings</div>
              <div className="text-sm cursor-pointer hover:text-primary transition-colors">Data structures help</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
