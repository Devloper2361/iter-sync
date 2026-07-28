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
  isBookmarkedByMe?: boolean;
  status: 'Active' | 'Sold' | 'Reserved';
}

export interface MarketplaceFilters {
  query?: string;
  category?: MarketplaceCategory | 'All';
  department?: string;
  condition?: ItemCondition;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
}
