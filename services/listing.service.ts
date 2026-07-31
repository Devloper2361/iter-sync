import { listingRepository } from '@/repositories/listing.repository';
import { MarketplaceFilters, CreateListingInput, Listing, Seller } from '@/types/marketplace';

export class ListingService {
  async getListings(filters?: MarketplaceFilters): Promise<Listing[]> {
    return listingRepository.getListings(filters);
  }

  async getListingById(id: string): Promise<Listing | undefined> {
    return listingRepository.getListingById(id);
  }

  async createListing(input: CreateListingInput, currentSeller: Seller): Promise<Listing> {
    return listingRepository.createListing(input, currentSeller);
  }

  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
    return listingRepository.updateListing(id, updates);
  }

  async deleteListing(id: string): Promise<void> {
    return listingRepository.deleteListing(id);
  }

  async markStatus(id: string, status: 'Available' | 'Sold' | 'Reserved'): Promise<Listing> {
    return listingRepository.markStatus(id, status);
  }

  async reportListing(id: string): Promise<void> {
    return listingRepository.reportListing(id);
  }

  async getRelatedListings(category: string, currentId: string): Promise<Listing[]> {
    return listingRepository.getRelatedListings(category, currentId);
  }
}

export const listingService = new ListingService();
