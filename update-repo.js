const fs = require('fs');

const content = `import { mockPosts, mockComments } from '@/data/mock-community-db';
import { Post, Comment, ReactionType } from '@/types/community';

export class CommunityRepository {
  private posts: Post[] = [...mockPosts];
  private comments: Comment[] = Object.values(mockComments).flat();

  async getPosts(): Promise<Post[]> {
    return Promise.resolve(this.posts);
  }

  async getPostById(id: string): Promise<Post | undefined> {
    return Promise.resolve(this.posts.find(p => p.id === id));
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return Promise.resolve(this.comments.filter(c => c.postId === postId));
  }

  async createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
    const newPost: Post = {
      ...post,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString()
    };
    this.posts = [newPost, ...this.posts];
    return Promise.resolve(newPost);
  }

  async createComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      replies: []
    };
    this.comments = [newComment, ...this.comments];
    
    // Update post comment count
    const postIndex = this.posts.findIndex(p => p.id === comment.postId);
    if (postIndex !== -1) {
      this.posts[postIndex].commentsCount += 1;
    }
    
    return Promise.resolve(newComment);
  }

  async replyToComment(parentCommentId: string, reply: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const newReply: Comment = {
      ...reply,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    const parentIndex = this.comments.findIndex(c => c.id === parentCommentId);
    if (parentIndex !== -1) {
      if (!this.comments[parentIndex].replies) {
        this.comments[parentIndex].replies = [];
      }
      this.comments[parentIndex].replies.push(newReply);
    }
    
    // Update post comment count
    const postIndex = this.posts.findIndex(p => p.id === reply.postId);
    if (postIndex !== -1) {
      this.posts[postIndex].commentsCount += 1;
    }
    
    return Promise.resolve(newReply);
  }

  async deleteComment(commentId: string): Promise<void> {
    const commentIndex = this.comments.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
      const postId = this.comments[commentIndex].postId;
      this.comments.splice(commentIndex, 1);
      
      const postIndex = this.posts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        this.posts[postIndex].commentsCount = Math.max(0, this.posts[postIndex].commentsCount - 1);
      }
    } else {
      // Check replies
      for (let i = 0; i < this.comments.length; i++) {
        const c = this.comments[i];
        if (c.replies) {
          const replyIndex = c.replies.findIndex(r => r.id === commentId);
          if (replyIndex !== -1) {
             c.replies.splice(replyIndex, 1);
             const postIndex = this.posts.findIndex(p => p.id === c.postId);
             if (postIndex !== -1) {
               this.posts[postIndex].commentsCount = Math.max(0, this.posts[postIndex].commentsCount - 1);
             }
             break;
          }
        }
      }
    }
    return Promise.resolve();
  }

  async editComment(commentId: string, content: string): Promise<void> {
    const commentIndex = this.comments.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
      this.comments[commentIndex].content = content;
    } else {
      for (const c of this.comments) {
        if (c.replies) {
          const reply = c.replies.find(r => r.id === commentId);
          if (reply) {
            reply.content = content;
            break;
          }
        }
      }
    }
    return Promise.resolve();
  }

  async toggleReactionToPost(postId: string, reaction: ReactionType): Promise<Post | undefined> {
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return Promise.resolve(undefined);
    
    const post = this.posts[postIndex];
    if (!post.reactions) post.reactions = {};
    
    if (post.myReaction === reaction) {
      // Remove reaction
      post.myReaction = undefined;
      post.reactions[reaction] = Math.max(0, (post.reactions[reaction] || 1) - 1);
      post.likes = Math.max(0, post.likes - 1);
      post.isLikedByMe = false;
    } else {
      // Change or add reaction
      if (post.myReaction) {
        post.reactions[post.myReaction] = Math.max(0, (post.reactions[post.myReaction] || 1) - 1);
      } else {
        post.likes += 1;
      }
      post.myReaction = reaction;
      post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
      post.isLikedByMe = true;
    }
    
    return Promise.resolve(post);
  }

  async toggleReactionToComment(commentId: string, reaction: ReactionType): Promise<void> {
    let targetComment: Comment | undefined;
    
    const commentIndex = this.comments.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
      targetComment = this.comments[commentIndex];
    } else {
      for (const c of this.comments) {
        if (c.replies) {
          targetComment = c.replies.find(r => r.id === commentId);
          if (targetComment) break;
        }
      }
    }
    
    if (!targetComment) return Promise.resolve();
    
    if (!targetComment.reactions) targetComment.reactions = {};
    
    if (targetComment.myReaction === reaction) {
      targetComment.myReaction = undefined;
      targetComment.reactions[reaction] = Math.max(0, (targetComment.reactions[reaction] || 1) - 1);
      targetComment.likes = Math.max(0, targetComment.likes - 1);
      targetComment.isLikedByMe = false;
    } else {
      if (targetComment.myReaction) {
        targetComment.reactions[targetComment.myReaction] = Math.max(0, (targetComment.reactions[targetComment.myReaction] || 1) - 1);
      } else {
        targetComment.likes += 1;
      }
      targetComment.myReaction = reaction;
      targetComment.reactions[reaction] = (targetComment.reactions[reaction] || 0) + 1;
      targetComment.isLikedByMe = true;
    }
    
    return Promise.resolve();
  }

  async toggleBookmarkPost(postId: string): Promise<Post | undefined> {
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return Promise.resolve(undefined);
    
    const post = this.posts[postIndex];
    if (post.isBookmarkedByMe) {
      post.isBookmarkedByMe = false;
      post.bookmarks = Math.max(0, post.bookmarks - 1);
    } else {
      post.isBookmarkedByMe = true;
      post.bookmarks += 1;
    }
    
    return Promise.resolve(post);
  }
  
  async sharePost(postId: string): Promise<Post | undefined> {
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return Promise.resolve(undefined);
    
    const post = this.posts[postIndex];
    post.shareCount += 1;
    
    return Promise.resolve(post);
  }
}

export const communityRepository = new CommunityRepository();
`;

fs.writeFileSync('repositories/community.repository.ts', content);
