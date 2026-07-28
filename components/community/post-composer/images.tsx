import { ImageFile } from "./types";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageUploader({ onAddImages }: { onAddImages: (images: ImageFile[]) => void }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file),
        file,
        progress: 0
      }));
      onAddImages(newImages);
      e.target.value = ''; // Reset
    }
  };

  return (
    <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/10 transition-colors bg-muted/5">
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        onChange={handleFileChange}
      />
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
        <UploadCloud className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium">Click or drag images here to upload</p>
      <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, GIF (Max 5MB)</p>
    </div>
  );
}

export function ImageGrid({ images, onRemove, onReorder }: { images: ImageFile[], onRemove: (id: string) => void, onReorder?: (images: ImageFile[]) => void }) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
      {images.map((image, index) => (
        <div key={image.id} className="relative aspect-video rounded-md overflow-hidden group bg-muted border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
            <Button variant="destructive" size="icon" className="w-6 h-6 rounded-full" onClick={() => onRemove(image.id)}>
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          {image.progress < 100 && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
              <div className="w-2/3 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${image.progress}%` }}></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
