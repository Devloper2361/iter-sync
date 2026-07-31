"use client"

import { useState } from 'react';
import { MarketplaceFeed } from '@/components/marketplace/marketplace-feed';
import { CreateListingDialog } from '@/components/marketplace/create-listing-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Tag, Store } from 'lucide-react';

export default function MarketplacePage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Campus Marketplace</h1>
          </div>
          <p className="text-muted-foreground mt-1">Buy, sell, and trade textbooks, electronics, hostel gear, and services with ITER peers.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button onClick={() => setCreateDialogOpen(true)} size="lg" className="w-full md:w-auto shadow-sm gap-2">
            <Plus className="w-5 h-5" />
            Sell an Item
          </Button>
        </div>
      </div>

      <MarketplaceFeed />

      <CreateListingDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
}
