import { GroupMessage, Attachment } from '@/types/community';
import { mockGroupMessages } from '@/data/mock-study-groups-db';

export class MessageRepository {
  async getMessages(groupId: string): Promise<GroupMessage[]> {
    await new Promise(r => setTimeout(r, 200));
    return mockGroupMessages[groupId] || [];
  }

  async sendMessage(groupId: string, message: Omit<GroupMessage, 'id' | 'createdAt'>): Promise<GroupMessage> {
    await new Promise(r => setTimeout(r, 300));
    const newMessage: GroupMessage = {
      ...message,
      id: `m_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (!mockGroupMessages[groupId]) {
      mockGroupMessages[groupId] = [];
    }
    mockGroupMessages[groupId].push(newMessage);
    return newMessage;
  }

  async uploadAttachment(file: File): Promise<Attachment> {
    await new Promise(r => setTimeout(r, 500));
    return {
      id: `att_${Date.now()}`,
      name: file.name,
      size: (file.size / 1024 < 1024) 
        ? `${(file.size / 1024).toFixed(1)} KB` 
        : `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      url: URL.createObjectURL(file),
      type: file.type || 'application/octet-stream'
    };
  }
}

export const messageRepository = new MessageRepository();
