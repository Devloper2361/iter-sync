import { useState } from 'react';
import { Answer } from '@/types/community';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ArrowBigUp, ArrowBigDown, CheckCircle2, Trash2, Reply } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/hooks/use-auth';
import { useToggleAnswerVote, useDeleteAnswer, useAcceptAnswer, useReplyToAnswer } from '@/hooks/use-questions';
import { UserHoverCard } from '../post-details/user-hover-card';
import { CommentComposer } from '../post-details/comment-composer';
import { CommentCard } from '../post-details/comment-card';

interface AnswerCardProps {
  answer: Answer;
  isQuestionAuthor: boolean;
}

export function AnswerCard({ answer, isQuestionAuthor }: AnswerCardProps) {
  const { user } = useAuth();
  const toggleVote = useToggleAnswerVote();
  const deleteAnswer = useDeleteAnswer();
  const acceptAnswer = useAcceptAnswer();
  const replyToAnswer = useReplyToAnswer();
  
  const [showReply, setShowReply] = useState(false);
  const isAuthor = user?.id === answer.author.id;
  const score = answer.upvotes - (answer.downvotes || 0);

  const handleVote = (type: 'up' | 'down') => {
    toggleVote.mutate({ id: answer.id, questionId: answer.questionId, type });
  };

  const handleReplySubmit = async (content: string, images?: string[]) => {
    if (!user) return;
    
    return new Promise<void>((resolve, reject) => {
      replyToAnswer.mutate({
        answerId: answer.id,
        questionId: answer.questionId,
        reply: {
          postId: answer.id, 
          author: {
            id: user.id,
            name: user.name,
            avatarUrl: user.avatar,
            role: 'Student'
          },
          content,
          likes: 0,
          replies: []
        }
      }, {
        onSuccess: () => {
          setShowReply(false);
          resolve();
        },
        onError: () => reject()
      });
    });
  };

  const mockFn = async () => {};

  return (
    <div className="flex gap-4 sm:gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center gap-1 shrink-0 pt-2 w-10 sm:w-14">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleVote('up')}
          className={`rounded-full h-10 w-10 ${answer.isUpvotedByMe ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'text-muted-foreground hover:bg-muted'}`}
        >
          <ArrowBigUp className={`w-8 h-8 ${answer.isUpvotedByMe ? 'fill-indigo-600' : ''}`} />
        </Button>
        
        <span className="text-xl font-bold text-foreground">{score}</span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleVote('down')}
          className={`rounded-full h-10 w-10 ${answer.isDownvotedByMe ? 'text-red-600 bg-red-50 dark:bg-red-900/30' : 'text-muted-foreground hover:bg-muted'}`}
        >
          <ArrowBigDown className={`w-8 h-8 ${answer.isDownvotedByMe ? 'fill-red-600' : ''}`} />
        </Button>
        
        {answer.isAccepted && (
          <div className="mt-4" title="Accepted Answer">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
          </div>
        )}
        
        {!answer.isAccepted && isQuestionAuthor && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => acceptAnswer.mutate({ answerId: answer.id, questionId: answer.questionId })}
            className="mt-4 h-10 w-10 rounded-full text-muted-foreground hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
            title="Accept this answer"
          >
            <CheckCircle2 className="w-8 h-8" />
          </Button>
        )}
      </div>

      <Card className={`flex-1 overflow-hidden transition-all ${answer.isAccepted ? 'border-emerald-200 bg-emerald-50/10 dark:border-emerald-900/50 dark:bg-emerald-950/10' : 'shadow-sm'}`}>
        <CardContent className="p-6">
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-6 font-medium text-foreground/90">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer.body}</ReactMarkdown>
          </div>
          
          <div className="flex justify-between items-end gap-4 mt-8 flex-wrap">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowReply(!showReply)} className="text-muted-foreground h-8 px-2.5">
                <Reply className="w-4 h-4 mr-2" />
                Reply
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-2.5">
                Share
              </Button>
              {isAuthor && (
                <Button variant="ghost" size="sm" className="text-destructive h-8 px-2.5 hover:bg-destructive/10" 
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this answer?')) {
                      deleteAnswer.mutate({ id: answer.id, questionId: answer.questionId });
                    }
                  }}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${answer.isAccepted ? 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' : 'bg-muted/30 border-muted'}`}>
              <div className="text-right">
                <span className="text-[11px] text-muted-foreground block uppercase tracking-wider mb-0.5">
                  Answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                </span>
                <UserHoverCard author={answer.author}>
                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 cursor-pointer hover:underline">
                    {answer.author.name}
                  </span>
                </UserHoverCard>
              </div>
              <UserHoverCard author={answer.author}>
                <Avatar className="h-10 w-10 cursor-pointer border ring-2 ring-transparent hover:ring-indigo-200 transition-all">
                  <AvatarImage src={answer.author.avatarUrl} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700">{answer.author.name[0]}</AvatarFallback>
                </Avatar>
              </UserHoverCard>
            </div>
          </div>
        </CardContent>
        
        {answer.replies && answer.replies.length > 0 && (
          <div className="bg-muted/10 border-t p-6 pb-2 space-y-4">
            {answer.replies.map(reply => (
              <CommentCard 
                key={reply.id} 
                comment={reply} 
                postId={answer.id}
                onReact={() => {}}
                onReply={mockFn}
                onEdit={mockFn}
                onDelete={mockFn}
                isNested={false} 
              />
            ))}
          </div>
        )}
        
        {showReply && (
          <div className="bg-muted/10 border-t p-6">
            <CommentComposer 
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReply(false)}
              autoFocus
            />
          </div>
        )}
      </Card>
    </div>
  );
}
