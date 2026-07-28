import { Listing } from '@/types/marketplace';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useToggleBookmark } from '@/hooks/use-marketplace';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const toggleBookmark = useToggleBookmark();

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark.mutate(listing.id);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Like New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Good': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 3600 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Link href={`/marketplace/listing/${listing.id}`}>
      <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 border-muted/60 h-full flex flex-col cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={listing.images[0] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80'}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 right-3 z-10">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 shadow-sm"
              onClick={handleBookmark}
            >
              <Heart className={`w-4 h-4 ${listing.isBookmarkedByMe ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
            </Button>
          </div>
          {listing.status === 'Sold' && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Badge variant="secondary" className="text-lg px-4 py-1 font-semibold uppercase tracking-wider">Sold</Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-primary">{formatPrice(listing.price, listing.currency)}</span>
            {listing.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(listing.originalPrice, listing.currency)}
              </span>
            )}
          </div>
          
          <div className="mt-auto space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={`border-transparent ${getConditionColor(listing.condition)}`}>
                {listing.condition}
              </Badge>
              <Badge variant="outline" className="bg-muted text-muted-foreground">
                {listing.category}
              </Badge>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-3 border-t bg-muted/10 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1 max-w-[60%]">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3 shrink-0" />
            <span>{timeAgo(listing.createdAt)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
