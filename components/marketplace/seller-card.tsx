import { Seller } from '@/types/marketplace';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

interface SellerCardProps {
  seller: Seller;
}

export function SellerCard({ seller }: SellerCardProps) {
  return (
    <Card className="border-muted/60 shadow-sm overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border">
            <AvatarImage src={seller.avatarUrl} />
            <AvatarFallback className="text-lg">{seller.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-lg">{seller.name}</h4>
              {seller.role === 'Student' && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
            </div>
            <p className="text-sm text-muted-foreground">{seller.department} • Joined {new Date(seller.joinedDate).getFullYear()}</p>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            View Profile
          </Button>
        </div>
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
          <div className="text-center px-4">
            <p className="font-semibold">{seller.rating.toFixed(1)} / 5.0</p>
            <p className="text-muted-foreground text-xs">Rating</p>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div className="text-center px-4">
            <p className="font-semibold">{seller.listingsCount}</p>
            <p className="text-muted-foreground text-xs">Active Listings</p>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div className="text-center px-4">
            <p className="font-semibold text-emerald-600">Verified</p>
            <p className="text-muted-foreground text-xs">Student ID</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
