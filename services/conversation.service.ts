import { conversationRepository } from '@/repositories/conversation.repository';
import { DirectConversation } from '@/types/community';

export class ConversationService {
  async findDirectConversation(userId1: string, userId2: string): Promise<DirectConversation | null> {
    return conversationRepository.findDirectConversation(userId1, userId2);
  }

  async createDirectConversation(userId1: string, userId2: string): Promise<DirectConversation> {
    return conversationRepository.createDirectConversation(userId1, userId2);
  }
}

export const conversationService = new ConversationService();
