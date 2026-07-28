import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { useCreatePost } from '@/hooks/use-community';
import { Eye, Save, X, Trash2, Expand, Shrink, Send, Clock, AlertCircle } from 'lucide-react';
import { PostType, VisibilityType, ImageFile } from './types';
import { RichTextToolbar } from './toolbar';
import { ImageGrid, ImageUploader } from './images';
import { TagSelector, PostTypeSelector, VisibilitySelector } from './selectors';
import { PreviewPanel } from './preview';
import { CharacterCounter, WordCounter } from './counters';
import { DraftManager } from './draft-manager';
import { motion, AnimatePresence } from 'framer-motion';

export function PostComposer() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [type, setType] = useState<PostType>('General Post');
  const [visibility, setVisibility] = useState<VisibilityType>('Everyone');
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const createPostMutation = useCreatePost();

  // Handle draft autosave (mock)
  useEffect(() => {
    if (content.length > 10 || title.length > 3) {
      setHasUnsavedChanges(true);
      const timer = setTimeout(() => {
        // mock autosave
        setHasUnsavedChanges(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [content, title, tags]);

  const handleSubmit = () => {
    if (!content || !user) return;
        
    createPostMutation.mutate({
      title: title || 'New Post',
      body: content,
      author: {
        id: user.id,
        name: user.name,
        department: user.department || 'General',
        avatarUrl: user.avatar || '',
        role: user.role === 'student' ? 'Student' : user.role === 'faculty' ? 'Faculty' : 'Admin'
      },
      likes: 0,
      commentsCount: 0,
      shareCount: 0,
      views: 0,
      tags: tags,
      images: images.map(img => img.url),
      category: type as any,
      visibility: visibility as any,
      bookmarks: 0,
      isLikedByMe: false,
      isBookmarkedByMe: false
    });
        
    // Reset state
    setContent('');
    setTitle('');
    setTags([]);
    setImages([]);
    setIsExpanded(false);
    setShowPreview(false);
    setShowImageUploader(false);
    setIsFullscreen(false);
    setHasUnsavedChanges(false);
  };

  const handleAiAction = (action: string) => {
    if (!content && action !== 'title') return;
    setIsAiLoading(true);
    
    // Mock AI delay
    setTimeout(() => {
      if (action === 'improve') {
        setContent(content + '\n\n*(AI Improved)* This text flows better and is more engaging.');
      } else if (action === 'professional') {
        setContent(content + '\n\n*(AI Professional)* Furthermore, this ensures optimal alignment with our objectives.');
      } else if (action === 'grammar') {
        setContent(content + '\n\n*(AI Grammar Fix)* Fixed punctuation and corrected sentence structures.');
      } else if (action === 'tone') {
        setContent(content + '\n\n*(AI Tone)* Adjusted tone to be more approachable and friendly.');
      } else if (action === 'shorten') {
        setContent(content + '\n\n*(AI Shorten)* Brief summary of the above points.');
      } else if (action === 'expand') {
        setContent(content + '\n\n*(AI Expand)* Elaborating further on these concepts, we can see that... \n\n* More details\n* Examples');
      } else if (action === 'summarize') {
        setContent(content + '\n\n### Summary\n\n* Key point 1\n* Key point 2');
      } else if (action === 'tags') {
        setTags([...new Set([...tags, 'aiSuggested', 'community', 'update'])].slice(0, 5));
      } else if (action === 'hashtags') {
        setContent(content + '\n\n#Community #Update #AI');
      } else if (action === 'title') {
        setTitle('AI Suggested Title for This Discussion');
      }
      setIsAiLoading(false);
    }, 1500);
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

  const handleAddImages = (newImages: ImageFile[]) => {
    setImages([...images, ...newImages]);
    setShowImageUploader(false);
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleDiscard = () => {
    if (confirm('Discard this draft? You will lose all unsaved changes.')) {
      setContent('');
      setTitle('');
      setTags([]);
      setImages([]);
      setIsExpanded(false);
      setShowPreview(false);
    }
  };

  const renderEditor = () => (
    <div className="flex flex-col h-full space-y-4">
      {isExpanded && (
        <div className="flex flex-wrap gap-3">
          <PostTypeSelector value={type} onChange={setType} />
          <VisibilitySelector value={visibility} onChange={setVisibility} />
        </div>
      )}
      
      {isExpanded && (
        <Input
          placeholder="Title (Required for Questions and Events)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold bg-transparent border-b rounded-none px-0 focus-visible:ring-0 shadow-none border-t-0 border-l-0 border-r-0 border-muted/50 focus-visible:border-primary transition-colors"
        />
      )}
                  
      <div className={`flex flex-col border rounded-lg overflow-hidden transition-all duration-200 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary bg-card ${isFullscreen ? 'flex-1' : ''}`}>
        {isExpanded && (
          <RichTextToolbar 
            onInsert={insertFormatting} 
            onAiAction={handleAiAction} 
            onToggleImageUpload={() => setShowImageUploader(!showImageUploader)}
            isAiLoading={isAiLoading}
          />
        )}
        
        <textarea
          ref={textareaRef}
          placeholder={isExpanded ? "Write your post here... Use Markdown for formatting." : "Share your thoughts, ask a question, or start a discussion..."}
          className={`w-full resize-none bg-transparent outline-none p-4 placeholder:text-muted-foreground text-sm transition-all ${isFullscreen ? 'flex-1 h-full' : isExpanded ? 'min-h-[200px]' : 'min-h-[40px]'}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      </div>

      <AnimatePresence>
        {showImageUploader && isExpanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <ImageUploader onAddImages={handleAddImages} />
          </motion.div>
        )}
      </AnimatePresence>

      {images.length > 0 && isExpanded && (
        <ImageGrid images={images} onRemove={handleRemoveImage} />
      )}

      {isExpanded && (
        <div className="mt-2">
          <TagSelector tags={tags} setTags={setTags} />
        </div>
      )}
    </div>
  );

  const containerClasses = isFullscreen 
    ? "fixed inset-4 z-50 flex flex-col m-0 shadow-2xl border bg-background overflow-hidden" 
    : "mb-6 shadow-sm border-muted/60 transition-all duration-200 focus-within:shadow-md focus-within:border-primary/30";

  return (
    <>
      <DraftManager 
        currentDraft={{ title, content, type, visibility, tags, images: images.map(img => img.url) }}
        hasUnsavedChanges={hasUnsavedChanges}
        onRestore={(draft) => {
          if (draft.title) setTitle(draft.title);
          if (draft.content) setContent(draft.content);
          if (draft.type) setType(draft.type as PostType);
          if (draft.visibility) setVisibility(draft.visibility as VisibilityType);
          if (draft.tags) setTags(draft.tags);
          // Simple image restore (mock implementation)
          if (draft.images && draft.images.length > 0) {
            setImages(draft.images.map((url, i) => ({ id: `restored-${i}`, url, progress: 100 })));
          }
          setIsExpanded(true);
        }}
        onClear={() => setHasUnsavedChanges(false)}
      />
      {isFullscreen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setIsFullscreen(false)} />}
      <Card className={containerClasses}>
        <CardContent className={`pt-6 ${isFullscreen ? 'flex-1 overflow-y-auto' : ''}`}>
          <div className="flex gap-4 h-full">
            {!isFullscreen && (
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
            )}
            
            <div className={`flex-1 h-full ${isFullscreen ? 'max-w-4xl mx-auto w-full' : ''}`}>
              {showPreview ? (
                <div className="min-h-[200px]">
                  <PreviewPanel 
                    title={title} 
                    content={content} 
                    tags={tags} 
                    type={type} 
                    visibility={visibility} 
                    images={images} 
                  />
                </div>
              ) : (
                renderEditor()
              )}
            </div>
          </div>
        </CardContent>

        {isExpanded && (
          <CardFooter className="border-t pt-3 pb-3 flex flex-col gap-3 bg-muted/10 shrink-0">
            <div className="flex justify-between w-full items-center flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <WordCounter text={content} />
                <CharacterCounter text={content} max={5000} />
                {hasUnsavedChanges ? (
                  <span className="text-xs text-amber-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Unsaved changes
                  </span>
                ) : content.length > 0 ? (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Save className="w-3 h-3" /> Draft saved
                  </span>
                ) : null}
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
                  {isFullscreen ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? 'Continue Editing' : (
                    <><Eye className="w-4 h-4 mr-2" /> Preview</>
                  )}
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleDiscard}>
                  <Trash2 className="w-4 h-4 mr-2" /> Discard
                </Button>
                
                <div className="flex items-center">
                  <Button size="sm" onClick={handleSubmit} disabled={!content || createPostMutation.isPending} className="px-6 rounded-r-none">
                    {createPostMutation.isPending ? 'Posting...' : (
                      <><Send className="w-4 h-4 mr-2" /> Post</>
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="default" disabled={!content || createPostMutation.isPending} className="px-2 rounded-l-none border-l border-primary-foreground/20">
                        <span className="sr-only">More publishing options</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert('Draft saved successfully.')}>
                        <Save className="w-4 h-4 mr-2" /> Save Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert('Post scheduled for later.')}>
                        <Clock className="w-4 h-4 mr-2" /> Schedule Publish
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert('Draft duplicated.')}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2"><path d="M2.5 3.5C2.5 2.94772 2.94772 2.5 3.5 2.5H11.5C12.0523 2.5 12.5 2.94772 12.5 3.5V11.5C12.5 12.0523 12.0523 12.5 11.5 12.5H3.5C2.94772 12.5 2.5 12.0523 2.5 3.5ZM3.5 1.5C2.39543 1.5 1.5 2.39543 1.5 3.5V11.5C1.5 12.6046 2.39543 13.5 3.5 13.5H11.5C12.6046 13.5 13.5 12.6046 13.5 11.5V3.5C13.5 2.39543 12.6046 1.5 11.5 1.5H3.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        Duplicate Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDiscard} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Draft
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}
