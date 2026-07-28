import { AcademicsData } from '@/types/academics';
import { mockAcademicsData } from '@/data/mock-academics-db';

export interface IAcademicsRepository {
  getAcademicsData(userId: string): Promise<AcademicsData>;
}

export class MockAcademicsRepository implements IAcademicsRepository {
  async getAcademicsData(userId: string): Promise<AcademicsData> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockAcademicsData;
  }
}

export const academicsRepository = new MockAcademicsRepository();
