import { Button } from "@/components/ui/button";
import { 
  Bold, Italic, Underline, List, ListOrdered, Quote, 
  Code, FileCode, Link as LinkIcon, Image as ImageIcon, 
  Smile, Hash, Bot, Lightbulb, Sparkles, MessageSquare, Minus, AtSign
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmojiPicker } from "./emoji-picker";

interface ToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
  onAiAction: (action: string) => void;
  onToggleImageUpload: () => void;
  isAiLoading?: boolean;
}

export function RichTextToolbar({ onInsert, onAiAction, onToggleImageUpload, isAiLoading }: ToolbarProps) {
  const tools = [
    { icon: <Bold className="w-4 h-4" />, tooltip: "Bold (Ctrl+B)", action: () => onInsert('**', '**') },
    { icon: <Italic className="w-4 h-4" />, tooltip: "Italic (Ctrl+I)", action: () => onInsert('*', '*') },
    { icon: <Underline className="w-4 h-4" />, tooltip: "Strikethrough", action: () => onInsert('~~', '~~') },
    { divider: true },
    { icon: <List className="w-4 h-4" />, tooltip: "Bulleted List", action: () => onInsert('- ') },
    { icon: <ListOrdered className="w-4 h-4" />, tooltip: "Numbered List", action: () => onInsert('1. ') },
    { icon: <Minus className="w-4 h-4" />, tooltip: "Divider", action: () => onInsert('\n\n---\n\n') },
    { divider: true },
    { icon: <Quote className="w-4 h-4" />, tooltip: "Blockquote", action: () => onInsert('> ') },
    { icon: <Code className="w-4 h-4" />, tooltip: "Inline Code", action: () => onInsert('`', '`') },
    { icon: <FileCode className="w-4 h-4" />, tooltip: "Code Block", action: () => onInsert('\n```\n', '\n```\n') },
    { divider: true },
    { icon: <LinkIcon className="w-4 h-4" />, tooltip: "Link (Ctrl+K)", action: () => onInsert('[', '](url)') },
    { icon: <AtSign className="w-4 h-4" />, tooltip: "Mention", action: () => onInsert('@') },
  ];

  return (
    <div className="flex items-center justify-between flex-wrap gap-2 p-2 border-b bg-muted/10 rounded-t-lg">
      <div className="flex items-center gap-0.5 flex-wrap">
          {tools.map((tool, idx) => 
            tool.divider ? (
              <div key={`div-${idx}`} className="w-px h-5 bg-border mx-1.5 hidden sm:block"></div>
            ) : (
              <Button key={`tool-${idx}`} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={tool.action} title={tool.tooltip}>
                {tool.icon}
              </Button>
            )
          )}
          
          <div className="w-px h-5 bg-border mx-1.5 hidden sm:block"></div>
          
          <EmojiPicker onEmojiSelect={(emoji) => onInsert(emoji)} />
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={onToggleImageUpload} title="Add Image">
            <ImageIcon className="w-4 h-4" />
          </Button>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 bg-indigo-50/50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800/50">
              <Sparkles className="w-3.5 h-3.5" />
              AI Tools
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onAiAction('improve')} disabled={isAiLoading}>
              <Bot className="w-4 h-4 mr-2 text-indigo-500" />
              Improve Writing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAiAction('professional')} disabled={isAiLoading}>
              <MessageSquare className="w-4 h-4 mr-2 text-emerald-500" />
              Rewrite Professionally
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAiAction('grammar')} disabled={isAiLoading}>
              <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
              Grammar Fix
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAiAction('tone')} disabled={isAiLoading}>
              <Smile className="w-4 h-4 mr-2 text-teal-500" />
              Tone Improvement
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAiAction('shorten')} disabled={isAiLoading}>
              <Minus className="w-4 h-4 mr-2 text-orange-500" />
              Shorten
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAiAction('expand')} disabled={isAiLoading}>
              <List className="w-4 h-4 mr-2 text-cyan-500" />
              Expand
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAiAction('summarize')} disabled={isAiLoading}>
              <ListOrdered className="w-4 h-4 mr-2 text-violet-500" />
              Summarize Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAiAction('title')} disabled={isAiLoading}>
              <Lightbulb className="w-4 h-4 mr-2 text-amber-500" />
              Generate Title
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAiAction('tags')} disabled={isAiLoading}>
              <Hash className="w-4 h-4 mr-2 text-pink-500" />
              Suggest Tags
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAiAction('hashtags')} disabled={isAiLoading}>
              <Hash className="w-4 h-4 mr-2 text-red-500" />
              Generate Hashtags
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
