import { questionRepository } from '@/repositories/question.repository';

export class QuestionService {
  getQuestions() {
    return questionRepository.getQuestions();
  }
  getQuestion(id: string) {
    return questionRepository.getQuestionById(id);
  }
  getAnswers(questionId: string) {
    return questionRepository.getAnswersByQuestionId(questionId);
  }
}
export const questionService = new QuestionService();
