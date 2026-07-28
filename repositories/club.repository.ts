import { Club } from '@/types/community';
import { mockClubs } from '@/data/mock-community-db';

export class ClubRepository {
  async getClubs(): Promise<Club[]> {
    await new Promise(r => setTimeout(r, 400));
    return [...mockClubs];
  }
  async getClubById(id: string): Promise<Club | undefined> {
    await new Promise(r => setTimeout(r, 200));
    return mockClubs.find(c => c.id === id);
  }
}
export const clubRepository = new ClubRepository();
