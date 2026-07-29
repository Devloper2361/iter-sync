import { StudyGroup, GroupMember, GroupResource, GroupTask, GroupEvent, Post } from '@/types/community';
import { mockStudyGroups, mockPosts, mockUsers } from '@/data/mock-community-db';
import { mockGroupMembers, mockGroupResources, mockGroupTasks, mockGroupEvents } from '@/data/mock-study-groups-db';

export class StudyGroupRepository {
  async getGroups(): Promise<StudyGroup[]> {
    await new Promise(r => setTimeout(r, 400));
    return [...mockStudyGroups];
  }

  async getGroupById(id: string): Promise<StudyGroup | undefined> {
    await new Promise(r => setTimeout(r, 200));
    return mockStudyGroups.find(g => g.id === id);
  }

  async getMembers(groupId: string): Promise<GroupMember[]> {
    await new Promise(r => setTimeout(r, 200));
    return mockGroupMembers[groupId] || [];
  }

  async getResources(groupId: string): Promise<GroupResource[]> {
    await new Promise(r => setTimeout(r, 200));
    return mockGroupResources[groupId] || [];
  }

  async getTasks(groupId: string): Promise<GroupTask[]> {
    await new Promise(r => setTimeout(r, 200));
    return mockGroupTasks[groupId] || [];
  }

  async getEvents(groupId: string): Promise<GroupEvent[]> {
    await new Promise(r => setTimeout(r, 200));
    return mockGroupEvents[groupId] || [];
  }
  
  async getPosts(groupId: string): Promise<Post[]> {
     await new Promise(r => setTimeout(r, 200));
     // For now just return some mock posts that aren't specifically filtered by group in DB
     return mockPosts.slice(0, 2);
  }

  async addResource(resourceData: Omit<GroupResource, 'id' | 'createdAt'>): Promise<GroupResource> {
    await new Promise(r => setTimeout(r, 200));
    const newResource: GroupResource = {
      ...resourceData,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (!mockGroupResources[resourceData.groupId]) {
      mockGroupResources[resourceData.groupId] = [];
    }
    mockGroupResources[resourceData.groupId].unshift(newResource);
    return newResource;
  }

  async deleteResource(groupId: string, resourceId: string): Promise<void> {
    await new Promise(r => setTimeout(r, 200));
    if (mockGroupResources[groupId]) {
      mockGroupResources[groupId] = mockGroupResources[groupId].filter(r => r.id !== resourceId);
    }
  }

  async addTask(taskData: Omit<GroupTask, 'id' | 'createdAt' | 'creator'> & { creatorId: string }): Promise<GroupTask> {
    await new Promise(r => setTimeout(r, 200));
    const creator = mockUsers[taskData.creatorId] || { id: taskData.creatorId, name: 'Current User', avatarUrl: '', headline: '' };
    const newTask: GroupTask = {
      ...taskData,
      creator,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (!mockGroupTasks[taskData.groupId]) {
      mockGroupTasks[taskData.groupId] = [];
    }
    mockGroupTasks[taskData.groupId].unshift(newTask);
    return newTask;
  }

  async updateTask(groupId: string, taskId: string, updates: Partial<GroupTask>): Promise<GroupTask> {
    await new Promise(r => setTimeout(r, 200));
    const tasks = mockGroupTasks[groupId] || [];
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = { ...tasks[index], ...updates };
    return tasks[index];
  }

  async deleteTask(groupId: string, taskId: string): Promise<void> {
    await new Promise(r => setTimeout(r, 200));
    if (mockGroupTasks[groupId]) {
      mockGroupTasks[groupId] = mockGroupTasks[groupId].filter(t => t.id !== taskId);
    }
  }

  async addEvent(eventData: Omit<GroupEvent, 'id' | 'creator' | 'isJoinedByMe'> & { creatorId: string }): Promise<GroupEvent> {
    await new Promise(r => setTimeout(r, 200));
    const creator = mockUsers[eventData.creatorId] || { id: eventData.creatorId, name: 'Current User', avatarUrl: '', headline: '' };
    const newEvent: GroupEvent = {
      ...eventData,
      creator,
      id: `ev-${Date.now()}`,
      isJoinedByMe: true,
    };
    if (!mockGroupEvents[eventData.groupId]) {
      mockGroupEvents[eventData.groupId] = [];
    }
    mockGroupEvents[eventData.groupId].push(newEvent);
    mockGroupEvents[eventData.groupId].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    return newEvent;
  }

  async updateEvent(groupId: string, eventId: string, updates: Partial<GroupEvent>): Promise<GroupEvent> {
    await new Promise(r => setTimeout(r, 200));
    const events = mockGroupEvents[groupId] || [];
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) throw new Error('Event not found');
    
    events[index] = { ...events[index], ...updates };
    return events[index];
  }

  async deleteEvent(groupId: string, eventId: string): Promise<void> {
    await new Promise(r => setTimeout(r, 200));
    if (mockGroupEvents[groupId]) {
      mockGroupEvents[groupId] = mockGroupEvents[groupId].filter(e => e.id !== eventId);
    }
  }

  async addMembers(groupId: string, userIds: string[]): Promise<GroupMember[]> {
    await new Promise(r => setTimeout(r, 200));
    const newMembers: GroupMember[] = userIds.map(userId => ({
      id: `gm-${Date.now()}-${userId}`,
      groupId,
      author: mockUsers[userId] || { id: userId, name: 'Unknown User', avatarUrl: '', headline: '' },
      role: 'Member',
      joinedAt: new Date().toISOString()
    }));
    
    if (!mockGroupMembers[groupId]) {
      mockGroupMembers[groupId] = [];
    }
    mockGroupMembers[groupId].push(...newMembers);
    return newMembers;
  }

  async updateMemberRole(groupId: string, memberId: string, newRole: 'Admin' | 'Member' | 'Owner'): Promise<GroupMember> {
    await new Promise(r => setTimeout(r, 200));
    const members = mockGroupMembers[groupId] || [];
    const index = members.findIndex(m => m.id === memberId);
    if (index === -1) throw new Error('Member not found');
    
    // If making someone Owner, change current Owner to Admin (optional logic, but typically needed)
    if (newRole === 'Owner') {
      const currentOwnerIndex = members.findIndex(m => m.role === 'Owner');
      if (currentOwnerIndex !== -1) {
        members[currentOwnerIndex].role = 'Admin';
      }
    }

    members[index].role = newRole;
    return members[index];
  }

  async removeMember(groupId: string, memberId: string): Promise<void> {
    await new Promise(r => setTimeout(r, 200));
    if (mockGroupMembers[groupId]) {
      mockGroupMembers[groupId] = mockGroupMembers[groupId].filter(m => m.id !== memberId);
    }
  }

  async createGroup(groupData: Omit<StudyGroup, 'id' | 'createdAt' | 'membersCount'> & { initialMembers: string[] }): Promise<StudyGroup> {
    await new Promise(r => setTimeout(r, 600));
    
    const newGroup: StudyGroup = {
      ...groupData,
      id: `sg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      membersCount: groupData.initialMembers.length + 1, // +1 for creator
      isJoinedByMe: true,
      lastActivity: new Date().toISOString(),
      unreadCount: 0,
    };
    
    // Add to mock db
    mockStudyGroups.unshift(newGroup);
    
    return newGroup;
  }
}

export const studyGroupRepository = new StudyGroupRepository();
