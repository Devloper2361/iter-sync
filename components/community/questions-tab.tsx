import { useState } from 'react';
import { useQuestions } from '@/hooks/use-questions';
import { QuestionCard } from './question-card';
import { QuestionComposer } from './question-composer';
import { Loader2, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function QuestionsTab() {
  const { data: questions, isLoading } = useQuestions();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('newest');

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const filteredQuestions = questions
    ?.filter(q => q.title.toLowerCase().includes(search.toLowerCase()) || q.body.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (filter === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filter === 'votes') return (b.upvotes - (b.downvotes || 0)) - (a.upvotes - (a.downvotes || 0));
      if (filter === 'unanswered') return a.answersCount === 0 ? -1 : 1;
      return 0;
    });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <QuestionComposer />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-3 rounded-lg border">
        <h2 className="text-xl font-semibold hidden sm:block">All Questions</h2>
        
        <div className="flex-1 flex items-center gap-3 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search questions..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px] bg-background">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="votes">Most Votes</SelectItem>
              <SelectItem value="unanswered">Unanswered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredQuestions?.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
            <h3 className="text-lg font-medium">No questions found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredQuestions?.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        )}
      </div>
    </div>
  );
}
