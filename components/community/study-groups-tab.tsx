import { useState } from 'react';
import { useStudyGroups } from '@/hooks/use-study-groups';
import { GroupCard } from './group-card';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CreateGroupDialog } from './study-groups/create-group-dialog';

export function StudyGroupsTab() {
  const { data: groups, isLoading } = useStudyGroups();
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const filteredGroups = groups?.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    group.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search groups..." 
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <CreateGroupDialog />
      </div>

      <div className="bg-card rounded-xl border shadow-sm divide-y">
        {filteredGroups && filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            No study groups found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
