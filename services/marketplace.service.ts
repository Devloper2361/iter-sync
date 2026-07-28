import { marketplaceRepository } from '@/repositories/marketplace.repository';
import { MarketplaceFilters } from '@/types/marketplace';

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
}

export const marketplaceService = new MarketplaceService();
