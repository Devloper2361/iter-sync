import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '@/services/message.service';
import { GroupMessage, Attachment } from '@/types/community';
import { getSocket } from '@/lib/socket';

export function useUploadAttachment() {
  return useMutation({
    mutationFn: (file: File) => messageService.uploadAttachment(file),
  });
}

export function useMessages(groupId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!groupId) return;

    const socket = getSocket();
    socket.emit('joinGroup', groupId);

    const handleMessageCreated = (newMessage: GroupMessage) => {
      queryClient.setQueryData<GroupMessage[]>(['group-messages', groupId], (old) => {
        if (!old) return [newMessage];
        // Check if message already exists (optimistic UI)
        if (old.some((m) => m.id === newMessage.id)) return old;
        return [...old, newMessage];
      });
    };

    socket.on('MessageCreated', handleMessageCreated);

    return () => {
      socket.off('MessageCreated', handleMessageCreated);
      socket.emit('leaveGroup', groupId);
    };
  }, [groupId, queryClient]);

  return useQuery({
    queryKey: ['group-messages', groupId],
    queryFn: () => messageService.getMessages(groupId),
    enabled: !!groupId,
    staleTime: Infinity, // Rely on socket updates
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
    
  return useMutation({
    mutationFn: ({ groupId, message }: { groupId: string, message: Omit<GroupMessage, 'id' | 'createdAt'> }) => 
      messageService.sendMessage(groupId, message),
    onMutate: async ({ groupId, message }) => {
      await queryClient.cancelQueries({ queryKey: ['group-messages', groupId] });
      const previousMessages = queryClient.getQueryData<GroupMessage[]>(['group-messages', groupId]);

      // Optimistic message
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: GroupMessage = {
        ...message,
        id: tempId,
        createdAt: new Date().toISOString(),
        reactions: {},
        status: 'sending',
      };

      queryClient.setQueryData<GroupMessage[]>(['group-messages', groupId], (old) => {
        if (!old) return [optimisticMessage];
        return [...old, optimisticMessage];
      });

      return { previousMessages, tempId };
    },
    onSuccess: (newMessage, variables, context) => {
      // Mocking network delay to show 'sending' -> 'sent' -> 'delivered'
      const finalMessage = { ...newMessage, status: 'sent' as const };
      
      queryClient.setQueryData<GroupMessage[]>(['group-messages', variables.groupId], (old) => {
        if (!old) return [finalMessage];
        return old.map((m) => m.id === context?.tempId ? finalMessage : m);
      });
      
      const socket = getSocket();
      socket.emit('sendMessage', { groupId: variables.groupId, message: finalMessage });

      // Simulate 'delivered' and 'read'
      setTimeout(() => {
        queryClient.setQueryData<GroupMessage[]>(['group-messages', variables.groupId], (old) => {
          if (!old) return old;
          return old.map((m) => m.id === finalMessage.id ? { ...m, status: 'delivered' } : m);
        });
      }, 1500);

      setTimeout(() => {
        queryClient.setQueryData<GroupMessage[]>(['group-messages', variables.groupId], (old) => {
          if (!old) return old;
          return old.map((m) => m.id === finalMessage.id ? { ...m, status: 'read' } : m);
        });
      }, 3500);
    },
    onError: (err, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['group-messages', variables.groupId], context.previousMessages);
      }
    },
  });
}
