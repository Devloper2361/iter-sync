import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImageGallery({ images }: { images: string[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const prev = () => setCurrentIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentIndex(i => (i === images.length - 1 ? 0 : i + 1));

  const renderGrid = () => {
    if (images.length === 1) {
      return (
        <div className="w-full aspect-video rounded-xl overflow-hidden cursor-pointer border shadow-sm group" onClick={() => openLightbox(0)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt="Post attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        </div>
      );
    }
    
    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 h-64">
          {images.map((img, i) => (
            <div key={i} className="rounded-xl overflow-hidden cursor-pointer border shadow-sm group" onClick={() => openLightbox(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="Post attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
          ))}
        </div>
      );
    }

    if (images.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-2 h-64">
          <div className="rounded-xl overflow-hidden cursor-pointer border shadow-sm group h-full" onClick={() => openLightbox(0)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[0]} alt="Post attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          </div>
          <div className="grid grid-rows-2 gap-2 h-full">
            {images.slice(1, 3).map((img, i) => (
              <div key={i + 1} className="rounded-xl overflow-hidden cursor-pointer border shadow-sm group" onClick={() => openLightbox(i + 1)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Post attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4 or more
    return (
      <div className="grid grid-cols-2 gap-2 h-64">
        <div className="grid grid-rows-2 gap-2 h-full">
          {images.slice(0, 2).map((img, i) => (
            <div key={i} className="rounded-xl overflow-hidden cursor-pointer border shadow-sm group" onClick={() => openLightbox(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="Post attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
          ))}
        </div>
        <div className="grid grid-rows-2 gap-2 h-full">
          <div className="rounded-xl overflow-hidden cursor-pointer border shadow-sm group" onClick={() => openLightbox(2)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[2]} alt="Post attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          </div>
          <div className="rounded-xl overflow-hidden cursor-pointer border shadow-sm group relative" onClick={() => openLightbox(3)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[3]} alt="Post attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            {images.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-2xl">
                +{images.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="my-4">
        {renderGrid()}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 bg-black/95 border-none flex flex-col justify-center items-center overflow-hidden z-50">
          <DialogTitle className="sr-only">Image Gallery</DialogTitle>
          <DialogDescription className="sr-only">View full size image</DialogDescription>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-50 rounded-full" 
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>

          {images.length > 1 && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50 rounded-full h-12 w-12 hidden md:flex" 
                onClick={(e) => { e.stopPropagation(); prev(); }}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50 rounded-full h-12 w-12 hidden md:flex" 
                onClick={(e) => { e.stopPropagation(); next(); }}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={images[currentIndex]} 
              alt="Full size attachment" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-black/50 px-4 py-1.5 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
