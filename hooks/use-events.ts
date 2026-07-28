import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/event.service';
import { ClubEvent } from '@/types/community';

export function useClubEvents(clubId: string) {
  return useQuery({
    queryKey: ['clubs', clubId, 'events'],
    queryFn: () => eventService.getClubEvents(clubId),
    enabled: !!clubId,
  });
}

export function useCreateEvent(clubId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event: Omit<ClubEvent, 'id' | 'rsvpCount'>) => eventService.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', clubId, 'events'] });
    },
  });
}

export function useUpdateEvent(clubId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ClubEvent> }) => eventService.updateEvent(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', clubId, 'events'] });
    },
  });
}

export function useDeleteEvent(clubId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', clubId, 'events'] });
    },
  });
}

export function useRsvpEvent(clubId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventService.rsvpEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', clubId, 'events'] });
    },
  });
}

export function useCancelRsvpEvent(clubId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventService.cancelRsvp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', clubId, 'events'] });
    },
  });
}
