import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityService } from '@/services/community.service';
import { Post, Comment, ReactionType } from '@/types/community';

export function useCommunityFeed() {
  return useQuery({
    queryKey: ['community-feed'],
    queryFn: () => communityService.getPosts(),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => communityService.getPost(id),
    enabled: !!id,
  });
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => communityService.getComments(postId),
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPost: Omit<Post, 'id' | 'createdAt'>) => communityService.createPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newComment: Omit<Comment, 'id' | 'createdAt'>) => communityService.createComment(newComment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
  });
}

export function useReplyToComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ parentCommentId, reply }: { parentCommentId: string, reply: Omit<Comment, 'id' | 'createdAt'> }) => 
      communityService.replyToComment(parentCommentId, reply),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.reply.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.reply.postId] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, postId }: { commentId: string, postId: string }) => communityService.deleteComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
  });
}

export function useEditComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, postId, content }: { commentId: string, postId: string, content: string }) => communityService.editComment(commentId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
}

export function useReactToPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, reaction }: { postId: string, reaction: ReactionType }) => communityService.toggleReactionToPost(postId, reaction),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
    },
  });
}

export function useReactToComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, postId, reaction }: { commentId: string, postId: string, reaction: ReactionType }) => communityService.toggleReactionToComment(commentId, reaction),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
}

export function useBookmarkPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => communityService.toggleBookmarkPost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
    },
  });
}

export function useSharePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => communityService.sharePost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
    },
  });
}
