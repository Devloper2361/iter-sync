import { useQuery } from '@tanstack/react-query';
import { clubService } from '@/services/club.service';

export function useClubs() {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: () => clubService.getClubs(),
  });
}

export function useClub(id: string) {
  return useQuery({
    queryKey: ['club', id],
    queryFn: () => clubService.getClub(id),
    enabled: !!id,
  });
}
