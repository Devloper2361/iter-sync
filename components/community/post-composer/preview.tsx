import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PostType, VisibilityType, ImageFile } from './types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Globe, Building2, GraduationCap, Users, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface PreviewProps {
  title: string;
  content: string;
  tags: string[];
  type: PostType;
  visibility: VisibilityType;
  images: ImageFile[];
}

export function PreviewPanel({ title, content, tags, type, visibility, images }: PreviewProps) {
  const { user } = useAuth();
  
  const getVisibilityIcon = () => {
    switch(visibility) {
      case 'Everyone': return <Globe className="w-3 h-3 mr-1" />;
      case 'Department': return <Building2 className="w-3 h-3 mr-1" />;
      case 'Semester': return <GraduationCap className="w-3 h-3 mr-1" />;
      case 'Club': return <Users className="w-3 h-3 mr-1" />;
      case 'Study Group': return <Users className="w-3 h-3 mr-1" />;
      case 'Private Draft': return <Lock className="w-3 h-3 mr-1" />;
      default: return <Globe className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <div className="border rounded-lg p-5 bg-card text-card-foreground shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-muted">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{user?.name || 'User'}</span>
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{type}</Badge>
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-0.5">
              {getVisibilityIcon()}
              {visibility} • Just now
            </div>
          </div>
        </div>
      </div>

      {title && (
        <h2 className="text-xl font-bold mb-3">{title}</h2>
      )}

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content || '*Nothing to preview...*'}
        </ReactMarkdown>
      </div>

      {images.length > 0 && (
        <div className={`grid gap-2 mt-4 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {images.map(img => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={img.id} src={img.url} alt="Preview" className="rounded-md object-cover w-full aspect-video border" />
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {tags.map(tag => (
            <span key={tag} className="text-xs text-primary font-medium hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
