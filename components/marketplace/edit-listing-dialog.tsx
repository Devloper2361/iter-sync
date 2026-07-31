"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from 'react';
import { useUpdateListing, useUploadImages } from '@/hooks/use-marketplace';
import { Listing, MarketplaceCategory, ItemCondition } from '@/types/marketplace';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface EditListingDialogProps {
  listing: Listing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES: MarketplaceCategory[] = [
  'Books',
  'Electronics',
  'Hostel Essentials',
  'Furniture',
  'Cycles',
  'Lab Equipment',
  'Notes',
  'Stationery',
  'Services',
  'Others',
];

const CONDITIONS: ItemCondition[] = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export function EditListingDialog({ listing, open, onOpenChange }: EditListingDialogProps) {
  const updateListing = useUpdateListing();
  const uploadImages = useUploadImages();

  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [category, setCategory] = useState<MarketplaceCategory>(listing.category);
  const [condition, setCondition] = useState<ItemCondition>(listing.condition);
  const [price, setPrice] = useState(listing.price.toString());
  const [originalPrice, setOriginalPrice] = useState(listing.originalPrice ? listing.originalPrice.toString() : '');
  const [negotiable, setNegotiable] = useState(listing.negotiable ?? true);
  const [location, setLocation] = useState(listing.location);
  const [department, setDepartment] = useState(listing.department || '');
  const [images, setImages] = useState<string[]>(listing.images || []);
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(listing.title);
    setDescription(listing.description);
    setCategory(listing.category);
    setCondition(listing.condition);
    setPrice(listing.price.toString());
    setOriginalPrice(listing.originalPrice ? listing.originalPrice.toString() : '');
    setNegotiable(listing.negotiable ?? true);
    setLocation(listing.location);
    setDepartment(listing.department || '');
    setImages(listing.images || []);
  }, [listing]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const uploadedUrls = await uploadImages.mutateAsync(files);
      setImages(prev => [...prev, ...uploadedUrls]);
      toast.success(`${files.length} image(s) attached`);
    } catch (err) {
      toast.error('Failed to upload image');
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages(prev => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !price || isNaN(Number(price))) {
      toast.error('Please fill in required fields correctly');
      return;
    }

    if (images.length === 0) {
      toast.error('Please include at least one image');
      return;
    }

    updateListing.mutate(
      {
        id: listing.id,
        updates: {
          title: title.trim(),
          description: description.trim(),
          category,
          condition,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : undefined,
          negotiable,
          location: location.trim(),
          department: department.trim() || undefined,
          images,
        },
      },
      {
        onSuccess: () => {
          toast.success('Listing updated successfully!');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Failed to update listing');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Listing</DialogTitle>
          <DialogDescription>Update your listing details for buyers on campus.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input id="edit-title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={(v: MarketplaceCategory) => setCategory(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Condition *</Label>
              <Select value={condition} onValueChange={(v: ItemCondition) => setCondition(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-desc">Description *</Label>
            <Textarea id="edit-desc" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (₹) *</Label>
              <Input id="edit-price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-orig-price">Original Price (₹)</Label>
              <Input id="edit-orig-price" type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="edit-neg" checked={negotiable} onCheckedChange={c => setNegotiable(!!c)} />
            <Label htmlFor="edit-neg" className="text-sm font-medium">Price Negotiable</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-loc">Location *</Label>
              <Input id="edit-loc" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dept">Department</Label>
              <Input id="edit-dept" value={department} onChange={e => setDepartment(e.target.value)} />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t">
            <Label>Product Images *</Label>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border bg-muted">
                  <img src={img} alt={`Product ${i}`} className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full hover:bg-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors text-[10px]"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Or paste image URL..."
                value={imageUrlInput}
                onChange={e => setImageUrlInput(e.target.value)}
                className="text-xs h-8"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl} className="h-8">
                Add URL
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={updateListing.isPending}>
            {updateListing.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
