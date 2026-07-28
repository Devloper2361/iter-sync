import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studyGroupService } from '@/services/study-group.service';
import { getSocket } from '@/lib/socket';
import { StudyGroup } from '@/types/community';

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

export function useGroupPosts(groupId: string) {
  return useQuery({
    queryKey: ['study-group-posts', groupId],
    queryFn: () => studyGroupService.getPosts(groupId),
    enabled: !!groupId,
  });
}
