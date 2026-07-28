import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useCreateQuestion } from '@/hooks/use-questions';
import { Eye, Save, Send, Clock, Expand, Shrink, Trash2, Paperclip, AlertCircle, HelpCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RichTextToolbar } from '../post-composer/toolbar';
import { TagSelector } from '../post-composer/selectors';
import { DraftManager } from '../post-composer/draft-manager';
import { WordCounter, CharacterCounter } from '../post-composer/counters';
import { ImageUploader } from '../post-composer/images';
import { ImageGrid } from '../post-composer/images';
import { PreviewPanel } from '../post-composer/preview';
import { Difficulty, PostCategory, Attachment } from '@/types/community';
import { motion, AnimatePresence } from 'framer-motion';

export function QuestionComposer() {
  const { user } = useAuth();
  const createQuestionMutation = useCreateQuestion();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<{id: string, url: string, progress: number}[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [showPreview, setShowPreview] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (title || content || tags.length > 0) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [title, content, tags]);

  const handleInsert = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    setContent(newText);

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
      } else if (action === 'title' && !title) {
        setTitle('How to optimize binary search tree traversal?');
      } else if (action === 'tags' && tags.length === 0) {
        setTags(['data-structures', 'algorithms', 'trees']);
      }
      setIsAiLoading(false);
    }, 1000);
  };

  const handleAddImages = (newImages: {id: string, url: string, progress: number}[]) => {
    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDiscard = () => {
    setTitle('');
    setContent('');
    setSubject('');
    setDepartment('');
    setSemester('');
    setDifficulty('Intermediate');
    setTags([]);
    setImages([]);
    setAttachments([]);
    setIsAnonymous(false);
    setHasUnsavedChanges(false);
    setIsExpanded(false);
    setShowPreview(false);
    setIsFullscreen(false);
  };

  const handleSubmit = () => {
    if (!title || !content || !user) return;
    
    createQuestionMutation.mutate({
      author: {
        id: user.id,
        name: isAnonymous ? 'Anonymous Student' : user.name,
        avatarUrl: isAnonymous ? undefined : user.avatar,
        role: 'Student'
      },
      title,
      body: content,
      subject,
      department,
      semester: parseInt(semester) || undefined,
      difficulty,
      tags,
      images: images.map(img => img.url),
      attachments,
      isAnonymous,
      views: 0,
      upvotes: 0,
      answersCount: 0
    }, {
      onSuccess: () => {
        handleDiscard();
      }
    });
  };

  const renderEditor = () => (
    <div className={`flex flex-col ${isFullscreen ? 'flex-1 h-full' : ''}`}>
      <div className="flex gap-2 mb-3">
        <Input 
          placeholder="Question Title (e.g., How to implement binary search in Python?)" 
          className="text-lg font-medium border-none shadow-none focus-visible:ring-0 px-0 h-auto py-2 placeholder:text-muted-foreground/70"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
        />
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 p-3 bg-muted/20 rounded-lg border">
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
              <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Semester</SelectItem>
              <SelectItem value="2">2nd Semester</SelectItem>
              <SelectItem value="3">3rd Semester</SelectItem>
              <SelectItem value="4">4th Semester</SelectItem>
              <SelectItem value="5">5th Semester</SelectItem>
              <SelectItem value="6">6th Semester</SelectItem>
              <SelectItem value="7">7th Semester</SelectItem>
              <SelectItem value="8">8th Semester</SelectItem>
            </SelectContent>
          </Select>
          
          <Input 
            placeholder="Subject (e.g. Data Structures)" 
            className="h-8 text-xs" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className={`border rounded-lg flex flex-col focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all ${isFullscreen ? 'flex-1 mb-4' : ''}`}>
        {isExpanded && (
          <RichTextToolbar 
            onInsert={handleInsert} 
            onAiAction={handleAiAction} 
            onToggleImageUpload={() => setShowImageUploader(!showImageUploader)}
            isAiLoading={isAiLoading}
          />
        )}
        
        <textarea
          ref={textareaRef}
          placeholder={isExpanded ? "Provide details for your question. Include code snippets, error messages, and what you've tried so far." : "Ask a question to the community..."}
          className={`w-full resize-none bg-transparent outline-none p-4 placeholder:text-muted-foreground text-sm transition-all ${isFullscreen ? 'flex-1 h-full' : isExpanded ? 'min-h-[200px]' : 'min-h-[40px]'}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsExpanded(true)}
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
        <div className="mt-2 flex flex-col gap-3">
          <TagSelector tags={tags} setTags={setTags} />
          
          <div className="flex items-center space-x-2 bg-muted/20 p-2 rounded-md border w-max">
            <Switch id="anonymous-mode" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
            <Label htmlFor="anonymous-mode" className="text-xs flex items-center gap-1 cursor-pointer">
              Post Anonymously
              <HelpCircle className="w-3 h-3 text-muted-foreground" />
            </Label>
          </div>
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
        currentDraft={{ title, content, type: 'Question', visibility: 'Everyone', tags, images: images.map(img => img.url) }}
        hasUnsavedChanges={hasUnsavedChanges}
        onRestore={(draft) => {
          if (draft.title) setTitle(draft.title);
          if (draft.content) setContent(draft.content);
          if (draft.tags) setTags(draft.tags);
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
                <AvatarImage src={isAnonymous ? undefined : user?.avatar} />
                <AvatarFallback>{isAnonymous ? 'A' : user?.name?.[0]}</AvatarFallback>
              </Avatar>
            )}
            
            <div className={`flex-1 h-full ${isFullscreen ? 'max-w-4xl mx-auto w-full' : ''}`}>
              {showPreview ? (
                <div className="min-h-[200px]">
                  <PreviewPanel 
                    title={title} 
                    content={content} 
                    tags={tags} 
                    type="Question" 
                    visibility="Everyone"
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
                <CharacterCounter text={content} max={10000} />
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
                  <Button size="sm" onClick={handleSubmit} disabled={!title || !content || createQuestionMutation.isPending} className="px-6 rounded-r-none">
                    {createQuestionMutation.isPending ? 'Posting...' : (
                      <><Send className="w-4 h-4 mr-2" /> Ask Question</>
                    )}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="default" disabled={!title || !content || createQuestionMutation.isPending} className="px-2 rounded-l-none border-l border-primary-foreground/20">
                        <span className="sr-only">More publishing options</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert('Draft saved successfully.')}>
                        <Save className="w-4 h-4 mr-2" /> Save Draft
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
