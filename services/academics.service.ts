import { academicsRepository } from '@/repositories/academics.repository';
import { AcademicsData } from '@/types/academics';

export class AcademicsService {
  async fetchAcademics(userId: string): Promise<AcademicsData> {
    if (!userId) throw new Error('User ID is required');
    return await academicsRepository.getAcademicsData(userId);
  }
}

export const academicsService = new AcademicsService();
