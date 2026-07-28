import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';

export function useNotifications() {
  return useQuery({
    queryKey: ['community-notifications'],
    queryFn: () => notificationService.getNotifications(),
  });
}
