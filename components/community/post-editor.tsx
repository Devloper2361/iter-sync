import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { Image as ImageIcon, Send } from 'lucide-react';

export function PostEditor() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (!content) return;
    alert('Mock: Post Created');
    setContent('');
    setTitle('');
    setIsExpanded(false);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            {isExpanded && (
              <Input
                placeholder="Post Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold"
              />
            )}
            <textarea
              placeholder="What's on your mind?"
              className="w-full min-h-[60px] resize-none bg-transparent outline-none placeholder:text-muted-foreground text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
            />
          </div>
        </div>
      </CardContent>
      {isExpanded && (
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ImageIcon className="w-4 h-4 mr-2" />
              Photo
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} disabled={!content}>
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
