"use client"

import { usePost, useComments } from '@/hooks/use-community';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Heart, Share2, Bookmark, MoreHorizontal, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PostDetailsPage({ params }: { params: { id: string } }) {
  const { data: post, isLoading: postLoading } = usePost(params.id);
  const { data: comments, isLoading: commentsLoading } = useComments(params.id);
  const [replyText, setReplyText] = useState('');

  if (postLoading) return <div className="p-8 text-center">Loading post...</div>;
  if (!post) return <div className="p-8 text-center text-destructive">Post not found.</div>;

  const handleCommentSubmit = () => {
    if (!replyText) return;
    alert('Mock: Comment added');
    setReplyText('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <Link href="/community" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Community
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.author.avatarUrl} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {post.author.department} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
            <p className="whitespace-pre-wrap leading-relaxed">{post.body}</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs bg-secondary px-2.5 py-1 rounded-full text-secondary-foreground font-medium">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground border-y py-4">
            <span className="font-medium text-foreground">{post.likes} Likes</span>
            <span className="font-medium text-foreground">{post.commentsCount} Comments</span>
            <span className="font-medium text-foreground">{post.shareCount} Shares</span>
            <span className="font-medium text-foreground">{post.views} Views</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-4">
          <Button variant="ghost" className={`flex-1 ${post.isLikedByMe ? 'text-primary' : 'text-muted-foreground'}`}>
            <Heart className={`w-5 h-5 mr-2 ${post.isLikedByMe ? 'fill-primary' : ''}`} />
            Like
          </Button>
          <Button variant="ghost" className="flex-1 text-muted-foreground">
            <MessageSquare className="w-5 h-5 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" className="flex-1 text-muted-foreground">
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
          <Button variant="ghost" className={`flex-1 ${post.isBookmarkedByMe ? 'text-primary' : 'text-muted-foreground'}`}>
            <Bookmark className={`w-5 h-5 mr-2 ${post.isBookmarkedByMe ? 'fill-primary' : ''}`} />
            Save
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        <h3 className="text-xl font-bold">Comments</h3>
        
        <Card>
          <CardContent className="p-4 flex gap-4 items-start">
             <Avatar className="h-10 w-10 mt-1">
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input 
                placeholder="Write a comment..." 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
              />
              <Button onClick={handleCommentSubmit} disabled={!replyText}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {commentsLoading ? (
          <div className="text-center py-4 text-muted-foreground">Loading comments...</div>
        ) : comments?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to start the discussion!</div>
        ) : (
          <div className="space-y-4">
            {comments?.map(comment => (
              <Card key={comment.id} className="bg-transparent border-none shadow-none">
                <CardContent className="p-0 flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.author.avatarUrl} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="bg-muted p-3 rounded-2xl rounded-tl-none">
                      <p className="font-semibold text-sm">{comment.author.name}</p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 px-2 text-xs text-muted-foreground font-medium">
                      <button className="hover:text-primary transition-colors">Like</button>
                      <button className="hover:text-primary transition-colors">Reply</button>
                      <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                      {comment.likes > 0 && (
                        <span className="flex items-center text-primary">
                          <Heart className="w-3 h-3 fill-primary mr-1" />
                          {comment.likes}
                        </span>
                      )}
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 space-y-4 pl-4 border-l-2">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.author.avatarUrl} />
                              <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="bg-muted p-3 rounded-2xl rounded-tl-none">
                                <p className="font-semibold text-xs">{reply.author.name}</p>
                                <p className="text-sm">{reply.content}</p>
                              </div>
                               <div className="flex items-center gap-4 px-2 text-xs text-muted-foreground font-medium">
                                <button className="hover:text-primary transition-colors">Like</button>
                                <span>{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
                                {reply.likes > 0 && (
                                  <span className="flex items-center text-primary">
                                    <Heart className="w-3 h-3 fill-primary mr-1" />
                                    {reply.likes}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
