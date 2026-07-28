"use client"

import { useMarketplaceListing } from '@/hooks/use-marketplace';
import { ArrowLeft, MapPin, Heart, Share2, Tag, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SellerCard } from '@/components/marketplace/seller-card';

export default function ListingDetailsPage({ params }: { params: { id: string } }) {
  const { data: listing, isLoading } = useMarketplaceListing(params.id);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <h2 className="text-2xl font-bold mb-2">Listing not found</h2>
        <p className="text-muted-foreground mb-6">The item you are looking for may have been removed or sold.</p>
        <Button asChild><Link href="/marketplace">Back to Marketplace</Link></Button>
      </div>
    );
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 3600 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 px-4 sm:px-6 pt-6">
      <Link href="/marketplace" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pt-2">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden border bg-muted shadow-sm">
            <Image
              src={listing.images[0] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80'}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              referrerPolicy="no-referrer"
            />
            {listing.status === 'Sold' && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-background/90 text-foreground px-8 py-3 rounded-lg border shadow-lg text-2xl font-bold uppercase tracking-widest">
                  Sold
                </div>
              </div>
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {listing.images.map((img, i) => (
                <div key={i} className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 cursor-pointer ${i === 0 ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Badge variant="secondary" className="font-normal">{listing.category}</Badge>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {listing.location}</span>
              <span>•</span>
              <span>Posted {timeAgo(listing.createdAt)}</span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight mb-4 leading-tight">{listing.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-bold text-primary tracking-tight">
                {formatPrice(listing.price, listing.currency)}
              </div>
              {listing.originalPrice && (
                <div className="text-xl text-muted-foreground line-through font-medium">
                  {formatPrice(listing.originalPrice, listing.currency)}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Button size="lg" className="flex-1 md:flex-none md:w-48 shadow-sm">
                Message Seller
              </Button>
              <Button size="lg" variant="outline" className="flex-1 md:flex-none">
                <Heart className={`w-5 h-5 mr-2 ${listing.isBookmarkedByMe ? 'fill-red-500 text-red-500' : ''}`} />
                {listing.isBookmarkedByMe ? 'Saved' : 'Save'}
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0 hidden sm:flex">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Condition</p>
                <p className="text-sm text-muted-foreground">{listing.condition}</p>
              </div>
            </div>
            {listing.department && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-sm text-muted-foreground">{listing.department}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          <Separator className="mb-6" />

          {/* Seller Card */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
            <SellerCard seller={listing.seller} />
          </div>
          
          <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg flex gap-3 text-amber-800 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Safety Tips for Buyers</p>
              <ul className="list-disc pl-4 space-y-1 opacity-90">
                <li>Meet in a public, well-lit area on campus (e.g., Library, Cafeteria).</li>
                <li>Inspect the item carefully before paying.</li>
                <li>Do not pay in advance. Use cash or UPI at the time of exchange.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
