"use client";
import { useState } from 'react';
import { useMarketplaceListings, useMarketplaceCategories } from '@/hooks/use-marketplace';
import { MarketplaceFilters, MarketplaceCategory } from '@/types/marketplace';
import { ListingCard } from './listing-card';
import { SearchBar } from './search-bar';
import { CategoryChips } from './category-chips';
import { FilterPanel } from './filter-panel';
import { Loader2, Store, SlidersHorizontal, Heart, Sparkles, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

interface MarketplaceFeedProps {
  initialSavedOnly?: boolean;
}

export function MarketplaceFeed({ initialSavedOnly = false }: MarketplaceFeedProps) {
  const [filters, setFilters] = useState<MarketplaceFilters>({
    category: 'All',
    sortBy: 'newest',
    savedOnly: initialSavedOnly,
    availableOnly: false,
  });
  
  const { data: listings, isLoading: isLoadingListings } = useMarketplaceListings(filters);
  const { data: categories, isLoading: isLoadingCategories } = useMarketplaceCategories();

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const handleCategorySelect = (category: MarketplaceCategory | 'All') => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleFilterChange = (newFilters: MarketplaceFilters) => {
    setFilters(newFilters);
  };

  const toggleSavedOnly = () => {
    setFilters(prev => ({ ...prev, savedOnly: !prev.savedOnly }));
  };

  return (
    <div className="space-y-6">
      {/* Search and Top Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <SearchBar value={filters.query || ''} onChange={handleSearch} />
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Quick Filter Buttons */}
          <Button
            variant={filters.savedOnly ? "default" : "outline"}
            size="sm"
            onClick={toggleSavedOnly}
            className="gap-2 bg-background sm:bg-transparent"
          >
            <Heart className={`w-4 h-4 ${filters.savedOnly ? "fill-current text-white" : "text-muted-foreground"}`} />
            Saved Items
          </Button>

          {/* Mobile Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto lg:hidden bg-background gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(filters.category !== 'All' || filters.minPrice || filters.maxPrice || filters.condition || filters.savedOnly) && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-[300px] sm:w-[340px]">
              <div className="p-4 h-full overflow-y-auto">
                <FilterPanel filters={filters} onChange={handleFilterChange} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Categories */}
      {!isLoadingCategories && categories && (
        <CategoryChips 
          categories={categories} 
          activeCategory={filters.category || 'All'} 
          onSelect={handleCategorySelect} 
        />
      )}

      {/* Main Grid & Desktop Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              {listings ? `${listings.length} item${listings.length === 1 ? '' : 's'} available` : 'Loading items...'}
            </span>
            {filters.savedOnly && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Heart className="w-3 h-3 fill-red-500 text-red-500" /> Showing Saved Favorites
              </Badge>
            )}
          </div>

          {isLoadingListings ? (
            <div className="flex justify-center p-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-2xl bg-muted/10">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                {filters.savedOnly 
                  ? "You haven't bookmarked any items yet. Click the heart icon on any listing card to save it."
                  : "Try adjusting your filters, searching with different keywords, or exploring other categories."}
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => setFilters({ category: 'All', sortBy: 'newest', savedOnly: false })}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24">
            <FilterPanel filters={filters} onChange={handleFilterChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
