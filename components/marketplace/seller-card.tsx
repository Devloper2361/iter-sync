"use client";
import { useState } from 'react';
import { Seller } from '@/types/marketplace';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Star } from 'lucide-react';
import { SellerProfileModal } from './seller-profile-modal';

interface SellerCardProps {
  seller: Seller;
}

export function SellerCard({ seller }: SellerCardProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <Card className="border-muted/60 shadow-sm overflow-hidden bg-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setProfileOpen(true)}>
              <AvatarImage src={seller.avatarUrl} />
              <AvatarFallback className="text-lg">{seller.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-lg truncate cursor-pointer hover:text-primary transition-colors" onClick={() => setProfileOpen(true)}>
                  {seller.name}
                </h4>
                {seller.role === 'Student' && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground truncate">{seller.department} • Joined {new Date(seller.joinedDate).getFullYear()}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setProfileOpen(true)} className="shrink-0">
              View Profile
            </Button>
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
            <div className="text-center px-4">
              <p className="font-semibold flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {seller.rating.toFixed(1)}
              </p>
              <p className="text-muted-foreground text-xs">Rating</p>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center px-4">
              <p className="font-semibold">{seller.listingsCount}</p>
              <p className="text-muted-foreground text-xs">Listings</p>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center px-4">
              <p className="font-semibold text-emerald-600">Verified</p>
              <p className="text-muted-foreground text-xs">Student ID</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <SellerProfileModal seller={seller} open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
