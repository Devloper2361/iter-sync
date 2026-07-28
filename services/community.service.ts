import { communityRepository } from '@/repositories/community.repository';

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
}
export const communityService = new CommunityService();
