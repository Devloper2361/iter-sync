"use client";
import { ItemCondition, MarketplaceFilters, SortOption } from '@/types/marketplace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
      sortBy: 'newest',
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  const handleCheckboxChange = (key: keyof MarketplaceFilters, checked: boolean) => {
    const updated = { ...localFilters, [key]: checked };
    setLocalFilters(updated);
    onChange(updated);
  };

  return (
    <Card className={`border-muted/60 shadow-sm bg-card ${className}`}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between border-b">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters & Preferences
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-6 w-6 lg:hidden" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        {/* Sort */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sort By</Label>
          <Select 
            value={localFilters.sortBy || 'newest'} 
            onValueChange={(v) => {
              const updated = { ...localFilters, sortBy: v as SortOption };
              setLocalFilters(updated);
              onChange(updated);
            }}
          >
            <SelectTrigger className="w-full bg-background h-9">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggles */}
        <div className="space-y-2.5 pt-1 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Availability</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="availableOnly"
              checked={!!localFilters.availableOnly}
              onCheckedChange={(checked) => handleCheckboxChange('availableOnly', !!checked)}
            />
            <Label htmlFor="availableOnly" className="text-sm font-normal cursor-pointer">
              Available Items Only (Hide Sold)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="negotiableOnly"
              checked={!!localFilters.negotiableOnly}
              onCheckedChange={(checked) => handleCheckboxChange('negotiableOnly', !!checked)}
            />
            <Label htmlFor="negotiableOnly" className="text-sm font-normal cursor-pointer">
              Negotiable Price Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="savedOnly"
              checked={!!localFilters.savedOnly}
              onCheckedChange={(checked) => handleCheckboxChange('savedOnly', !!checked)}
            />
            <Label htmlFor="savedOnly" className="text-sm font-normal cursor-pointer">
              Saved / Bookmarked Only
            </Label>
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-2 pt-1 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Condition</Label>
          <Select 
            value={localFilters.condition || 'all'} 
            onValueChange={(v) => {
              const updated = { ...localFilters, condition: v === 'all' ? undefined : (v as ItemCondition) };
              setLocalFilters(updated);
              onChange(updated);
            }}
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
        <div className="space-y-2 pt-1 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price Range (₹)</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              placeholder="Min" 
              className="h-9"
              value={localFilters.minPrice !== undefined ? localFilters.minPrice : ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setLocalFilters(prev => ({ ...prev, minPrice: val }));
              }}
            />
            <span className="text-muted-foreground">-</span>
            <Input 
              type="number" 
              placeholder="Max" 
              className="h-9"
              value={localFilters.maxPrice !== undefined ? localFilters.maxPrice : ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setLocalFilters(prev => ({ ...prev, maxPrice: val }));
              }}
            />
          </div>
        </div>

        {/* Department */}
        <div className="space-y-2 pt-1 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</Label>
          <Select 
            value={localFilters.department || 'all'} 
            onValueChange={(v) => {
              const updated = { ...localFilters, department: v === 'all' ? undefined : v };
              setLocalFilters(updated);
              onChange(updated);
            }}
          >
            <SelectTrigger className="w-full bg-background h-9">
              <SelectValue placeholder="Any department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Department</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Mechanical">Mechanical</SelectItem>
              <SelectItem value="Civil">Civil</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 pt-3 border-t">
          <Button onClick={handleApply} className="w-full h-9">Apply Filters</Button>
          <Button onClick={handleReset} variant="outline" className="w-full h-9">Reset All Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
}
