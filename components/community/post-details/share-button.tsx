import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, Twitter, Linkedin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

interface ShareButtonProps {
  url: string;
  title: string;
  count?: number;
  className?: string;
  showLabel?: boolean;
}

export function ShareButton({ url, title, count = 0, className = "", showLabel = true }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: fullUrl
        });
      } catch (e) {
        console.error('Error sharing:', e);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={`text-muted-foreground hover:bg-primary/5 ${className}`}>
          <Share2 className={`w-5 h-5 ${showLabel ? 'mr-2' : ''}`} />
          {showLabel && 'Share'}
          {!showLabel && count > 0 && <span className="ml-1 text-xs">{count}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="center">
        <div className="flex flex-col gap-1">
          {typeof navigator !== 'undefined' && ('share' in navigator) && (
            <Button variant="ghost" className="justify-start w-full text-sm" onClick={handleNativeShare}>
              <Share2 className="w-4 h-4 mr-2" /> Share via...
            </Button>
          )}
          <Button variant="ghost" className="justify-start w-full text-sm" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <div className="h-px bg-border my-1" />
          <Button variant="ghost" className="justify-start w-full text-sm text-[#1DA1F2]" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`)}>
            <Twitter className="w-4 h-4 mr-2" /> Twitter
          </Button>
          <Button variant="ghost" className="justify-start w-full text-sm text-[#0A66C2]" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`)}>
            <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
