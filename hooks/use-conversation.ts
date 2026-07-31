import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '@/services/conversation.service';
import { DirectConversation } from '@/types/community';

export function useDirectConversation() {
  return useMutation({
    mutationFn: async ({ currentUserId, sellerId }: { currentUserId: string, sellerId: string }) => {
      const existing = await conversationService.findDirectConversation(currentUserId, sellerId);
      if (existing) {
        return existing;
      }
      return conversationService.createDirectConversation(currentUserId, sellerId);
    },
  });
}
