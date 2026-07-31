"use client";
import { useState } from 'react';
import { Seller, Listing } from '@/types/marketplace';
import { useMarketplaceListings } from '@/hooks/use-marketplace';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Star, Calendar, MessageSquare, MapPin, Store } from 'lucide-react';
import { ListingCard } from './listing-card';
import { useRouter } from 'next/navigation';

interface SellerProfileModalProps {
  seller: Seller;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SellerProfileModal({ seller, open, onOpenChange }: SellerProfileModalProps) {
  const router = useRouter();
  const { data: sellerListings } = useMarketplaceListings({ sellerId: seller.id });

  const handleContact = () => {
    onOpenChange(false);
    // Navigate to community group chat or direct message
    router.push('/community/group/g1');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Seller Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-muted/30 border rounded-xl">
            <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-sm">
              <AvatarImage src={seller.avatarUrl} />
              <AvatarFallback className="text-2xl font-bold">{seller.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-2xl font-bold">{seller.name}</h3>
                <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified ITER Student
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {seller.department} {seller.semester ? `• Semester ${seller.semester}` : ''}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <strong className="text-foreground">{seller.rating.toFixed(1)}</strong> Rating
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {new Date(seller.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" />
                  <strong className="text-foreground">{sellerListings?.length || seller.listingsCount}</strong> Listings
                </span>
              </div>
            </div>

            <Button onClick={handleContact} className="gap-2 shadow-sm w-full sm:w-auto">
              <MessageSquare className="w-4 h-4" />
              Contact Seller
            </Button>
          </div>

          {/* Seller's Listings */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Listings from {seller.name.split(' ')[0]}</h4>
            {sellerListings && sellerListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sellerListings.map(listing => (
                  <div key={listing.id} onClick={() => onOpenChange(false)}>
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic py-6 text-center">No other active listings found for this seller.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
