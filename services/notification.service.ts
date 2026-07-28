import { notificationRepository } from '@/repositories/notification.repository';

export class NotificationService {
  getNotifications() {
    return notificationRepository.getNotifications();
  }
}
export const notificationService = new NotificationService();
