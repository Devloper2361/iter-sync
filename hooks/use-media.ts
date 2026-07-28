import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaService } from '@/services/media.service';
import { ClubMedia } from '@/types/community';

export function useClubMedia(clubId: string) {
  return useQuery({
    queryKey: ['clubs', clubId, 'media'],
    queryFn: () => mediaService.getClubMedia(clubId),
    enabled: !!clubId,
  });
}

export function useUploadMedia(clubId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, title, type }: { file: File; title: string; type: 'Image' | 'Video' }) => mediaService.uploadMedia(clubId, file, title, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', clubId, 'media'] });
    },
  });
}

export function useDeleteMedia(clubId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mediaService.deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', clubId, 'media'] });
    },
  });
}
