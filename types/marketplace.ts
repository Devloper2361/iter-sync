import { Author } from './community';

export type MarketplaceCategory = 
  | 'Books' 
  | 'Electronics' 
  | 'Hostel Essentials' 
  | 'Furniture' 
  | 'Cycles' 
  | 'Lab Equipment' 
  | 'Notes' 
  | 'Stationery' 
  | 'Services' 
  | 'Others';

export type ItemCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';

export type SortOption = 
  | 'newest' 
  | 'oldest'
  | 'price_asc' 
  | 'price_desc' 
  | 'popular';

export interface Seller extends Author {
  joinedDate: string;
  rating: number;
  listingsCount: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  condition: ItemCondition;
  category: MarketplaceCategory;
  images: string[];
  seller: Seller;
  department?: string;
  location: string;
  createdAt: string;
  views: number;
  negotiable?: boolean;
  tags?: string[];
  isBookmarkedByMe?: boolean;
  status: 'Available' | 'Sold' | 'Reserved';
  isDraft?: boolean;
  reported?: boolean;
}

export interface CreateListingInput {
  title: string;
  description: string;
  category: MarketplaceCategory;
  condition: ItemCondition;
  price: number;
  originalPrice?: number;
  negotiable?: boolean;
  images: string[];
  location: string;
  department?: string;
  tags?: string[];
  isDraft?: boolean;
}

export interface MarketplaceFilters {
  query?: string;
  category?: MarketplaceCategory | 'All';
  department?: string;
  condition?: ItemCondition;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
  availableOnly?: boolean;
  negotiableOnly?: boolean;
  savedOnly?: boolean;
  sellerId?: string;
}

