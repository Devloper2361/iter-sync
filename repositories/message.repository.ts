import { GroupMessage } from '@/types/community';
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
}

export const messageRepository = new MessageRepository();
