import { Listing, CreateListingInput, MarketplaceFilters, Seller } from '@/types/marketplace';
import { mockListings, sellers } from '@/data/mock-marketplace-db';

export class ListingRepository {
  private listings: Listing[] = mockListings;

  async getListings(filters?: MarketplaceFilters): Promise<Listing[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    let result = [...this.listings];

    if (filters) {
      if (filters.query) {
        const q = filters.query.toLowerCase().trim();
        result = result.filter(l => 
          l.title.toLowerCase().includes(q) || 
          l.description.toLowerCase().includes(q) ||
          l.tags?.some(t => t.toLowerCase().includes(q))
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

      if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
        result = result.filter(l => l.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
        result = result.filter(l => l.price <= filters.maxPrice!);
      }

      if (filters.availableOnly) {
        result = result.filter(l => l.status === 'Available');
      }

      if (filters.negotiableOnly) {
        result = result.filter(l => l.negotiable === true);
      }

      if (filters.savedOnly) {
        result = result.filter(l => l.isBookmarkedByMe === true);
      }

      if (filters.sellerId) {
        result = result.filter(l => l.seller.id === filters.sellerId);
      }

      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'oldest':
            result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return result;
  }

  async getListingById(id: string): Promise<Listing | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const listing = this.listings.find(l => l.id === id);
    if (listing) {
      listing.views += 1;
    }
    return listing;
  }

  async createListing(input: CreateListingInput, currentSeller: Seller): Promise<Listing> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newListing: Listing = {
      id: `l_${Date.now()}`,
      title: input.title,
      description: input.description,
      price: input.price,
      originalPrice: input.originalPrice,
      currency: 'INR',
      condition: input.condition,
      category: input.category,
      images: input.images.length > 0 ? input.images : ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80'],
      seller: currentSeller,
      department: input.department,
      location: input.location,
      createdAt: new Date().toISOString(),
      views: 0,
      negotiable: input.negotiable ?? true,
      tags: input.tags || [],
      isBookmarkedByMe: false,
      status: input.isDraft ? 'Available' : 'Available',
      isDraft: input.isDraft || false,
    };

    this.listings.unshift(newListing);
    return newListing;
  }

  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.listings.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Listing not found');
    }
    this.listings[index] = {
      ...this.listings[index],
      ...updates,
    };
    return this.listings[index];
  }

  async deleteListing(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.listings = this.listings.filter(l => l.id !== id);
  }

  async markStatus(id: string, status: 'Available' | 'Sold' | 'Reserved'): Promise<Listing> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const listing = this.listings.find(l => l.id === id);
    if (!listing) {
      throw new Error('Listing not found');
    }
    listing.status = status;
    return listing;
  }

  async reportListing(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const listing = this.listings.find(l => l.id === id);
    if (listing) {
      listing.reported = true;
    }
  }

  async getRelatedListings(category: string, currentId: string): Promise<Listing[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.listings
      .filter(l => l.category === category && l.id !== currentId && l.status === 'Available')
      .slice(0, 4);
  }
}

export const listingRepository = new ListingRepository();
