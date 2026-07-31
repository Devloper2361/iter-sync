import { favoriteRepository } from '@/repositories/favorite.repository';
import { Listing } from '@/types/marketplace';

export class FavoriteService {
  async getFavorites(): Promise<Listing[]> {
    return favoriteRepository.getFavorites();
  }

  async toggleFavorite(id: string): Promise<boolean> {
    return favoriteRepository.toggleFavorite(id);
  }
}

export const favoriteService = new FavoriteService();
