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

  async createGroup(groupData: Omit<StudyGroup, 'id' | 'createdAt' | 'membersCount'> & { initialMembers: string[] }): Promise<StudyGroup> {
    return studyGroupRepository.createGroup(groupData);
  }
}

export const studyGroupService = new StudyGroupService();
