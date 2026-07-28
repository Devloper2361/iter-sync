const fs = require('fs');

const content = `import { communityRepository } from '@/repositories/community.repository';
import { Post, Comment, ReactionType } from '@/types/community';

export class CommunityService {
  getPosts() {
    return communityRepository.getPosts();
  }

  getPost(id: string) {
    return communityRepository.getPostById(id);
  }

  getComments(postId: string) {
    return communityRepository.getCommentsByPostId(postId);
  }

  createPost(post: Omit<Post, 'id' | 'createdAt'>) {
    return communityRepository.createPost(post);
  }

  createComment(comment: Omit<Comment, 'id' | 'createdAt'>) {
    return communityRepository.createComment(comment);
  }
  
  replyToComment(parentCommentId: string, reply: Omit<Comment, 'id' | 'createdAt'>) {
    return communityRepository.replyToComment(parentCommentId, reply);
  }
  
  deleteComment(commentId: string) {
    return communityRepository.deleteComment(commentId);
  }
  
  editComment(commentId: string, content: string) {
    return communityRepository.editComment(commentId, content);
  }
  
  toggleReactionToPost(postId: string, reaction: ReactionType) {
    return communityRepository.toggleReactionToPost(postId, reaction);
  }
  
  toggleReactionToComment(commentId: string, reaction: ReactionType) {
    return communityRepository.toggleReactionToComment(commentId, reaction);
  }
  
  toggleBookmarkPost(postId: string) {
    return communityRepository.toggleBookmarkPost(postId);
  }
  
  sharePost(postId: string) {
    return communityRepository.sharePost(postId);
  }
}

export const communityService = new CommunityService();
`;

fs.writeFileSync('services/community.service.ts', content);
