import { studyGroupRepository } from '@/repositories/study-group.repository';
import { StudyGroup, GroupMember, GroupResource, GroupTask, GroupEvent, Post } from '@/types/community';

export class StudyGroupService {
  async getGroups(): Promise<StudyGroup[]> {
    return studyGroupRepository.getGroups();
  }

  async getGroupById(id: string): Promise<StudyGroup | undefined> {
    return studyGroupRepository.getGroupById(id);
  }

  async getMembers(groupId: string): Promise<GroupMember[]> {
    return studyGroupRepository.getMembers(groupId);
  }

  async getResources(groupId: string): Promise<GroupResource[]> {
    return studyGroupRepository.getResources(groupId);
  }

  async getTasks(groupId: string): Promise<GroupTask[]> {
    return studyGroupRepository.getTasks(groupId);
  }

  async getEvents(groupId: string): Promise<GroupEvent[]> {
    return studyGroupRepository.getEvents(groupId);
  }
  
  async getPosts(groupId: string): Promise<Post[]> {
    return studyGroupRepository.getPosts(groupId);
  }

  async addResource(resourceData: Omit<GroupResource, 'id' | 'createdAt'>): Promise<GroupResource> {
    return studyGroupRepository.addResource(resourceData);
  }

  async deleteResource(groupId: string, resourceId: string): Promise<void> {
    return studyGroupRepository.deleteResource(groupId, resourceId);
  }

  async addTask(taskData: Omit<GroupTask, 'id' | 'createdAt' | 'creator'> & { creatorId: string }): Promise<GroupTask> {
    return studyGroupRepository.addTask(taskData);
  }

  async updateTask(groupId: string, taskId: string, updates: Partial<GroupTask>): Promise<GroupTask> {
    return studyGroupRepository.updateTask(groupId, taskId, updates);
  }

  async deleteTask(groupId: string, taskId: string): Promise<void> {
    return studyGroupRepository.deleteTask(groupId, taskId);
  }

  async addEvent(eventData: Omit<GroupEvent, 'id' | 'creator' | 'isJoinedByMe'> & { creatorId: string }): Promise<GroupEvent> {
    return studyGroupRepository.addEvent(eventData);
  }

  async updateEvent(groupId: string, eventId: string, updates: Partial<GroupEvent>): Promise<GroupEvent> {
    return studyGroupRepository.updateEvent(groupId, eventId, updates);
  }

  async deleteEvent(groupId: string, eventId: string): Promise<void> {
    return studyGroupRepository.deleteEvent(groupId, eventId);
  }

  async addMembers(groupId: string, userIds: string[]): Promise<GroupMember[]> {
    return studyGroupRepository.addMembers(groupId, userIds);
  }

  async updateMemberRole(groupId: string, memberId: string, role: 'Admin' | 'Member' | 'Owner'): Promise<GroupMember> {
    return studyGroupRepository.updateMemberRole(groupId, memberId, role);
  }

  async removeMember(groupId: string, memberId: string): Promise<void> {
    return studyGroupRepository.removeMember(groupId, memberId);
  }

  async createGroup(groupData: Omit<StudyGroup, 'id' | 'createdAt' | 'membersCount'> & { initialMembers: string[] }): Promise<StudyGroup> {
    return studyGroupRepository.createGroup(groupData);
  }
}

export const studyGroupService = new StudyGroupService();
