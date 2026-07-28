import { StudyGroup } from '@/types/community';
import { mockStudyGroups } from '@/data/mock-community-db';

export class StudyGroupRepository {
  async getGroups(): Promise<StudyGroup[]> {
    await new Promise(r => setTimeout(r, 400));
    return [...mockStudyGroups];
  }
  async getGroupById(id: string): Promise<StudyGroup | undefined> {
    await new Promise(r => setTimeout(r, 200));
    return mockStudyGroups.find(g => g.id === id);
  }
}
export const studyGroupRepository = new StudyGroupRepository();
