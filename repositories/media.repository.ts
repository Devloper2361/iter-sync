import { ClubMedia } from '@/types/community';
import { mockClubMedia } from '@/data/mock-clubs-db';
import { mockUsers } from '@/data/mock-community-db';

export class MediaRepository {
  async getClubMedia(clubId: string): Promise<ClubMedia[]> {
    await new Promise(r => setTimeout(r, 300));
    return mockClubMedia[clubId] || [];
  }

  async uploadMedia(clubId: string, file: File, title: string, type: 'Image' | 'Video'): Promise<ClubMedia> {
    await new Promise(r => setTimeout(r, 800));
    const newMedia: ClubMedia = {
      id: `med${Date.now()}`,
      clubId,
      uploader: mockUsers['u1'], // Using current user mock
      url: URL.createObjectURL(file), // Mock URL
      type,
      title,
      createdAt: new Date().toISOString(),
    };
    if (!mockClubMedia[clubId]) {
      mockClubMedia[clubId] = [];
    }
    mockClubMedia[clubId].unshift(newMedia);
    return newMedia;
  }

  async deleteMedia(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    for (const clubId in mockClubMedia) {
      const index = mockClubMedia[clubId].findIndex(m => m.id === id);
      if (index !== -1) {
        mockClubMedia[clubId].splice(index, 1);
        return;
      }
    }
  }
}

export const mediaRepository = new MediaRepository();
