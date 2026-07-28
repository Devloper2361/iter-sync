import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace.service';
import { MarketplaceFilters } from '@/types/marketplace';

export function useMarketplaceListings(filters?: MarketplaceFilters) {
  return useQuery({
    queryKey: ['marketplace-listings', filters],
    queryFn: () => marketplaceService.getListings(filters),
  });
}

export function useMarketplaceListing(id: string) {
  return useQuery({
    queryKey: ['marketplace-listing', id],
    queryFn: () => marketplaceService.getListing(id),
    enabled: !!id,
  });
}

export function useMarketplaceCategories() {
  return useQuery({
    queryKey: ['marketplace-categories'],
    queryFn: () => marketplaceService.getCategories(),
  });
}

export function useFeaturedListings() {
  return useQuery({
    queryKey: ['marketplace-featured'],
    queryFn: () => marketplaceService.getFeaturedListings(),
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => marketplaceService.toggleBookmark(id),
    onSuccess: (_, id) => {
      // Invalidate both listing lists and individual listings
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-listing', id] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-featured'] });
    },
  });
}
