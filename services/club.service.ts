import { clubRepository } from '@/repositories/club.repository';

export class ClubService {
  getClubs() {
    return clubRepository.getClubs();
  }
  getClub(id: string) {
    return clubRepository.getClubById(id);
  }
}
export const clubService = new ClubService();
