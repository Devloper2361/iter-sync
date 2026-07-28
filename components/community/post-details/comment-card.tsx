import { useState } from 'react';
import { Comment, ReactionType } from '@/types/community';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Flag, Pencil, Trash2, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { UserHoverCard } from './user-hover-card';
import { ReactionBar } from './reaction-bar';
import { CommentComposer } from './comment-composer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/hooks/use-auth';

interface CommentCardProps {
  comment: Comment;
  postId: string;
  onReact: (commentId: string, reaction: ReactionType) => void;
  onReply: (parentId: string, content: string, images?: string[]) => Promise<void>;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  isNested?: boolean;
}

export function CommentCard({ comment, postId, onReact, onReply, onEdit, onDelete, isNested = false }: CommentCardProps) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isAuthor = user?.name === comment.author.name; // mock auth check

  const handleReplySubmit = async (content: string, images?: string[]) => {
    await onReply(comment.id, content, images);
    setIsReplying(false);
  };

  const handleEditSubmit = async (content: string) => {
    await onEdit(comment.id, content);
    setIsEditing(false);
  };

  return (
    <div className={`flex gap-3 sm:gap-4 ${isNested ? 'mt-4' : ''}`}>
      <UserHoverCard author={comment.author}>
        <Avatar className={`cursor-pointer border shadow-sm ${isNested ? 'h-8 w-8' : 'h-10 w-10'}`}>
          <AvatarImage src={comment.author.avatarUrl} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
      </UserHoverCard>

      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="bg-card border shadow-sm p-3 sm:p-4 rounded-2xl rounded-tl-none">
          <div className="flex justify-between items-start mb-1 gap-4">
            <UserHoverCard author={comment.author}>
              <p className="font-semibold text-sm hover:underline cursor-pointer truncate">
                {comment.author.name}
              </p>
            </UserHoverCard>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground h-6 w-6 inline-flex items-center justify-center rounded-md hover:bg-muted"><MoreHorizontal className="w-4 h-4"/></button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAuthor && (
                    <>
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(comment.id)} className="text-destructive focus:bg-destructive/10">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </>
                  )}
                  {!isAuthor && (
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10">
                      <Flag className="w-4 h-4 mr-2" /> Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <CommentComposer 
                initialContent={comment.content}
                isEditing={true}
                onSubmit={handleEditSubmit}
                onCancel={() => setIsEditing(false)}
                autoFocus
              />
            </div>
          ) : (
            <div className="text-sm prose prose-sm dark:prose-invert max-w-none break-words">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.content}</ReactMarkdown>
            </div>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 px-1 text-xs text-muted-foreground font-medium pt-0.5">
            <ReactionBar 
              reactions={comment.reactions} 
              myReaction={comment.myReaction} 
              likes={comment.likes} 
              isLikedByMe={comment.isLikedByMe}
              onReact={(r) => onReact(comment.id, r)} 
            />
            
            {!isNested && (
              <button 
                className={`hover:text-foreground transition-colors flex items-center gap-1 ${isReplying ? 'text-primary' : ''}`}
                onClick={() => setIsReplying(!isReplying)}
              >
                <Reply className="w-3.5 h-3.5" /> Reply
              </button>
            )}
          </div>
        )}

        {isReplying && !isNested && (
          <div className="mt-3">
            <CommentComposer 
              placeholder={`Replying to ${comment.author.name}...`} 
              onSubmit={handleReplySubmit}
              onCancel={() => setIsReplying(false)}
              autoFocus
            />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-3 sm:pl-4 border-l-2 border-muted relative">
            {comment.replies.map((reply) => (
              <CommentCard 
                key={reply.id}
                comment={reply}
                postId={postId}
                onReact={onReact}
                onReply={onReply} // typically shouldn't nest more, but passing it
                onEdit={onEdit}
                onDelete={onDelete}
                isNested={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
