"use client"
import { useClubMedia, useUploadMedia, useDeleteMedia } from '@/hooks/use-media';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon, Upload, PlayCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ClubMediaTabProps {
  clubId: string;
}

export function ClubMediaTab({ clubId }: ClubMediaTabProps) {
  const { data: media, isLoading } = useClubMedia(clubId);
  const deleteMutation = useDeleteMedia(clubId);
  const uploadMutation = useUploadMedia(clubId);

  if (isLoading) {
    return (
      <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-square w-full rounded-xl" />)}
      </div>
    );
  }

  const handleMockUpload = () => {
    // Generate a mock file
    const mockFile = new File([''], 'mock-image.png', { type: 'image/png' });
    uploadMutation.mutate({
      file: mockFile,
      title: 'New Event Photo',
      type: 'Image'
    });
  };

  return (
    <div className="pt-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold tracking-tight">Gallery</h3>
        <Button className="shadow-sm" onClick={handleMockUpload} disabled={uploadMutation.isPending}>
          <Upload className="w-4 h-4 mr-2" />
          {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {media && media.length > 0 ? (
          media.map(item => (
            <Card key={item.id} className="overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow relative">
               <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="destructive" size="icon" className="h-8 w-8 shadow-sm" onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(item.id); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
               </div>
              <div className="aspect-square relative bg-muted" onClick={() => alert('Image viewer opened')}>
                <Image src={item.url} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                   {item.type === 'Video' ? <PlayCircle className="w-10 h-10 text-white" /> : <ImageIcon className="w-8 h-8 text-white" />}
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">by {item.uploader.name}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center border-2 border-dashed rounded-lg">
                <ImageIcon className="w-12 h-12 mb-4 text-muted" />
                <p className="font-medium">No media uploaded</p>
                <p className="text-sm mt-1">Share photos and videos with the club.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
