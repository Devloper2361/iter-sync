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
    queryKey: ['clubs', id],
    queryFn: () => clubService.getClubById(id),
    enabled: !!id,
  });
}

export function useClubMembers(clubId: string) {
  return useQuery({
    queryKey: ['clubs', clubId, 'members'],
    queryFn: () => clubService.getClubMembers(clubId),
    enabled: !!clubId,
  });
}



export function useClubPosts(clubId: string) {
  return useQuery({
    queryKey: ['clubs', clubId, 'posts'],
    queryFn: () => clubService.getClubPosts(clubId),
    enabled: !!clubId,
  });
}
