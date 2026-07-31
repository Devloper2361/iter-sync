"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2, ZoomIn, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  title: string;
  status?: string;
}

export function ImageGallery({ images, title, status }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80'];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex(prev => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex(prev => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Display Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden border bg-muted shadow-sm group">
        <img
          src={displayImages[selectedIndex]}
          alt={`${title} - image ${selectedIndex + 1}`}
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
            isZoomed && "scale-125 cursor-zoom-out"
          )}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {status === 'Sold' && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-background/90 text-foreground px-8 py-3 rounded-xl border shadow-lg text-2xl font-bold uppercase tracking-widest">
              Sold
            </div>
          </div>
        )}

        {status === 'Reserved' && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white font-semibold px-4 py-1.5 rounded-lg shadow z-10 text-sm">
            Reserved
          </div>
        )}

        {/* Fullscreen Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={() => setIsFullScreen(true)}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>

        {/* Carousel Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={handleNext}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all",
                i === selectedIndex ? "border-primary ring-2 ring-primary/20 scale-105" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Full Screen Lightbox Modal */}
      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 border-0 bg-black/95 text-white flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center p-4 z-20">
            <span className="text-sm font-medium opacity-80">
              {selectedIndex + 1} / {displayImages.length} • {title}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullScreen(false)}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="relative flex-1 flex items-center justify-center p-4">
            <img
              src={displayImages[selectedIndex]}
              alt={title}
              className="max-h-full max-w-full object-contain"
            />

            {displayImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 rounded-full"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 rounded-full"
                  onClick={handleNext}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}
          </div>

          {displayImages.length > 1 && (
            <div className="flex justify-center gap-2 p-4 bg-black/50">
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={cn(
                    "w-12 h-12 rounded-lg overflow-hidden border transition-all",
                    i === selectedIndex ? "border-primary ring-2 ring-primary" : "opacity-50 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
