import { Question, Answer } from '@/types/community';
import { mockQuestions, mockAnswers } from '@/data/mock-community-db';

export class QuestionRepository {
  async getQuestions(): Promise<Question[]> {
    await new Promise(r => setTimeout(r, 400));
    return [...mockQuestions];
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    await new Promise(r => setTimeout(r, 200));
    return mockQuestions.find(q => q.id === id);
  }

  async getAnswersByQuestionId(questionId: string): Promise<Answer[]> {
    await new Promise(r => setTimeout(r, 200));
    return mockAnswers[questionId] || [];
  }
}
export const questionRepository = new QuestionRepository();
