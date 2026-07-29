"use client"

import { useRef, useState } from 'react';
import { useGroupResources, useAddGroupResource, useDeleteGroupResource, useGroupMembers } from '@/hooks/use-study-groups';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Search, UploadCloud, Download, Presentation, Link as LinkIcon, File, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ResourcesTabProps {
  groupId: string;
}

export function ResourcesTab({ groupId }: ResourcesTabProps) {
  const { user } = useAuth();
  const { data: resources, isLoading } = useGroupResources(groupId);
  const { data: members } = useGroupMembers(groupId);
  const addResource = useAddGroupResource(groupId);
  const deleteResource = useDeleteGroupResource(groupId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const myRole = members?.find(m => m.author.id === user?.id)?.role;
  const canDelete = myRole === 'Admin' || myRole === 'Owner';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) return;

    // determine type based on extension
    let type: 'PDF' | 'Slides' | 'Notes' | 'Assignment' | 'Link' | 'Folder' = 'Notes';
    if (file.name.endsWith('.pdf')) type = 'PDF';
    else if (file.name.match(/\.(ppt|pptx)$/)) type = 'Slides';
    else if (file.name.match(/\.(doc|docx)$/)) type = 'Notes';
    
    // format size
    let sizeStr = '';
    if (file.size < 1024 * 1024) {
      sizeStr = (file.size / 1024).toFixed(1) + ' KB';
    } else {
      sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    }

    addResource.mutate({
      groupId,
      uploader: { ...user, role: user.role.charAt(0).toUpperCase() + user.role.slice(1) } as any,
      title: file.name,
      type,
      size: sizeStr,
      url: URL.createObjectURL(file), // mock url
    }, {
      onSuccess: () => {
        toast.success('File uploaded successfully');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-8 h-8 text-red-500" />;
      case 'Slides': return <Presentation className="w-8 h-8 text-orange-500" />;
      case 'Link': return <LinkIcon className="w-8 h-8 text-blue-500" />;
      default: return <File className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const filteredResources = resources?.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources..." 
            className="pl-9 bg-background/50 h-9 text-sm" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          className="w-full sm:w-auto h-9" 
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={addResource.isPending}
        >
          {addResource.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
          Upload
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.zip,image/*"
        />
      </div>

      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map(resource => (
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
                    Uploaded by {resource.uploader.name} on {resource.createdAt ? format(new Date(resource.createdAt), 'MMM d, yyyy') : 'Unknown Date'}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span className="font-medium bg-secondary px-1.5 py-0.5 rounded-sm">{resource.type}</span>
                    {resource.size && <span>• {resource.size}</span>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-2 border-t bg-muted/20 flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    if (resource.url) {
                      window.open(resource.url, '_blank');
                    } else {
                      toast.error('Download link not available');
                    }
                  }}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                </Button>
                {(canDelete || resource.uploader.id === user?.id) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this file?')) {
                        deleteResource.mutate(resource.id);
                      }
                    }}
                    disabled={deleteResource.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-center border-2 border-dashed rounded-xl">
          <FileText className="w-10 h-10 mb-4 text-muted" />
          <p className="font-medium text-sm">{searchQuery ? 'No resources match your search' : 'No resources shared yet'}</p>
          <p className="text-xs mt-1">Upload files, slides, or links for the group.</p>
        </div>
      )}
    </div>
  );
}

