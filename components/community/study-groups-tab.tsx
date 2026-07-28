import { useStudyGroups } from '@/hooks/use-study-groups';
import { GroupCard } from './group-card';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StudyGroupsTab() {
  const { data: groups, isLoading } = useStudyGroups();

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Study Groups</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups?.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
