import { useQuery } from '@tanstack/react-query';
import { academicsService } from '@/services/academics.service';
import { useAuth } from '@/hooks/use-auth';

export function useAcademicsData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['academicsData', user?.id],
    queryFn: () => academicsService.fetchAcademics(user!.id),
    enabled: !!user?.id,
  });
}
