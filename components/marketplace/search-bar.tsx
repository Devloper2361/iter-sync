import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search for books, cycles, electronics..." }: SearchBarProps) {
  return (
    <div className="relative flex-1 max-w-2xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-11 bg-background shadow-sm border-muted/60 focus-visible:ring-primary focus-visible:border-primary"
      />
    </div>
  );
}
