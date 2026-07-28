import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import { PostDraft } from './types';

interface DraftManagerProps {
  currentDraft: Partial<PostDraft>;
  onRestore: (draft: Partial<PostDraft>) => void;
  onClear: () => void;
  storageKey?: string;
  hasUnsavedChanges: boolean;
}

export function DraftManager({ 
  currentDraft, 
  onRestore, 
  onClear, 
  storageKey = 'iter_sync_post_draft',
  hasUnsavedChanges
}: DraftManagerProps) {
  const [savedDraft, setSavedDraft] = useState<Partial<PostDraft> | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Load draft on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.content || parsed.title) {
          setSavedDraft(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
  }, [storageKey]);

  // Auto-save when current draft changes
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timeout = setTimeout(() => {
      try {
        if (currentDraft.content || currentDraft.title) {
          localStorage.setItem(storageKey, JSON.stringify({
            ...currentDraft,
            updatedAt: new Date().toISOString()
          }));
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch (e) {
        console.error('Failed to save draft:', e);
      }
    }, 1000); // Debounce save by 1 second

    return () => clearTimeout(timeout);
  }, [currentDraft, hasUnsavedChanges, storageKey]);

  if (!savedDraft || dismissed || (currentDraft.content === savedDraft.content && currentDraft.title === savedDraft.title)) {
    return null;
  }

  const handleRestore = () => {
    onRestore(savedDraft);
    setDismissed(true);
  };

  const handleDiscard = () => {
    localStorage.removeItem(storageKey);
    setSavedDraft(null);
    onClear();
  };

  return (
    <div className="mb-4 bg-primary/5 border border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h5 className="text-sm font-medium flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-primary" />
          Unsaved Draft Found
        </h5>
        <p className="text-xs text-muted-foreground mt-1">
          You have an unsaved draft from {savedDraft.updatedAt ? new Date(savedDraft.updatedAt).toLocaleString() : 'a previous session'}.
        </p>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button size="sm" variant="outline" onClick={handleDiscard} className="flex-1 sm:flex-none">
          Discard
        </Button>
        <Button size="sm" onClick={handleRestore} className="flex-1 sm:flex-none">
          Restore Draft
        </Button>
      </div>
    </div>
  );
}
