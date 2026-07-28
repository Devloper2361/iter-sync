import { Club, ClubMember, ClubEvent, ClubMedia, Post } from '@/types/community';
import { mockClubs } from '@/data/mock-community-db';
import { mockClubMembers, mockClubEvents, mockClubMedia, mockClubPosts } from '@/data/mock-clubs-db';

export class ClubRepository {
  async getClubs(): Promise<Club[]> {
    await new Promise(r => setTimeout(r, 400));
    return [...mockClubs];
  }

  async getClubById(id: string): Promise<Club | undefined> {
    await new Promise(r => setTimeout(r, 200));
    return mockClubs.find(c => c.id === id);
  }

  async getClubMembers(clubId: string): Promise<ClubMember[]> {
    await new Promise(r => setTimeout(r, 300));
    return mockClubMembers[clubId] || [];
  }

  async getClubEvents(clubId: string): Promise<ClubEvent[]> {
    await new Promise(r => setTimeout(r, 300));
    return mockClubEvents[clubId] || [];
  }

  async getClubMedia(clubId: string): Promise<ClubMedia[]> {
    await new Promise(r => setTimeout(r, 300));
    return mockClubMedia[clubId] || [];
  }

  async getClubPosts(clubId: string): Promise<Post[]> {
    await new Promise(r => setTimeout(r, 300));
    return mockClubPosts[clubId] || [];
  }
}

export const clubRepository = new ClubRepository();
