import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace.service';
import { listingService } from '@/services/listing.service';
import { favoriteService } from '@/services/favorite.service';
import { MarketplaceFilters, CreateListingInput, Seller, Listing } from '@/types/marketplace';

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

export function useFavorites() {
  return useQuery({
    queryKey: ['marketplace-favorites'],
    queryFn: () => favoriteService.getFavorites(),
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => favoriteService.toggleFavorite(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-listing', id] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-featured'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-favorites'] });
    },
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input, currentSeller }: { input: CreateListingInput; currentSeller: Seller }) => 
      listingService.createListing(input, currentSeller),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-featured'] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Listing> }) => 
      listingService.updateListing(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-listing', id] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-featured'] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => listingService.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-featured'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-favorites'] });
    },
  });
}

export function useMarkStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'Available' | 'Sold' | 'Reserved' }) => 
      listingService.markStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-listing', id] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-featured'] });
    },
  });
}

export function useReportListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => listingService.reportListing(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listing', id] });
    },
  });
}

export function useRelatedListings(category: string, currentId: string) {
  return useQuery({
    queryKey: ['marketplace-related', category, currentId],
    queryFn: () => listingService.getRelatedListings(category, currentId),
    enabled: !!category && !!currentId,
  });
}

export function useSellerProfile(sellerId: string) {
  return useQuery({
    queryKey: ['seller-profile', sellerId],
    queryFn: () => marketplaceService.getSellerProfile(sellerId),
    enabled: !!sellerId,
  });
}

export function useUploadImages() {
  return useMutation({
    mutationFn: (files: File[]) => marketplaceService.uploadImages(files),
  });
}
