import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { useAuth } from '@/hooks/use-auth';

export function useDashboardData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboardData', user?.id],
    queryFn: () => dashboardService.fetchDashboard(user!.id),
    enabled: !!user?.id,
  });
}
