import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostType, VisibilityType } from "./types";
import { Users, Globe, Building2, GraduationCap, Lock, MessageSquare, Megaphone, Calendar, HelpCircle, BarChart2, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { X } from "lucide-react";

export function PostTypeSelector({ value, onChange }: { value: PostType, onChange: (val: PostType) => void }) {
  const icons = {
    'General Post': <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />,
    'Question': <HelpCircle className="w-4 h-4 mr-2 text-amber-500" />,
    'Announcement': <Megaphone className="w-4 h-4 mr-2 text-red-500" />,
    'Poll': <BarChart2 className="w-4 h-4 mr-2 text-purple-500" />,
    'Event': <Calendar className="w-4 h-4 mr-2 text-emerald-500" />,
    'Study Group Update': <Users className="w-4 h-4 mr-2 text-indigo-500" />,
    'Club Update': <Building2 className="w-4 h-4 mr-2 text-pink-500" />,
    'Marketplace Share': <Briefcase className="w-4 h-4 mr-2 text-orange-500" />,
  };

  return (
    <Select value={value} onValueChange={onChange as (val: string) => void}>
      <SelectTrigger className="w-[200px] h-9 text-sm border-muted/50 bg-muted/20">
        <SelectValue placeholder="Select post type" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(icons).map((type) => (
          <SelectItem key={type} value={type} className="text-sm">
            <div className="flex items-center">
              {icons[type as PostType]}
              {type}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function VisibilitySelector({ value, onChange }: { value: VisibilityType, onChange: (val: VisibilityType) => void }) {
  const icons = {
    'Everyone': <Globe className="w-4 h-4 mr-2 text-muted-foreground" />,
    'Department': <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />,
    'Semester': <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />,
    'Club': <Users className="w-4 h-4 mr-2 text-muted-foreground" />,
    'Study Group': <Users className="w-4 h-4 mr-2 text-muted-foreground" />,
    'Private Draft': <Lock className="w-4 h-4 mr-2 text-muted-foreground" />,
  };

  return (
    <Select value={value} onValueChange={onChange as (val: string) => void}>
      <SelectTrigger className="w-[180px] h-9 text-sm border-muted/50 bg-muted/20">
        <SelectValue placeholder="Select visibility" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(icons).map((visibility) => (
          <SelectItem key={visibility} value={visibility} className="text-sm">
            <div className="flex items-center">
              {icons[visibility as VisibilityType]}
              {visibility}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function TagSelector({ tags, setTags }: { tags: string[], setTags: (tags: string[]) => void }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = input.trim().replace(/^#/, '');
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setInput('');
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 bg-muted/20 border border-muted/50 rounded-md p-1 min-h-[40px]">
      {tags.map(tag => (
        <span key={tag} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-sm">
          #{tag}
          <button onClick={() => removeTag(tag)} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length < 5 ? "Add tags (press Enter)..." : "Max 5 tags"}
        disabled={tags.length >= 5}
        className="flex-1 min-w-[120px] h-8 border-none bg-transparent focus-visible:ring-0 shadow-none text-sm px-2"
      />
    </div>
  );
}
