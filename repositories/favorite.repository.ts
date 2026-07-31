import { Listing } from '@/types/marketplace';
import { listingRepository } from './listing.repository';

export class FavoriteRepository {
  async getFavorites(): Promise<Listing[]> {
    const all = await listingRepository.getListings();
    return all.filter(l => l.isBookmarkedByMe);
  }

  async toggleFavorite(id: string): Promise<boolean> {
    const listing = await listingRepository.getListingById(id);
    if (listing) {
      listing.isBookmarkedByMe = !listing.isBookmarkedByMe;
      return listing.isBookmarkedByMe;
    }
    return false;
  }
}

export const favoriteRepository = new FavoriteRepository();
