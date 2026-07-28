import { mediaRepository } from '@/repositories/media.repository';

export class MediaService {
  async getClubMedia(clubId: string) {
    return mediaRepository.getClubMedia(clubId);
  }

  async uploadMedia(clubId: string, file: File, title: string, type: 'Image' | 'Video') {
    return mediaRepository.uploadMedia(clubId, file, title, type);
  }

  async deleteMedia(id: string) {
    return mediaRepository.deleteMedia(id);
  }
}

export const mediaService = new MediaService();
