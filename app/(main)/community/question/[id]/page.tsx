"use client"

import { useQuestion, useAnswers } from '@/hooks/use-questions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, ArrowBigUp, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function QuestionDetailsPage({ params }: { params: { id: string } }) {
  const { data: question, isLoading: qLoading } = useQuestion(params.id);
  const { data: answers, isLoading: aLoading } = useAnswers(params.id);
  const [replyText, setReplyText] = useState('');

  if (qLoading) return <div className="p-8 text-center">Loading question...</div>;
  if (!question) return <div className="p-8 text-center text-destructive">Question not found.</div>;

  const handleAnswerSubmit = () => {
    if (!replyText) return;
    alert('Mock: Answer submitted');
    setReplyText('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <Link href="/community" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Q&A
      </Link>

      <div className="flex gap-4">
        {/* Upvote Column */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <Button variant="ghost" size="icon" className={`rounded-full ${question.isUpvotedByMe ? 'text-primary' : 'text-muted-foreground'}`}>
            <ArrowBigUp className={`w-8 h-8 ${question.isUpvotedByMe ? 'fill-primary' : ''}`} />
          </Button>
          <span className="text-xl font-bold">{question.upvotes}</span>
        </div>

        {/* Question Content */}
        <Card className="flex-1">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
            <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
              <p className="whitespace-pre-wrap leading-relaxed">{question.body}</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map(tag => (
                <span key={tag} className="text-xs bg-secondary px-2.5 py-1 rounded-full text-secondary-foreground font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={question.author.avatarUrl} />
                <AvatarFallback>{question.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{question.author.name}</p>
                <p className="text-xs text-muted-foreground">Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {question.views} Views
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6 pl-14">
        <h3 className="text-xl font-bold border-b pb-2">{question.answersCount} Answers</h3>
        
        {/* Your Answer Input */}
        <Card>
          <CardContent className="p-4 space-y-4">
             <h4 className="font-semibold text-sm">Your Answer</h4>
             <textarea 
                placeholder="Write your answer here in detail..." 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full min-h-[100px] p-3 rounded-md border bg-transparent resize-y text-sm"
              />
              <div className="flex justify-end">
                <Button onClick={handleAnswerSubmit} disabled={!replyText}>
                  Submit Answer
                </Button>
              </div>
          </CardContent>
        </Card>

        {aLoading ? (
          <div className="text-center py-4 text-muted-foreground">Loading answers...</div>
        ) : answers?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No answers yet.</div>
        ) : (
          <div className="space-y-6">
            {answers?.map(answer => (
              <div key={answer.id} className="flex gap-4">
                <div className="flex flex-col items-center gap-2 pt-2">
                  <Button variant="ghost" size="icon" className={`rounded-full h-8 w-8 ${answer.isUpvotedByMe ? 'text-primary' : 'text-muted-foreground'}`}>
                    <ArrowBigUp className={`w-6 h-6 ${answer.isUpvotedByMe ? 'fill-primary' : ''}`} />
                  </Button>
                  <span className="text-lg font-bold">{answer.upvotes}</span>
                  {answer.isAccepted && (
                    <CheckCircle2 className="w-6 h-6 text-green-500 mt-2" />
                  )}
                </div>
                
                <Card className={`flex-1 ${answer.isAccepted ? 'border-green-500/50 ring-1 ring-green-500/20' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                      <p className="whitespace-pre-wrap leading-relaxed">{answer.body}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/20 border-t p-4 flex justify-between items-center">
                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-2">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">Answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={answer.author.avatarUrl} />
                        <AvatarFallback>{answer.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{answer.author.name}</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
