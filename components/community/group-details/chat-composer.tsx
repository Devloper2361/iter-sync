import { useState, useRef, useEffect } from 'react';
import { useSendMessage, useUploadAttachment } from '@/hooks/use-messages';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Smile, Send, File, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/use-auth';
import { getSocket } from '@/lib/socket';
import { toast } from 'sonner';

interface ChatComposerProps {
  groupId: string;
}

const PHOTO_VIDEO_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.webm'];
const DOC_EXTS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.zip', '.txt'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export function ChatComposer({ groupId }: ChatComposerProps) {
  const [content, setContent] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: sendMessage, isPending } = useSendMessage();
  const uploadAttachment = useUploadAttachment();
  const { user } = useAuth();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, isMedia: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so same file can be selected again if needed
    e.target.value = '';

    if (!user) {
      toast.error('You must be logged in to send attachments');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large. Maximum size is 25MB.');
      return;
    }

    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowedExts = isMedia ? PHOTO_VIDEO_EXTS : DOC_EXTS;

    const isTypeValid = allowedExts.includes(fileExt) || 
      (isMedia ? (file.type.startsWith('image/') || file.type.startsWith('video/')) : true);

    if (!isTypeValid) {
      toast.error(`Unsupported file type. Accepted: ${allowedExts.join(', ')}`);
      return;
    }

    setPopoverOpen(false);
    setIsUploading(true);

    try {
      const attachment = await uploadAttachment.mutateAsync(file);

      const isImage = file.type.startsWith('image/') || ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExt);
      const isPdf = fileExt === '.pdf' || file.type === 'application/pdf';

      const msgType = isImage ? 'Image' : isPdf ? 'PDF' : 'File';

      sendMessage({
        groupId,
        message: {
          groupId,
          author: {
            ...user,
            role: user.role === 'student' ? 'Student' : user.role === 'faculty' ? 'Faculty' : 'Admin'
          },
          content: content.trim() || file.name,
          type: msgType,
          attachments: [attachment]
        }
      });

      setContent('');
      toast.success('Attachment sent successfully');
    } catch (err) {
      toast.error('Failed to upload attachment. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-end gap-2 bg-muted/30 p-2 rounded-xl border">
      <input
        type="file"
        ref={photoInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm,.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.webm"
        onChange={(e) => handleFileSelect(e, true)}
      />
      <input
        type="file"
        ref={docInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,text/plain"
        onChange={(e) => handleFileSelect(e, false)}
      />

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isUploading} className="shrink-0 text-muted-foreground hover:text-foreground">
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-48 p-2">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start text-sm"
              onClick={() => {
                setPopoverOpen(false);
                photoInputRef.current?.click();
              }}
            >
              <ImageIcon className="w-4 h-4 mr-2 text-blue-500" /> Photo/Video
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-sm"
              onClick={() => {
                setPopoverOpen(false);
                docInputRef.current?.click();
              }}
            >
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
        disabled={!content.trim() || isPending || isUploading}
        className="shrink-0 rounded-full w-11 h-11 shadow-sm"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
