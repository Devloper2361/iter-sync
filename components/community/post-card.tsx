import { Post } from '@/types/community';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Heart, Share2, Bookmark, MoreHorizontal, Flag, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PostCard({ post }: { post: Post }) {
  // Mock check if current user is author
  const isAuthor = post.author.name === 'Alex Smith'; 
  
  return (
    <Card className="mb-4 hover:shadow-sm transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-4">
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
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Share2 className="w-4 h-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            {isAuthor && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </>
            )}
            {!isAuthor && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Link href={`/community/post/${post.id}`} className="hover:underline group">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">{post.body}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground font-medium hover:bg-secondary/80 cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3 pb-3 text-muted-foreground">
        <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors hover:bg-primary/5 px-2 py-1.5 rounded-md">
          <Heart className={`w-4 h-4 ${post.isLikedByMe ? 'fill-primary text-primary' : ''}`} />
          <span className="font-medium">{post.likes}</span>
        </button>
        <Link href={`/community/post/${post.id}`} className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors hover:bg-primary/5 px-2 py-1.5 rounded-md">
          <MessageSquare className="w-4 h-4" />
          <span className="font-medium">{post.commentsCount}</span>
        </Link>
        <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors hover:bg-primary/5 px-2 py-1.5 rounded-md">
          <Share2 className="w-4 h-4" />
          <span className="font-medium">{post.shareCount}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors hover:bg-primary/5 px-2 py-1.5 rounded-md">
          <Bookmark className={`w-4 h-4 ${post.isBookmarkedByMe ? 'fill-primary text-primary' : ''}`} />
        </button>
      </CardFooter>
    </Card>
  );
}
