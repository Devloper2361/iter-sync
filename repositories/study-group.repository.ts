import { StudyGroup, GroupMember, GroupResource, GroupTask, GroupEvent, Post } from '@/types/community';
import { mockStudyGroups, mockPosts } from '@/data/mock-community-db';
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
