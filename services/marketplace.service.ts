import { marketplaceRepository } from '@/repositories/marketplace.repository';
import { MarketplaceFilters, CreateListingInput, Seller, Listing } from '@/types/marketplace';

export class MarketplaceService {
  async getListings(filters?: MarketplaceFilters) {
    return marketplaceRepository.getListings(filters);
  }

  async getListing(id: string) {
    return marketplaceRepository.getListingById(id);
  }

  async getCategories() {
    return marketplaceRepository.getCategories();
  }

  async getFeaturedListings() {
    return marketplaceRepository.getFeaturedListings();
  }

  async toggleBookmark(id: string) {
    return marketplaceRepository.toggleBookmark(id);
  }

  async getFavorites() {
    return marketplaceRepository.getFavorites();
  }

  async createListing(input: CreateListingInput, currentSeller: Seller) {
    return marketplaceRepository.createListing(input, currentSeller);
  }

  async updateListing(id: string, updates: Partial<Listing>) {
    return marketplaceRepository.updateListing(id, updates);
  }

  async deleteListing(id: string) {
    return marketplaceRepository.deleteListing(id);
  }

  async markStatus(id: string, status: 'Available' | 'Sold' | 'Reserved') {
    return marketplaceRepository.markStatus(id, status);
  }

  async reportListing(id: string) {
    return marketplaceRepository.reportListing(id);
  }

  async getRelatedListings(category: string, currentId: string) {
    return marketplaceRepository.getRelatedListings(category, currentId);
  }

  async getSellerProfile(sellerId: string) {
    return marketplaceRepository.getSellerProfile(sellerId);
  }

  async uploadImages(files: File[]) {
    return marketplaceRepository.uploadImages(files);
  }
}

export const marketplaceService = new MarketplaceService();
