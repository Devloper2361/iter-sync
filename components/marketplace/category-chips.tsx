import { MarketplaceCategory } from '@/types/marketplace';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoryChipsProps {
  categories: { name: MarketplaceCategory; count: number; icon: string }[];
  activeCategory: MarketplaceCategory | 'All';
  onSelect: (category: MarketplaceCategory | 'All') => void;
}

export function CategoryChips({ categories, activeCategory, onSelect }: CategoryChipsProps) {
  return (
    <div className="relative w-full">
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex w-max space-x-2 px-1">
          <Button
            variant={activeCategory === 'All' ? 'default' : 'outline'}
            className="rounded-full h-9 px-4 text-sm font-medium transition-colors"
            onClick={() => onSelect('All')}
          >
            All Items
          </Button>
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={activeCategory === category.name ? 'default' : 'outline'}
              className="rounded-full h-9 px-4 text-sm font-medium transition-colors border-muted/60"
              onClick={() => onSelect(category.name)}
            >
              {category.name}
              <span className={`ml-2 text-xs ${activeCategory === category.name ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {category.count}
              </span>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
