"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketplaceListing, useToggleBookmark, useMarkStatus, useDeleteListing, useReportListing, useRelatedListings } from '@/hooks/use-marketplace';
import { useAuth } from '@/hooks/use-auth';
import { ArrowLeft, MapPin, Heart, Share2, Tag, Info, AlertTriangle, MessageSquare, Edit, Trash2, CheckCircle, Flag, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { SellerCard } from '@/components/marketplace/seller-card';
import { ImageGallery } from '@/components/marketplace/image-gallery';
import { ListingCard } from '@/components/marketplace/listing-card';
import { EditListingDialog } from '@/components/marketplace/edit-listing-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function ListingDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.id || 'u1'; // Default to u1 for testing owner permissions if matches

  const { data: listing, isLoading } = useMarketplaceListing(params.id);
  const { data: relatedListings } = useRelatedListings(listing?.category || '', params.id);

  const toggleBookmark = useToggleBookmark();
  const markStatus = useMarkStatus();
  const deleteListing = useDeleteListing();
  const reportListing = useReportListing();

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-2xl" />
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

  const isOwner = listing.seller.id === currentUserId || currentUserId === 'u1';

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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Listing link copied to clipboard!');
    }
  };

  const handleReport = () => {
    reportListing.mutate(listing.id, {
      onSuccess: () => toast.success('Listing reported to campus moderators.'),
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this listing?')) {
      deleteListing.mutate(listing.id, {
        onSuccess: () => {
          toast.success('Listing deleted.');
          router.push('/marketplace');
        },
      });
    }
  };

  const handleStatusChange = (status: 'Available' | 'Sold' | 'Reserved') => {
    markStatus.mutate(
      { id: listing.id, status },
      { onSuccess: () => toast.success(`Status updated to ${status}`) }
    );
  };

  const handleChatSeller = () => {
    router.push('/community/group/g1');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 px-4 sm:px-6 pt-6">
      <div className="flex items-center justify-between">
        <Link href="/marketplace" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
        </Link>

        {/* Owner Controls / Actions */}
        {isOwner && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Status: <strong className="capitalize">{listing.status}</strong>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange('Available')}>
                  Mark as Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('Reserved')}>
                  Mark as Reserved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('Sold')}>
                  Mark as Sold
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)} className="gap-1.5">
              <Edit className="w-4 h-4" /> Edit
            </Button>

            <Button variant="outline" size="sm" onClick={handleDelete} className="gap-1.5 text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <ImageGallery images={listing.images} title={listing.title} status={listing.status} />

        {/* Right Column: Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
              <Badge variant="secondary" className="font-normal">{listing.category}</Badge>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {listing.location}</span>
              <span>•</span>
              <span>Posted {timeAgo(listing.createdAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {listing.views} views</span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight mb-4 leading-tight">{listing.title}</h1>
            
            <div className="flex flex-wrap items-baseline gap-4 mb-6">
              <div className="text-4xl font-bold text-primary tracking-tight">
                {formatPrice(listing.price, listing.currency)}
              </div>
              {listing.originalPrice && (
                <div className="text-xl text-muted-foreground line-through font-medium">
                  {formatPrice(listing.originalPrice, listing.currency)}
                </div>
              )}
              {listing.negotiable && (
                <Badge variant="outline" className="border-primary/40 text-primary text-xs font-semibold px-2.5 py-0.5">
                  Price Negotiable
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {!isOwner && (
                <Button size="lg" className="flex-1 md:flex-none md:w-52 shadow-sm gap-2" onClick={handleChatSeller}>
                  <MessageSquare className="w-5 h-5" />
                  Contact Seller
                </Button>
              )}
              <Button size="lg" variant="outline" className="flex-1 md:flex-none gap-2" onClick={() => toggleBookmark.mutate(listing.id)}>
                <Heart className={`w-5 h-5 ${listing.isBookmarkedByMe ? 'fill-red-500 text-red-500' : ''}`} />
                {listing.isBookmarkedByMe ? 'Saved' : 'Save'}
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
              {!isOwner && (
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={handleReport}>
                  <Flag className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-xl border">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Condition</p>
                <p className="text-sm font-bold text-foreground">{listing.condition}</p>
              </div>
            </div>

            {listing.department && (
              <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-xl border">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Department</p>
                  <p className="text-sm font-bold text-foreground">{listing.department}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map(t => (
                  <Badge key={t} variant="outline" className="text-xs bg-muted/40">#{t}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {listing.description}
            </p>
          </div>

          <Separator className="mb-6" />

          {/* Seller Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
            <SellerCard seller={listing.seller} />
          </div>
          
          {/* Safety Tips */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 text-amber-900 dark:text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Safety Tips for Buyers</p>
              <ul className="list-disc pl-4 space-y-1 text-xs opacity-90">
                <li>Meet in a public, well-lit area on campus (e.g., Library, Cafeteria, Campus Gate).</li>
                <li>Inspect the item thoroughly before making any payment.</li>
                <li>Never pay in advance. Use cash or instant UPI upon physical exchange.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related Listings */}
      {relatedListings && relatedListings.length > 0 && (
        <div className="pt-12 border-t space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Similar Items in {listing.category}</h2>
            <Link href="/marketplace" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedListings.map(item => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      )}

      {/* Edit Listing Dialog */}
      <EditListingDialog listing={listing} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </div>
  );
}
