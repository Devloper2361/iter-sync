import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, MessageSquare, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useQuestions } from '@/hooks/use-questions';

export function DiscussionSidebar({ postContent }: { postContent?: string }) {
  const trendingTags = ['react', 'internships', 'hackathon', 'projects', 'ai', 'ui-ux'];
  const popularDiscussions = [
    { title: 'Best resources for learning React Query?', comments: 24 },
    { title: 'Upcoming Tech Symposium details', comments: 18 },
    { title: 'Seeking team members for AI Hackathon', comments: 12 },
  ];
  
  const { data: questions } = useQuestions();
  const topQuestions = questions?.slice(0, 3) || [];
  
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSummarize = () => {
    setIsSummarizing(true);
    setTimeout(() => {
      setSummary("This discussion focuses on the upcoming midterm structure and study resources. Key points include using active recall, reviewing chapter 4 thoroughly, and forming study groups this weekend.");
      setIsSummarizing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 hidden lg:block sticky top-24">
      {postContent && (
        <Card className="shadow-sm border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-900 overflow-hidden">
          <CardHeader className="pb-3 bg-indigo-50 dark:bg-indigo-900/30">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" /> AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {summary ? (
              <p className="text-sm text-foreground leading-relaxed animate-in fade-in">{summary}</p>
            ) : (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-3">Too long to read? Get a quick AI-generated summary of this post and its top comments.</p>
                <Button variant="outline" size="sm" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-100 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900" onClick={handleSummarize} disabled={isSummarizing}>
                  {isSummarizing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Summarizing...</>
                  ) : (
                    "Generate Summary"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border-muted/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Trending Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map(tag => (
              <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {topQuestions.length > 0 && (
        <Card className="shadow-sm border-muted/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" /> Related Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topQuestions.map((q) => (
              <div key={q.id} className="group cursor-pointer">
                <Link href={`/community/question/${q.id}`}>
                  <h4 className="text-sm font-medium leading-tight group-hover:text-indigo-600 group-hover:underline transition-colors line-clamp-2">
                    {q.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {q.answersCount}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      ▲ {q.upvotes - (q.downvotes || 0)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border-muted/60 bg-primary/5 border-primary/10">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold">Join the discussion</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Be respectful and helpful.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
