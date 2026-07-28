"use client"
import { useGroupResources } from '@/hooks/use-study-groups';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Search, UploadCloud, Download, Presentation, Link as LinkIcon, File, Loader2 } from 'lucide-react';

interface ResourcesTabProps {
  groupId: string;
}

export function ResourcesTab({ groupId }: ResourcesTabProps) {
  const { data: resources, isLoading } = useGroupResources(groupId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-8 h-8 text-red-500" />;
      case 'Slides': return <Presentation className="w-8 h-8 text-orange-500" />;
      case 'Link': return <LinkIcon className="w-8 h-8 text-blue-500" />;
      default: return <File className="w-8 h-8 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search resources..." className="pl-9 bg-background/50 h-9 text-sm" />
        </div>
        <Button className="w-full sm:w-auto h-9" variant="outline">
          <UploadCloud className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      {resources && resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map(resource => (
            <Card key={resource.id} className="shadow-none border hover:border-primary/50 transition-colors group">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="p-3 bg-muted/50 rounded-xl shrink-0 group-hover:bg-muted transition-colors">
                  {getIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors" title={resource.title}>
                    {resource.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    Uploaded by {resource.uploader.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span className="font-medium bg-secondary px-1.5 py-0.5 rounded-sm">{resource.type}</span>
                    {resource.size && <span>• {resource.size}</span>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-2 border-t bg-muted/20 flex justify-end">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-center border-2 border-dashed rounded-xl">
          <FileText className="w-10 h-10 mb-4 text-muted" />
          <p className="font-medium text-sm">No resources shared yet</p>
          <p className="text-xs mt-1">Upload files, slides, or links for the group.</p>
        </div>
      )}
    </div>
  );
}
