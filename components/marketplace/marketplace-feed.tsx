import { useState } from 'react';
import { useMarketplaceListings, useMarketplaceCategories } from '@/hooks/use-marketplace';
import { MarketplaceFilters, MarketplaceCategory } from '@/types/marketplace';
import { ListingCard } from './listing-card';
import { SearchBar } from './search-bar';
import { CategoryChips } from './category-chips';
import { FilterPanel } from './filter-panel';
import { Loader2, Store, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MarketplaceFeed() {
  const [filters, setFilters] = useState<MarketplaceFilters>({
    category: 'All',
    sortBy: 'newest'
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <SearchBar value={filters.query || ''} onChange={handleSearch} />
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto lg:hidden bg-background">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
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

      {!isLoadingCategories && categories && (
        <CategoryChips 
          categories={categories} 
          activeCategory={filters.category || 'All'} 
          onSelect={handleCategorySelect} 
        />
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {isLoadingListings ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-muted/10">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your filters, searching with different keywords, or exploring other categories.
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => setFilters({ category: 'All', sortBy: 'newest' })}
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
