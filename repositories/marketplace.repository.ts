import { Listing, MarketplaceFilters, CreateListingInput, Seller } from '@/types/marketplace';
import { listingRepository } from './listing.repository';
import { favoriteRepository } from './favorite.repository';
import { imageRepository } from './image.repository';
import { marketplaceCategories, sellers } from '@/data/mock-marketplace-db';

export class MarketplaceRepository {
  async getListings(filters?: MarketplaceFilters): Promise<Listing[]> {
    return listingRepository.getListings(filters);
  }

  async getListingById(id: string): Promise<Listing | undefined> {
    return listingRepository.getListingById(id);
  }

  async getCategories() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return marketplaceCategories;
  }

  async getFeaturedListings(): Promise<Listing[]> {
    const listings = await listingRepository.getListings({ availableOnly: true });
    return listings
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
  }

  async toggleBookmark(id: string): Promise<boolean> {
    return favoriteRepository.toggleFavorite(id);
  }

  async getFavorites(): Promise<Listing[]> {
    return favoriteRepository.getFavorites();
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

  async getSellerProfile(sellerId: string): Promise<Seller | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (sellers[sellerId]) return sellers[sellerId];
    // fallback search in listings
    const listings = await listingRepository.getListings();
    const listing = listings.find(l => l.seller.id === sellerId);
    return listing?.seller;
  }

  async uploadImages(files: File[]): Promise<string[]> {
    return imageRepository.uploadImages(files);
  }
}

export const marketplaceRepository = new MarketplaceRepository();
