import { ItemCondition, MarketplaceFilters, SortOption } from '@/types/marketplace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FilterPanelProps {
  filters: MarketplaceFilters;
  onChange: (filters: MarketplaceFilters) => void;
  onClose?: () => void;
  className?: string;
}

export function FilterPanel({ filters, onChange, onClose, className = "" }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<MarketplaceFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onChange(localFilters);
    if (onClose) onClose();
  };

  const handleReset = () => {
    const resetFilters: MarketplaceFilters = {
      query: localFilters.query,
      category: localFilters.category,
      sortBy: localFilters.sortBy,
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  return (
    <Card className={`border-muted/60 shadow-sm ${className}`}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-6 w-6 lg:hidden" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sort */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sort By</Label>
          <Select 
            value={localFilters.sortBy || 'newest'} 
            onValueChange={(v) => setLocalFilters({ ...localFilters, sortBy: v as SortOption })}
          >
            <SelectTrigger className="w-full bg-background h-9">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Condition */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Condition</Label>
          <Select 
            value={localFilters.condition || 'all'} 
            onValueChange={(v) => setLocalFilters({ ...localFilters, condition: v === 'all' ? undefined : v as ItemCondition })}
          >
            <SelectTrigger className="w-full bg-background h-9">
              <SelectValue placeholder="Any condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Condition</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Like New">Like New</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price Range (₹)</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              placeholder="Min" 
              className="h-9"
              value={localFilters.minPrice || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
            />
            <span className="text-muted-foreground">-</span>
            <Input 
              type="number" 
              placeholder="Max" 
              className="h-9"
              value={localFilters.maxPrice || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
        </div>

        {/* Department */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</Label>
          <Select 
            value={localFilters.department || 'all'} 
            onValueChange={(v) => setLocalFilters({ ...localFilters, department: v === 'all' ? undefined : v })}
          >
            <SelectTrigger className="w-full bg-background h-9">
              <SelectValue placeholder="Any department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Department</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Mechanical">Mechanical</SelectItem>
              <SelectItem value="Civil">Civil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={handleApply} className="w-full h-9">Apply Filters</Button>
          <Button onClick={handleReset} variant="outline" className="w-full h-9">Reset All</Button>
        </div>
      </CardContent>
    </Card>
  );
}
