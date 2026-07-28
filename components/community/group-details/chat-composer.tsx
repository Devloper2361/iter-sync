import { useState, useRef, useEffect } from 'react';
import { useSendMessage } from '@/hooks/use-messages';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Smile, Send, File, Image as ImageIcon, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/use-auth';
import { getSocket } from '@/lib/socket';

interface ChatComposerProps {
  groupId: string;
}

export function ChatComposer({ groupId }: ChatComposerProps) {
  const [content, setContent] = useState('');
  const { mutate: sendMessage, isPending } = useSendMessage();
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    if (!user) return;
    
    const socket = getSocket();
    socket.emit('startTyping', { groupId, user: { id: user.id, name: user.name } });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { groupId, user: { id: user.id, name: user.name } });
    }, 2000);
  };

  const handleSend = () => {
    if (!content.trim() || !user) return;
    
    const socket = getSocket();
    socket.emit('stopTyping', { groupId, user: { id: user.id, name: user.name } });
    
    sendMessage({
      groupId,
      message: {
        groupId,
        author: {
          ...user,
          role: user.role === 'student' ? 'Student' : user.role === 'faculty' ? 'Faculty' : 'Admin'
        },
        content: content.trim(),
        type: 'Text',
      }
    });
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 bg-muted/30 p-2 rounded-xl border">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
            <Paperclip className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-48 p-2">
          <div className="flex flex-col gap-1">
            <Button variant="ghost" className="justify-start text-sm">
              <ImageIcon className="w-4 h-4 mr-2 text-blue-500" /> Photo/Video
            </Button>
            <Button variant="ghost" className="justify-start text-sm">
              <File className="w-4 h-4 mr-2 text-indigo-500" /> Document
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex-1 min-w-0 bg-background rounded-lg border shadow-sm flex items-end">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[44px] max-h-[150px] resize-none border-0 focus-visible:ring-0 py-3 px-4 shadow-none bg-transparent"
          rows={1}
        />
        <Button variant="ghost" size="icon" className="shrink-0 mb-1 mr-1 text-muted-foreground hover:text-foreground">
          <Smile className="w-5 h-5" />
        </Button>
      </div>

      <Button 
        size="icon" 
        onClick={handleSend} 
        disabled={!content.trim() || isPending}
        className="shrink-0 rounded-full w-11 h-11 shadow-sm"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
