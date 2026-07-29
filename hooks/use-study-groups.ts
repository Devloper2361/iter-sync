import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studyGroupService } from '@/services/study-group.service';
import { getSocket } from '@/lib/socket';
import { StudyGroup, GroupResource, GroupTask, GroupEvent } from '@/types/community';

export function useStudyGroups() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const handleGroupCreated = (data: any) => {
      queryClient.setQueryData<StudyGroup[]>(['study-groups'], (old) => {
        if (!old) return [data.group];
        if (old.some(g => g.id === data.group.id)) return old;
        return [data.group, ...old];
      });
    };

    socket.on('StudyGroupCreated', handleGroupCreated);

    return () => {
      socket.off('StudyGroupCreated', handleGroupCreated);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['study-groups'],
    queryFn: () => studyGroupService.getGroups(),
  });
}

export function useStudyGroup(id: string) {
  return useQuery({
    queryKey: ['study-group', id],
    queryFn: () => studyGroupService.getGroupById(id),
    enabled: !!id,
  });
}

export function useCreateStudyGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupData: Omit<StudyGroup, 'id' | 'createdAt' | 'membersCount'> & { initialMembers: string[] }) =>
      studyGroupService.createGroup(groupData),
    onSuccess: (newGroup) => {
      // Optimistic update
      queryClient.setQueryData<StudyGroup[]>(['study-groups'], (old) => {
        if (!old) return [newGroup];
        return [newGroup, ...old];
      });
      
      const socket = getSocket();
      socket.emit('createGroup', { group: newGroup });
    },
  });
}

export function useGroupMembers(groupId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!groupId) return;
    const socket = getSocket();

    const handleMemberJoined = (data: any) => {
      queryClient.setQueryData(['study-group-members', groupId], (old: any) => {
        if (!old) return [data.member];
        if (old.some((m: any) => m.id === data.member.id)) return old;
        return [...old, data.member];
      });
    };

    const handleMemberLeft = (data: any) => {
      queryClient.setQueryData(['study-group-members', groupId], (old: any) => {
        if (!old) return [];
        return old.filter((m: any) => m.id !== data.memberId);
      });
    };

    socket.on('MemberJoined', handleMemberJoined);
    socket.on('MemberLeft', handleMemberLeft);

    return () => {
      socket.off('MemberJoined', handleMemberJoined);
      socket.off('MemberLeft', handleMemberLeft);
    };
  }, [groupId, queryClient]);

  return useQuery({
    queryKey: ['study-group-members', groupId],
    queryFn: () => studyGroupService.getMembers(groupId),
    enabled: !!groupId,
    staleTime: Infinity,
  });
}

export function useGroupResources(groupId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!groupId) return;
    const socket = getSocket();

    const handleResourceUploaded = (data: any) => {
      queryClient.setQueryData(['study-group-resources', groupId], (old: any) => {
        if (!old) return [data.resource];
        if (old.some((r: any) => r.id === data.resource.id)) return old;
        return [data.resource, ...old]; // Newest first
      });
    };

    socket.on('ResourceUploaded', handleResourceUploaded);

    return () => {
      socket.off('ResourceUploaded', handleResourceUploaded);
    };
  }, [groupId, queryClient]);

  return useQuery({
    queryKey: ['study-group-resources', groupId],
    queryFn: () => studyGroupService.getResources(groupId),
    enabled: !!groupId,
    staleTime: Infinity,
  });
}

export function useGroupTasks(groupId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!groupId) return;
    const socket = getSocket();

    const handleTaskCreated = (data: any) => {
      queryClient.setQueryData(['study-group-tasks', groupId], (old: any) => {
        if (!old) return [data.task];
        if (old.some((t: any) => t.id === data.task.id)) return old;
        return [data.task, ...old];
      });
    };

    socket.on('TaskCreated', handleTaskCreated);

    return () => {
      socket.off('TaskCreated', handleTaskCreated);
    };
  }, [groupId, queryClient]);

  return useQuery({
    queryKey: ['study-group-tasks', groupId],
    queryFn: () => studyGroupService.getTasks(groupId),
    enabled: !!groupId,
    staleTime: Infinity,
  });
}

export function useGroupEvents(groupId: string) {
  return useQuery({
    queryKey: ['study-group-events', groupId],
    queryFn: () => studyGroupService.getEvents(groupId),
    enabled: !!groupId,
  });
}

