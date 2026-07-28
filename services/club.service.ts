import { clubRepository } from '@/repositories/club.repository';

export class ClubService {
  async getClubs() {
    return clubRepository.getClubs();
  }

  async getClubById(id: string) {
    return clubRepository.getClubById(id);
  }

  async getClubMembers(clubId: string) {
    return clubRepository.getClubMembers(clubId);
  }

  async getClubEvents(clubId: string) {
    return clubRepository.getClubEvents(clubId);
  }

  async getClubMedia(clubId: string) {
    return clubRepository.getClubMedia(clubId);
  }

  async getClubPosts(clubId: string) {
    return clubRepository.getClubPosts(clubId);
  }
}

export const clubService = new ClubService();
