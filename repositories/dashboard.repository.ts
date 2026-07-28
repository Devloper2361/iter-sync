import { DashboardData } from '@/types/dashboard';
import { mockDashboardData } from '@/data/mock-dashboard-db';

export interface IDashboardRepository {
  getDashboardData(userId: string): Promise<DashboardData>;
}

export class MockDashboardRepository implements IDashboardRepository {
  async getDashboardData(userId: string): Promise<DashboardData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDashboardData;
  }
}

export const dashboardRepository = new MockDashboardRepository();
