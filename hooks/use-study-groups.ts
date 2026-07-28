import { useQuery } from '@tanstack/react-query';
import { studyGroupService } from '@/services/study-group.service';

export function useStudyGroups() {
  return useQuery({
    queryKey: ['study-groups'],
    queryFn: () => studyGroupService.getGroups(),
  });
}

export function useStudyGroup(id: string) {
  return useQuery({
    queryKey: ['study-group', id],
    queryFn: () => studyGroupService.getGroup(id),
    enabled: !!id,
  });
}
