import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useCreateAnswer } from '@/hooks/use-questions';
import { Send, Image as ImageIcon } from 'lucide-react';
import { RichTextToolbar } from '../post-composer/toolbar';
import { ImageUploader } from '../post-composer/images';
import { ImageGrid } from '../post-composer/images';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AnswerComposerProps {
  questionId: string;
}

export function AnswerComposer({ questionId }: AnswerComposerProps) {
  const { user } = useAuth();
  const createAnswerMutation = useCreateAnswer();
  
  const [content, setContent] = useState('');
  const [images, setImages] = useState<{id: string, url: string, progress: number}[]>([]);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsert = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    setContent(before + prefix + selection + suffix + after);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleAiAction = async (action: string) => {
    setIsAiLoading(true);
    setTimeout(() => {
      if (action === 'improve') {
        setContent(content + '\n\n*(AI Improved version would appear here)*');
      }
      setIsAiLoading(false);
    }, 1000);
  };

  const handleSubmit = () => {
    if (!content || !user) return;
    createAnswerMutation.mutate({
      questionId,
      author: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatar,
        role: 'Student'
      },
      body: content,
      images: images.map(img => img.url),
      isAccepted: false,
      isPinned: false,
      replies: [],
      upvotes: 0
    }, {
      onSuccess: () => {
        setContent('');
        setImages([]);
      }
    });
  };

  return (
    <Card className="shadow-sm mt-6 border-indigo-100 dark:border-indigo-900/50">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-bold border-b pb-4 text-indigo-950 dark:text-indigo-50">Your Answer</h3>
        
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 shrink-0 hidden sm:block">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 flex flex-col border rounded-lg focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all bg-background">
            <RichTextToolbar 
              onInsert={handleInsert} 
              onAiAction={handleAiAction} 
              onToggleImageUpload={() => setShowImageUploader(!showImageUploader)}
              isAiLoading={isAiLoading}
            />
            
            <textarea
              ref={textareaRef}
              placeholder="Write your answer here in detail... Include code snippets and references."
              className="w-full min-h-[200px] resize-y bg-transparent outline-none p-4 placeholder:text-muted-foreground text-sm font-mono"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <AnimatePresence>
              {showImageUploader && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <ImageUploader onAddImages={(imgs) => setImages(prev => [...prev, ...imgs])} />
                </motion.div>
              )}
            </AnimatePresence>

            {images.length > 0 && (
              <ImageGrid images={images} onRemove={(id) => setImages(prev => prev.filter(img => img.id !== id))} />
            )}
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
          <Button onClick={handleSubmit} disabled={!content || createAnswerMutation.isPending} className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white">
            {createAnswerMutation.isPending ? 'Posting...' : (
              <><Send className="w-4 h-4 mr-2" /> Post Your Answer</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
