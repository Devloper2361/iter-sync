import { dashboardRepository } from '@/repositories/dashboard.repository';
import { DashboardData } from '@/types/dashboard';

export class DashboardService {
  async fetchDashboard(userId: string): Promise<DashboardData> {
    if (!userId) throw new Error('User ID is required');
    return await dashboardRepository.getDashboardData(userId);
  }
}

export const dashboardService = new DashboardService();
