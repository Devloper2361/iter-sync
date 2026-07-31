"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from 'react';
import { useCreateListing, useUploadImages } from '@/hooks/use-marketplace';
import { useAuth } from '@/hooks/use-auth';
import { CreateListingInput, MarketplaceCategory, ItemCondition } from '@/types/marketplace';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, X, Eye, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface CreateListingDialogProps {
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

export function CreateListingDialog({ open, onOpenChange }: CreateListingDialogProps) {
  const { user } = useAuth();
  const createListing = useCreateListing();
  const uploadImages = useUploadImages();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory>('Books');
  const [condition, setCondition] = useState<ItemCondition>('Good');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [location, setLocation] = useState('Hostel Campus');
  const [department, setDepartment] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (isDraft = false) => {
    if (!title.trim()) {
      toast.error('Please enter a listing title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    if (!price || isNaN(Number(price))) {
      toast.error('Please enter a valid price');
      return;
    }

    const currentSeller = {
      id: user?.id || 'u1',
      name: user?.name || 'ITER Student',
      avatarUrl: (user as any)?.avatarUrl || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
      department: user?.department || 'Computer Science',
      semester: user?.semester || 5,
      role: (user?.role === 'student' ? 'Student' : user?.role === 'faculty' ? 'Faculty' : 'Admin') as 'Student' | 'Faculty' | 'Admin',
      joinedDate: new Date().toISOString(),
      rating: 5.0,
      listingsCount: 1,
    };

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const input: CreateListingInput = {
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      negotiable,
      location: location.trim() || 'ITER Campus',
      department: department.trim() || undefined,
      tags,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80'],
      isDraft,
    };

    createListing.mutate(
      { input, currentSeller },
      {
        onSuccess: () => {
          toast.success(isDraft ? 'Draft saved successfully!' : 'Listing published successfully!');
          resetForm();
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Failed to create listing');
        },
      }
    );
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Books');
    setCondition('Good');
    setPrice('');
    setOriginalPrice('');
    setNegotiable(true);
    setLocation('Hostel Campus');
    setDepartment('');
    setTagsInput('');
    setImages([]);
    setIsPreview(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Create Marketplace Listing</DialogTitle>
              <DialogDescription>Sell your textbooks, electronics, hostel gear, or services to ITER students.</DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className="gap-2 text-xs"
            >
              <Eye className="w-4 h-4" />
              {isPreview ? 'Edit Mode' : 'Preview'}
            </Button>
          </div>
        </DialogHeader>

        {isPreview ? (
          <div className="border rounded-xl p-6 space-y-4 bg-card">
            <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
              <img
                src={images[0] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80'}
                alt="Preview"
                className="object-cover w-full h-full"
              />
              <Badge className="absolute top-3 left-3 bg-primary/90">{category}</Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{title || 'Listing Title Preview'}</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-primary">₹{price || '0'}</span>
                {originalPrice && <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>}
                {negotiable && <Badge variant="outline" className="text-xs">Negotiable</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{description || 'No description provided.'}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">{condition}</Badge>
                <Badge variant="outline">{location || 'ITER Campus'}</Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Casio Scientific Calculator / CLRS Textbook"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(val: MarketplaceCategory) => setCategory(val)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe item condition, inclusions, reason for selling, and specs..."
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Price & Negotiable */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g. 500"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  placeholder="e.g. 1200"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2 h-10 pb-2">
                <Checkbox
                  id="negotiable"
                  checked={negotiable}
                  onCheckedChange={checked => setNegotiable(!!checked)}
                />
                <Label htmlFor="negotiable" className="text-sm font-medium cursor-pointer">
                  Price Negotiable
                </Label>
              </div>
            </div>

            {/* Condition & Location & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select value={condition} onValueChange={(val: ItemCondition) => setCondition(val)}>
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g. Hostel A / Central Library"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department (Optional)</Label>
                <Input
                  id="department"
                  placeholder="e.g. Computer Science"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="e.g. Textbook, CSE, 5thSem, Urgent"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <Label>Product Images</Label>
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
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border bg-muted">
                    <img src={img} alt={`Product ${i}`} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors text-xs"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                </button>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Or paste image URL..."
                  value={imageUrlInput}
                  onChange={e => setImageUrlInput(e.target.value)}
                  className="text-xs"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl}>
                  Add URL
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleSubmit(true)} disabled={createListing.isPending}>
            Save Draft
          </Button>
          <Button onClick={() => handleSubmit(false)} disabled={createListing.isPending}>
            {createListing.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Publish Listing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
