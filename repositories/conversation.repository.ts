import { DirectConversation } from '@/types/community';

const mockConversations: DirectConversation[] = [];

export class ConversationRepository {
  async findDirectConversation(userId1: string, userId2: string): Promise<DirectConversation | null> {
    await new Promise(r => setTimeout(r, 200));
    const conv = mockConversations.find(c => 
      c.participants.includes(userId1) && 
      c.participants.includes(userId2) &&
      c.participants.length === 2
    );
    return conv || null;
  }

  async createDirectConversation(userId1: string, userId2: string): Promise<DirectConversation> {
    await new Promise(r => setTimeout(r, 200));
    const newConv: DirectConversation = {
      id: `conv_${Date.now()}`,
      participants: [userId1, userId2],
    };
    mockConversations.push(newConv);
    return newConv;
  }
}

export const conversationRepository = new ConversationRepository();
