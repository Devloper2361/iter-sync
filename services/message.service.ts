import { GroupMessage, Attachment } from '@/types/community';
import { messageRepository } from '@/repositories/message.repository';

export class MessageService {
  async getMessages(groupId: string): Promise<GroupMessage[]> {
    return messageRepository.getMessages(groupId);
  }

  async sendMessage(groupId: string, message: Omit<GroupMessage, 'id' | 'createdAt'>): Promise<GroupMessage> {
    return messageRepository.sendMessage(groupId, message);
  }

  async uploadAttachment(file: File): Promise<Attachment> {
    return messageRepository.uploadAttachment(file);
  }
}

export const messageService = new MessageService();
