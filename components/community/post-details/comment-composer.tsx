import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { Send, X, AlertCircle } from 'lucide-react';
import { RichTextToolbar } from '../post-composer/toolbar';
import { PreviewPanel } from '../post-composer/preview';
import { CharacterCounter } from '../post-composer/counters';
import { ImageUploader, ImageGrid } from '../post-composer/images';
import { ImageFile } from '../post-composer/types';
import { AnimatePresence, motion } from 'framer-motion';

interface CommentComposerProps {
  onSubmit: (content: string, images?: string[]) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
  initialContent?: string;
  isEditing?: boolean;
}

export function CommentComposer({ onSubmit, placeholder = "Write a comment...", autoFocus, onCancel, initialContent = "", isEditing }: CommentComposerProps) {
  const { user } = useAuth();
  const [content, setContent] = useState(initialContent);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isExpanded, setIsExpanded] = useState(isEditing || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      setIsExpanded(true);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [autoFocus]);

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit(content, images.map(i => i.url));
      setContent('');
      setImages([]);
      setIsExpanded(false);
      setShowPreview(false);
      setShowImageUploader(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiAction = (action: string) => {
    if (!content) return;
    setIsAiLoading(true);
    setTimeout(() => {
      if (action === 'improve') setContent(content + '\n\n*(AI Improved)*');
      else if (action === 'professional') setContent(content + '\n\n*(AI Professional)*');
      else if (action === 'grammar') setContent(content + '\n\n*(AI Grammar)*');
      else if (action === 'shorten') setContent(content + '\n\n*(AI Shorten)*');
      else if (action === 'expand') setContent(content + '\n\n*(AI Expand)*');
      else if (action === 'summarize') setContent(content + '\n\n*(AI Summarize)*');
      else if (action === 'tone') setContent(content + '\n\n*(AI Tone)*');
      setIsAiLoading(false);
    }, 1000);
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = content;
    const newText = text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end);
    setContent(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length);
      }
    }, 0);
  };

  return (
    <div className="flex gap-4 items-start w-full">
      {!isEditing && (
        <Avatar className="h-10 w-10 mt-1 border-2 border-background shadow-sm shrink-0 hidden sm:block">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex-1 flex flex-col border rounded-xl overflow-hidden transition-all duration-200 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary bg-card shadow-sm ${isExpanded ? 'ring-1 ring-primary/20' : ''}`}>
        {isExpanded && (
          <RichTextToolbar 
            onInsert={insertFormatting} 
            onAiAction={handleAiAction} 
            onToggleImageUpload={() => setShowImageUploader(!showImageUploader)}
            isAiLoading={isAiLoading}
          />
        )}
        
        {showPreview && isExpanded ? (
          <div className="p-4 min-h-[120px] max-h-[400px] overflow-y-auto">
             <PreviewPanel 
               title="" 
               content={content} 
               tags={[]} 
               type="General Post" 
               visibility="Everyone" 
               images={images} 
             />
          </div>
        ) : (
          <div className="flex flex-col">
            <textarea
              ref={textareaRef}
              placeholder={placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className={`w-full resize-none bg-transparent outline-none p-3 placeholder:text-muted-foreground text-sm transition-all ${isExpanded ? 'min-h-[120px]' : 'min-h-[44px]'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  handleSubmit();
                }
              }}
            />
            
            <AnimatePresence>
              {showImageUploader && isExpanded && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <ImageUploader onAddImages={(newImages) => {
                    setImages([...images, ...newImages]);
                    setShowImageUploader(false);
                  }} />
                </motion.div>
              )}
            </AnimatePresence>
            
            {images.length > 0 && isExpanded && (
              <div className="px-3 pb-2">
                <ImageGrid images={images} onRemove={(id) => setImages(images.filter(img => img.id !== id))} />
              </div>
            )}
          </div>
        )}
        
        {isExpanded && (
          <div className="flex items-center justify-between p-2 border-t bg-muted/10">
            <div className="flex items-center gap-3 px-2">
              <CharacterCounter text={content} max={2000} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)} className="text-xs h-8 hidden sm:flex">
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
              {onCancel && (
                <Button variant="ghost" size="sm" onClick={() => {
                  setContent('');
                  setIsExpanded(false);
                  onCancel();
                }} className="text-xs h-8 text-muted-foreground">
                  Cancel
                </Button>
              )}
              <Button 
                size="sm" 
                onClick={handleSubmit} 
                disabled={(!content.trim() && images.length === 0) || isSubmitting}
                className="h-8 px-4"
              >
                {isSubmitting ? '...' : isEditing ? 'Save' : 'Reply'} <Send className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
