"use client"

import { MarketplaceFeed } from '@/components/marketplace/marketplace-feed';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function MarketplacePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground mt-1">Buy, sell, and trade campus goods.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button className="w-full md:w-auto shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Sell an Item
          </Button>
        </div>
      </div>

      <MarketplaceFeed />
    </div>
  );
}
