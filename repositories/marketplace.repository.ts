import { Listing, MarketplaceFilters, MarketplaceCategory } from '@/types/marketplace';
import { mockListings, marketplaceCategories } from '@/data/mock-marketplace-db';

export class MarketplaceRepository {
  private listings = [...mockListings];

  async getListings(filters?: MarketplaceFilters): Promise<Listing[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let result = [...this.listings];
    
    if (filters) {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        result = result.filter(l => 
          l.title.toLowerCase().includes(q) || 
          l.description.toLowerCase().includes(q)
        );
      }
      
      if (filters.category && filters.category !== 'All') {
        result = result.filter(l => l.category === filters.category);
      }
      
      if (filters.department) {
        result = result.filter(l => l.department === filters.department);
      }
      
      if (filters.condition) {
        result = result.filter(l => l.condition === filters.condition);
      }
      
      if (filters.minPrice !== undefined) {
        result = result.filter(l => l.price >= filters.minPrice!);
      }
      
      if (filters.maxPrice !== undefined) {
        result = result.filter(l => l.price <= filters.maxPrice!);
      }
      
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'price_asc':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            result.sort((a, b) => b.price - a.price);
            break;
          case 'popular':
            result.sort((a, b) => b.views - a.views);
            break;
        }
      } else {
        // default sort
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return result;
  }

  async getListingById(id: string): Promise<Listing | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const listing = this.listings.find(l => l.id === id);
    if (listing) {
      listing.views++; // mock increment views
    }
    return listing;
  }

  async getCategories() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return marketplaceCategories;
  }

  async getFeaturedListings(): Promise<Listing[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.listings
      .filter(l => l.status === 'Active')
      .sort((a, b) => b.views - a.views)
      .slice(0, 4);
  }

  async toggleBookmark(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const listing = this.listings.find(l => l.id === id);
    if (listing) {
      listing.isBookmarkedByMe = !listing.isBookmarkedByMe;
    }
  }
}

export const marketplaceRepository = new MarketplaceRepository();
