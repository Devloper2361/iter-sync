import { questionRepository } from '@/repositories/question.repository';
import { Question, Answer, Comment } from '@/types/community';

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

  createQuestion(question: Omit<Question, 'id' | 'createdAt'>) {
    return questionRepository.createQuestion(question);
  }

  updateQuestion(id: string, updates: Partial<Question>) {
    return questionRepository.updateQuestion(id, updates);
  }

  deleteQuestion(id: string) {
    return questionRepository.deleteQuestion(id);
  }

  createAnswer(answer: Omit<Answer, 'id' | 'createdAt'>) {
    return questionRepository.createAnswer(answer);
  }

  updateAnswer(id: string, updates: Partial<Answer>) {
    return questionRepository.updateAnswer(id, updates);
  }

  deleteAnswer(id: string) {
    return questionRepository.deleteAnswer(id);
  }

  replyToAnswer(answerId: string, reply: Omit<Comment, 'id' | 'createdAt'>) {
    return questionRepository.replyToAnswer(answerId, reply);
  }

  toggleQuestionVote(id: string, type: 'up' | 'down') {
    return questionRepository.toggleQuestionVote(id, type);
  }

  toggleAnswerVote(id: string, type: 'up' | 'down') {
    return questionRepository.toggleAnswerVote(id, type);
  }

  toggleQuestionBookmark(id: string) {
    return questionRepository.toggleQuestionBookmark(id);
  }

  toggleQuestionFollow(id: string) {
    return questionRepository.toggleQuestionFollow(id);
  }

  shareQuestion(id: string) {
    return questionRepository.shareQuestion(id);
  }

  acceptAnswer(answerId: string, questionId: string) {
    return questionRepository.acceptAnswer(answerId, questionId);
  }
}

export const questionService = new QuestionService();
