import { Post, Comment } from '@/types/community';
import { mockPosts, mockComments } from '@/data/mock-community-db';

export class CommunityRepository {
  async getPosts(): Promise<Post[]> {
    await new Promise(r => setTimeout(r, 400));
    return [...mockPosts];
  }

  async getPostById(id: string): Promise<Post | undefined> {
    await new Promise(r => setTimeout(r, 200));
    return mockPosts.find(p => p.id === id);
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    await new Promise(r => setTimeout(r, 200));
    return mockComments[postId] || [];
  }
}
export const communityRepository = new CommunityRepository();
