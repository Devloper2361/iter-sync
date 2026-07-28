import { useQuery } from '@tanstack/react-query';
import { questionService } from '@/services/question.service';

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
