import { studyGroupRepository } from '@/repositories/study-group.repository';

export class StudyGroupService {
  getGroups() {
    return studyGroupRepository.getGroups();
  }
  getGroup(id: string) {
    return studyGroupRepository.getGroupById(id);
  }
}
export const studyGroupService = new StudyGroupService();
