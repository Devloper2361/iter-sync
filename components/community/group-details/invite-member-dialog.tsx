import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Search } from 'lucide-react';
import { mockUsers } from '@/data/mock-community-db';
import { useAddGroupMembers } from '@/hooks/use-study-groups';
import { toast } from 'sonner';

interface InviteMemberDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingMembers: any[];
}

export function InviteMemberDialog({ groupId, open, onOpenChange, existingMembers }: InviteMemberDialogProps) {
  const addMembers = useAddGroupMembers(groupId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Filter out existing members and apply search
  const availableUsers = Object.values(mockUsers).filter(u => 
    !existingMembers.find(m => m.author.id === u.id) &&
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleInvite = () => {
    if (selectedUserIds.length === 0) return;
    
    addMembers.mutate(selectedUserIds, {
      onSuccess: () => {
        toast.success(`Successfully invited ${selectedUserIds.length} members`);
        setSelectedUserIds([]);
        setSearchQuery('');
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Search and select users to invite to this study group.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              className="pl-9 bg-background/50" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <ScrollArea className="h-[200px] rounded-md border p-2">
            {availableUsers.length > 0 ? (
              <div className="space-y-1">
                {availableUsers.map(user => (
                  <div 
                    key={user.id} 
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedUserIds.includes(user.id) ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                    onClick={() => toggleSelect(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{user.role}</p>
                      </div>
                    </div>
                    {selectedUserIds.includes(user.id) && (
                      <Check className="h-4 w-4 text-primary mr-2" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No users found
              </div>
            )}
          </ScrollArea>
        </div>
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={handleInvite} disabled={selectedUserIds.length === 0 || addMembers.isPending}>
            {addMembers.isPending ? 'Inviting...' : `Invite ${selectedUserIds.length > 0 ? `(${selectedUserIds.length})` : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
