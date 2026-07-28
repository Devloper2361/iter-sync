"use client";

import { usePost, useComments, useReactToPost, useBookmarkPost, useSharePost, useCreateComment, useReplyToComment, useReactToComment, useDeleteComment, useEditComment } from '@/hooks/use-community';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, MoreHorizontal, Flag, Pin, Pencil, Trash2, Eye, Building2, Globe, Users, GraduationCap, Lock, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReactionType } from '@/types/community';

// Imported modular components
import { UserHoverCard } from '@/components/community/post-details/user-hover-card';
import { ImageGallery } from '@/components/community/post-details/image-gallery';
import { ReactionBar } from '@/components/community/post-details/reaction-bar';
import { BookmarkButton } from '@/components/community/post-details/bookmark-button';
import { ShareButton } from '@/components/community/post-details/share-button';
import { DiscussionSidebar } from '@/components/community/post-details/discussion-sidebar';
import { CommentComposer } from '@/components/community/post-details/comment-composer';
import { CommentCard } from '@/components/community/post-details/comment-card';

export default function PostDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: post, isLoading: postLoading } = usePost(params.id);
  const { data: comments, isLoading: commentsLoading } = useComments(params.id);

  const reactToPost = useReactToPost();
  const bookmarkPost = useBookmarkPost();
  const sharePost = useSharePost();
  
  const createComment = useCreateComment();
  const replyToComment = useReplyToComment();
  const reactToComment = useReactToComment();
  const deleteComment = useDeleteComment();
  const editComment = useEditComment();

  if (postLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading discussion...</div>;
  if (!post) return <div className="p-8 text-center text-destructive font-medium border border-destructive/20 rounded-lg bg-destructive/5 mx-4 mt-4">Post not found.</div>;

  const handlePostReact = (reaction: ReactionType) => reactToPost.mutate({ postId: post.id, reaction });
  const handlePostBookmark = () => bookmarkPost.mutate(post.id);
  
  const handleCommentSubmit = async (content: string, images?: string[]) => {
    if (!user) return;
    await createComment.mutateAsync({
      postId: post.id,
      content,
      author: {
        id: user.id || 'u1',
        name: user.name || 'User',
        avatarUrl: user.avatar,
        role: 'Student'
      },
      likes: 0,
      replies: []
    });
  };

  const handleReplySubmit = async (parentId: string, content: string, images?: string[]) => {
    if (!user) return;
    await replyToComment.mutateAsync({
      parentCommentId: parentId,
      reply: {
        postId: post.id,
        content,
        author: {
          id: user.id || 'u1',
          name: user.name || 'User',
          avatarUrl: user.avatar,
          role: 'Student'
        },
        likes: 0,
        replies: []
      }
    });
  };
  
  const handleCommentReact = (commentId: string, reaction: ReactionType) => {
    reactToComment.mutate({ commentId, postId: post.id, reaction });
  };
  
  const handleDeleteComment = async (commentId: string) => {
    await deleteComment.mutateAsync({ commentId, postId: post.id });
  };
  
  const handleEditComment = async (commentId: string, content: string) => {
    await editComment.mutateAsync({ commentId, postId: post.id, content });
  };

  const getVisibilityIcon = () => {
    switch(post.visibility) {
      case 'Everyone': return <Globe className="w-3 h-3 mr-1" />;
      case 'Department': return <Building2 className="w-3 h-3 mr-1" />;
      case 'Connections': return <Users className="w-3 h-3 mr-1" />;
      default: return <Globe className="w-3 h-3 mr-1" />;
    }
  };

  const isAuthor = user?.name === post.author.name;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl animate-in fade-in duration-500">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-muted -ml-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Community
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 xl:gap-8 relative items-start">
        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-sm border-muted overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                  <UserHoverCard author={post.author}>
                    <Avatar className="h-12 w-12 border cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                      <AvatarImage src={post.author.avatarUrl} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                  </UserHoverCard>
                  
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <UserHoverCard author={post.author}>
                        <span className="font-bold text-base hover:underline cursor-pointer">{post.author.name}</span>
                      </UserHoverCard>
                      {post.author.role === 'Faculty' && <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Faculty</Badge>}
                      <Badge variant="outline" className="text-[10px] h-4 px-1.5">{post.category}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center">
                        {getVisibilityIcon()}
                        {post.visibility}
                      </span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                      {post.views > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {post.views}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 rounded-full">
                      <MoreHorizontal className="w-5 h-5"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isAuthor ? (
                      <>
                        <DropdownMenuItem><Pin className="w-4 h-4 mr-2"/> Pin to Profile</DropdownMenuItem>
                        <DropdownMenuItem><Pencil className="w-4 h-4 mr-2"/> Edit Post</DropdownMenuItem>
                        <Separator className="my-1"/>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10"><Trash2 className="w-4 h-4 mr-2"/> Delete</DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem><Flag className="w-4 h-4 mr-2"/> Report Post</DropdownMenuItem>
                        <DropdownMenuItem><LockKeyhole className="w-4 h-4 mr-2"/> Block User</DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 pb-2">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-foreground leading-tight tracking-tight">{post.title}</h1>
              <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none mb-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
              </div>
              
              <ImageGallery images={post.images || []} />

              <div className="flex flex-wrap gap-2 mb-4 mt-6">
                {post.tags?.map(tag => (
                  <span key={tag} className="text-xs bg-secondary/60 hover:bg-secondary px-3 py-1.5 rounded-full text-secondary-foreground font-medium transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
              
            </CardContent>

            <Separator className="bg-muted/50" />
            
            <CardFooter className="flex justify-between items-center py-3 bg-muted/10">
               <div className="flex-1 flex justify-start">
                  <ReactionBar 
                    reactions={post.reactions} 
                    myReaction={post.myReaction} 
                    likes={post.likes} 
                    isLikedByMe={post.isLikedByMe}
                    onReact={handlePostReact} 
                  />
               </div>
               <div className="flex-1 flex justify-end gap-1">
                  <ShareButton url={`/community/post/${post.id}`} title={post.title} count={post.shareCount} showLabel={false} className="rounded-full" />
                  <BookmarkButton isBookmarked={post.isBookmarkedByMe} count={post.bookmarks} onToggle={handlePostBookmark} showLabel={false} className="rounded-full" />
               </div>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                Discussion <span className="text-sm font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">{post.commentsCount}</span>
              </h3>
            </div>
            
            <CommentComposer 
              onSubmit={handleCommentSubmit} 
              placeholder="Join the discussion... Markdown & images supported"
            />

            <Separator />

            {commentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-24 bg-muted rounded-2xl rounded-tl-none w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments?.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground bg-muted/30 border border-dashed rounded-2xl">
                <Users className="w-12 h-12 mx-auto text-muted mb-3 opacity-50" />
                <p className="font-medium text-foreground">No comments yet</p>
                <p className="text-sm mt-1">Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments?.map(comment => (
                  <CommentCard 
                    key={comment.id}
                    comment={comment}
                    postId={post.id}
                    onReact={handleCommentReact}
                    onReply={handleReplySubmit}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <DiscussionSidebar postContent={post.body} />
        </div>
      </div>
    </div>
  );
}
