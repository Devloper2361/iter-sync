import { useQuery } from '@tanstack/react-query';
import { communityService } from '@/services/community.service';

export function useCommunityFeed() {
  return useQuery({
    queryKey: ['community-feed'],
    queryFn: () => communityService.getPosts(),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => communityService.getPost(id),
    enabled: !!id,
  });
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => communityService.getComments(postId),
    enabled: !!postId,
  });
}
