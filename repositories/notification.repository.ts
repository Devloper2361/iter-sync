import { CommunityNotification } from '@/types/community';
import { mockNotifications } from '@/data/mock-community-db';

export class NotificationRepository {
  async getNotifications(): Promise<CommunityNotification[]> {
    await new Promise(r => setTimeout(r, 200));
    return [...mockNotifications];
  }
}
export const notificationRepository = new NotificationRepository();
