import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionService } from '@/services/question.service';
import { Question, Answer, Comment } from '@/types/community';

export function useQuestions() {
  return useQuery({
    queryKey: ['questions'],
    queryFn: () => questionService.getQuestions(),
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => questionService.getQuestion(id),
    enabled: !!id,
  });
}

export function useAnswers(questionId: string) {
  return useQuery({
    queryKey: ['answers', questionId],
    queryFn: () => questionService.getAnswers(questionId),
    enabled: !!questionId,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newQuestion: Omit<Question, 'id' | 'createdAt'>) => questionService.createQuestion(newQuestion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Question> }) => questionService.updateQuestion(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['question', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useCreateAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newAnswer: Omit<Answer, 'id' | 'createdAt'>) => questionService.createAnswer(newAnswer),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.questionId] });
      queryClient.invalidateQueries({ queryKey: ['question', variables.questionId] });
    },
  });
}

export function useUpdateAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, questionId, updates }: { id: string, questionId: string, updates: Partial<Answer> }) => questionService.updateAnswer(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.questionId] });
    },
  });
}

export function useDeleteAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, questionId }: { id: string, questionId: string }) => questionService.deleteAnswer(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.questionId] });
      queryClient.invalidateQueries({ queryKey: ['question', variables.questionId] });
    },
  });
}

export function useReplyToAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ answerId, questionId, reply }: { answerId: string, questionId: string, reply: Omit<Comment, 'id' | 'createdAt'> }) => 
      questionService.replyToAnswer(answerId, reply),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.questionId] });
    },
  });
}

export function useToggleQuestionVote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, type }: { id: string, type: 'up' | 'down' }) => questionService.toggleQuestionVote(id, type),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['question', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useToggleAnswerVote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, questionId, type }: { id: string, questionId: string, type: 'up' | 'down' }) => questionService.toggleAnswerVote(id, type),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.questionId] });
    },
  });
}

export function useToggleQuestionBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionService.toggleQuestionBookmark(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['question', id] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useToggleQuestionFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionService.toggleQuestionFollow(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['question', id] });
    },
  });
}

export function useShareQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionService.shareQuestion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['question', id] });
    },
  });
}

export function useAcceptAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ answerId, questionId }: { answerId: string, questionId: string }) => questionService.acceptAnswer(answerId, questionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.questionId] });
    },
  });
}
