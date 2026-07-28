'use client';

import { useQuestion, useAnswers, useToggleQuestionVote } from '@/hooks/use-questions';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, ArrowLeft, ArrowBigUp, ArrowBigDown, Eye, MessageSquare, Clock, Share2, BookmarkPlus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow, format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { AnswerCard } from '@/components/community/question-details/answer-card';
import { AnswerComposer } from '@/components/community/question-details/answer-composer';
import { Badge } from '@/components/ui/badge';
import { UserHoverCard } from '@/components/community/post-details/user-hover-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { DiscussionSidebar } from '@/components/community/post-details/discussion-sidebar';

export default function QuestionDetailsPage({ params }: { params: { id: string } }) {
  const { data: question, isLoading: qLoading } = useQuestion(params.id);
  const { data: answers, isLoading: aLoading } = useAnswers(params.id);
  const { user } = useAuth();
  const toggleVote = useToggleQuestionVote();
  
  const [sortOrder, setSortOrder] = useState('votes');

  if (qLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!question) {
    return <div className="text-center py-12">Question not found.</div>;
  }

  const score = question.upvotes - (question.downvotes || 0);
  const isAuthor = user?.id === question.author.id;

  const sortedAnswers = [...(answers || [])].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    if (sortOrder === 'votes') {
      return (b.upvotes - (b.downvotes || 0)) - (a.upvotes - (a.downvotes || 0));
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-8">
          <div className="flex items-center gap-2 mb-2">
        <Link href="/community">
          <Button variant="ghost" size="sm" className="text-muted-foreground -ml-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Q&A
          </Button>
        </Link>
      </div>

      {/* Question Header */}
      <div className="space-y-4 border-b pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">{question.title}</h1>
          <Button variant="outline" className="shrink-0 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-800">
            Ask Question
          </Button>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-foreground">Asked</span>
            <time title={format(new Date(question.createdAt), 'PPpp')}>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</time>
          </div>
          {question.updatedAt && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">Modified</span>
              <time title={format(new Date(question.updatedAt), 'PPpp')}>{formatDistanceToNow(new Date(question.updatedAt), { addSuffix: true })}</time>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-foreground">Viewed</span>
            <span>{question.views} times</span>
          </div>
        </div>
      </div>

      {/* Question Body & Voting */}
      <div className="flex gap-4 sm:gap-6 w-full">
        <div className="flex flex-col items-center gap-1 pt-2 shrink-0 w-10 sm:w-14">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => toggleVote.mutate({ id: question.id, type: 'up' })}
            className={`rounded-full h-10 w-10 ${question.isUpvotedByMe ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <ArrowBigUp className={`w-8 h-8 ${question.isUpvotedByMe ? 'fill-indigo-600' : ''}`} />
          </Button>
          <span className="text-2xl font-bold text-foreground">{score}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => toggleVote.mutate({ id: question.id, type: 'down' })}
            className={`rounded-full h-10 w-10 ${question.isDownvotedByMe ? 'text-red-600 bg-red-50 dark:bg-red-900/30' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <ArrowBigDown className={`w-8 h-8 ${question.isDownvotedByMe ? 'fill-red-600' : ''}`} />
          </Button>
          
          <Button variant="ghost" size="icon" className="mt-4 rounded-full text-muted-foreground hover:text-amber-500 hover:bg-amber-50" title="Bookmark">
            <BookmarkPlus className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-6">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.body}</ReactMarkdown>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {question.department && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                {question.department}
              </Badge>
            )}
            {question.difficulty && (
              <Badge variant="secondary" className={`border ${
                question.difficulty === 'Beginner' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30' :
                question.difficulty === 'Intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/30' :
                question.difficulty === 'Advanced' ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/30' :
                'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/30'
              }`}>
                {question.difficulty}
              </Badge>
            )}
            {question.tags.map(tag => (
              <span key={tag} className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1.5 rounded-md text-secondary-foreground font-medium transition-colors cursor-pointer flex items-center gap-1">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted h-8 px-2.5">
                Share
              </Button>
              {isAuthor && (
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted h-8 px-2.5">
                  Edit
                </Button>
              )}
            </div>
            
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-lg p-3 w-full sm:w-64">
              <span className="text-[11px] text-muted-foreground block uppercase tracking-wider mb-2">
                Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </span>
              <div className="flex items-center gap-3">
                <UserHoverCard author={question.author}>
                  <Avatar className="h-10 w-10 cursor-pointer border shadow-sm">
                    <AvatarImage src={question.isAnonymous ? undefined : question.author.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary">{question.isAnonymous ? 'A' : question.author.name[0]}</AvatarFallback>
                  </Avatar>
                </UserHoverCard>
                <UserHoverCard author={question.author}>
                  <div className="flex flex-col cursor-pointer">
                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 hover:underline">
                      {question.isAnonymous ? 'Anonymous' : question.author.name}
                    </span>
                    {question.author.department && !question.isAnonymous && (
                      <span className="text-xs text-muted-foreground line-clamp-1">{question.author.department}</span>
                    )}
                  </div>
                </UserHoverCard>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            {question.answersCount} {question.answersCount === 1 ? 'Answer' : 'Answers'}
          </h2>
          {question.answersCount > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[160px] h-9 bg-transparent border-muted-foreground/20">
                  <SelectValue placeholder="Highest score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="votes">Highest score</SelectItem>
                  <SelectItem value="newest">Newest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {aLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : sortedAnswers.length === 0 ? (
          <div className="text-center py-16 bg-muted/10 border-2 border-dashed rounded-lg text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-foreground">No answers yet</h3>
            <p className="mt-1">Be the first to share your knowledge!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedAnswers.map(answer => (
              <AnswerCard key={answer.id} answer={answer} isQuestionAuthor={isAuthor} />
            ))}
          </div>
        )}
      </div>

      <AnswerComposer questionId={question.id} />
        </div>
        <div className="w-full lg:w-80 shrink-0 mt-12 lg:mt-0">
          <DiscussionSidebar postContent={question.body} />
        </div>
      </div>
    </div>
  );
}