export function useAddGroupEvent(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData: Omit<GroupEvent, 'id' | 'creator' | 'isJoinedByMe'> & { creatorId?: string }) =>
      studyGroupService.addEvent({
        ...eventData,
        creatorId: eventData.creatorId || 'u1',
      }),
    onSuccess: (newEvent) => {
      queryClient.setQueryData(['study-group-events', groupId], (old: any) => {
        if (!old) return [newEvent];
        return [...old, newEvent].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      });
    },
  });
}

export function useUpdateGroupEvent(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, updates }: { eventId: string, updates: Partial<GroupEvent> }) =>
      studyGroupService.updateEvent(groupId, eventId, updates),
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(['study-group-events', groupId], (old: any) => {
        if (!old) return [];
        return old.map((e: any) => e.id === updatedEvent.id ? updatedEvent : e);
      });
    },
  });
}

export function useDeleteGroupEvent(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) =>
      studyGroupService.deleteEvent(groupId, eventId),
    onSuccess: (_, eventId) => {
      queryClient.setQueryData(['study-group-events', groupId], (old: any) => {
        if (!old) return [];
        return old.filter((e: any) => e.id !== eventId);
      });
    },
  });
}

export function useAddGroupMembers(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: string[]) =>
      studyGroupService.addMembers(groupId, userIds),
    onSuccess: (newMembers) => {
      queryClient.setQueryData(['study-group-members', groupId], (old: any) => {
        if (!old) return newMembers;
        return [...old, ...newMembers];
      });
    },
  });
}

export function useUpdateMemberRole(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string, role: 'Admin' | 'Member' | 'Owner' }) =>
      studyGroupService.updateMemberRole(groupId, memberId, role),
    onSuccess: (updatedMember) => {
      queryClient.setQueryData(['study-group-members', groupId], (old: any) => {
        if (!old) return [];
        let newMembers = old.map((m: any) => m.id === updatedMember.id ? updatedMember : m);
        // If owner changed, we need to downgrade the previous owner locally too, or rely on refetch.
        // For simplicity, we can invalidate to refetch if Owner changed
        if (updatedMember.role === 'Owner') {
          queryClient.invalidateQueries({ queryKey: ['study-group-members', groupId] });
        }
        return newMembers;
      });
    },
  });
}

export function useRemoveGroupMember(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) =>
      studyGroupService.removeMember(groupId, memberId),
    onSuccess: (_, memberId) => {
      queryClient.setQueryData(['study-group-members', groupId], (old: any) => {
        if (!old) return [];
        return old.filter((m: any) => m.id !== memberId);
      });
    },
  });
}

export function useGroupPosts(groupId: string) {
  return useQuery({
    queryKey: ['study-group-posts', groupId],
    queryFn: () => studyGroupService.getPosts(groupId),
    enabled: !!groupId,
  });
}

export function useAddGroupResource(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceData: Omit<GroupResource, 'id' | 'createdAt'>) =>
      studyGroupService.addResource(resourceData),
    onSuccess: (newResource) => {
      queryClient.setQueryData(['study-group-resources', groupId], (old: any) => {
        if (!old) return [newResource];
        return [newResource, ...old];
      });
    },
  });
}

export function useDeleteGroupResource(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: string) =>
      studyGroupService.deleteResource(groupId, resourceId),
    onSuccess: (_, resourceId) => {
      queryClient.setQueryData(['study-group-resources', groupId], (old: any) => {
        if (!old) return [];
        return old.filter((r: any) => r.id !== resourceId);
      });
    },
  });
}

export function useAddGroupTask(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: Omit<GroupTask, 'id' | 'createdAt' | 'creator'> & { creatorId?: string }) =>
      studyGroupService.addTask({
        ...taskData,
        creatorId: taskData.creatorId || 'u1',
      }),
    onSuccess: (newTask) => {
      queryClient.setQueryData(['study-group-tasks', groupId], (old: any) => {
        if (!old) return [newTask];
        return [newTask, ...old];
      });
      const socket = getSocket();
      socket.emit('TaskCreated', { task: newTask });
    },
  });
}

export function useUpdateGroupTask(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string, updates: Partial<GroupTask> }) =>
      studyGroupService.updateTask(groupId, taskId, updates),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(['study-group-tasks', groupId], (old: any) => {
        if (!old) return [];
        return old.map((t: any) => t.id === updatedTask.id ? updatedTask : t);
      });
    },
  });
}

export function useDeleteGroupTask(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) =>
      studyGroupService.deleteTask(groupId, taskId),
    onSuccess: (_, taskId) => {
      queryClient.setQueryData(['study-group-tasks', groupId], (old: any) => {
        if (!old) return [];
        return old.filter((t: any) => t.id !== taskId);
      });
    },
  });
}
