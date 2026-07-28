import { Post } from '@/types/community';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Heart, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar>
          <AvatarImage src={post.author.avatarUrl} />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium leading-none">{post.author.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {post.author.department} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/community/post/${post.id}`} className="hover:underline">
          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-3">{post.body}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 text-muted-foreground">
        <button className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
          <Heart className={`w-4 h-4 ${post.isLikedByMe ? 'fill-primary text-primary' : ''}`} />
          <span>{post.likes}</span>
        </button>
        <Link href={`/community/post/${post.id}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
          <MessageSquare className="w-4 h-4" />
          <span>{post.commentsCount}</span>
        </Link>
        <button className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
          <Share2 className="w-4 h-4" />
          <span>{post.shareCount}</span>
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
          <Bookmark className={`w-4 h-4 ${post.isBookmarkedByMe ? 'fill-primary text-primary' : ''}`} />
        </button>
      </CardFooter>
    </Card>
  );
}
