const fs = require('fs');

const content = `import { mockQuestions, mockAnswers } from '@/data/mock-community-db';
import { Question, Answer, Comment } from '@/types/community';

export class QuestionRepository {
  private questions: Question[] = [...mockQuestions];
  private answers: Answer[] = Object.values(mockAnswers).flat();

  async getQuestions(): Promise<Question[]> {
    return Promise.resolve(this.questions);
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    const q = this.questions.find(q => q.id === id);
    if (q) {
      q.views += 1;
    }
    return Promise.resolve(q);
  }

  async createQuestion(question: Omit<Question, 'id' | 'createdAt'>): Promise<Question> {
    const newQuestion: Question = {
      ...question,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      views: 0,
      answersCount: 0,
      upvotes: 0,
      downvotes: 0,
      bookmarks: 0,
      followers: 1,
      shareCount: 0
    };
    this.questions = [newQuestion, ...this.questions];
    return Promise.resolve(newQuestion);
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question | undefined> {
    const index = this.questions.findIndex(q => q.id === id);
    if (index !== -1) {
      this.questions[index] = { ...this.questions[index], ...updates, updatedAt: new Date().toISOString() };
      return Promise.resolve(this.questions[index]);
    }
    return Promise.resolve(undefined);
  }

  async deleteQuestion(id: string): Promise<void> {
    this.questions = this.questions.filter(q => q.id !== id);
    this.answers = this.answers.filter(a => a.questionId !== id);
    return Promise.resolve();
  }

  async getAnswersByQuestionId(questionId: string): Promise<Answer[]> {
    return Promise.resolve(this.answers.filter(a => a.questionId === questionId));
  }

  async createAnswer(answer: Omit<Answer, 'id' | 'createdAt'>): Promise<Answer> {
    const newAnswer: Answer = {
      ...answer,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      isAccepted: false,
      isPinned: false,
      replies: []
    };
    this.answers = [newAnswer, ...this.answers];
    
    const qIndex = this.questions.findIndex(q => q.id === answer.questionId);
    if(qIndex !== -1) {
      this.questions[qIndex].answersCount++;
    }
    return Promise.resolve(newAnswer);
  }

  async updateAnswer(id: string, updates: Partial<Answer>): Promise<Answer | undefined> {
    const index = this.answers.findIndex(a => a.id === id);
    if (index !== -1) {
      this.answers[index] = { ...this.answers[index], ...updates, updatedAt: new Date().toISOString() };
      return Promise.resolve(this.answers[index]);
    }
    return Promise.resolve(undefined);
  }

  async deleteAnswer(id: string): Promise<void> {
    const answer = this.answers.find(a => a.id === id);
    if (answer) {
      this.answers = this.answers.filter(a => a.id !== id);
      const qIndex = this.questions.findIndex(q => q.id === answer.questionId);
      if(qIndex !== -1) {
        this.questions[qIndex].answersCount = Math.max(0, this.questions[qIndex].answersCount - 1);
      }
    }
    return Promise.resolve();
  }

  async replyToAnswer(answerId: string, reply: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const newReply: Comment = {
      ...reply,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    const index = this.answers.findIndex(a => a.id === answerId);
    if (index !== -1) {
      if (!this.answers[index].replies) this.answers[index].replies = [];
      this.answers[index].replies.push(newReply);
    }
    return Promise.resolve(newReply);
  }

  async toggleQuestionVote(id: string, type: 'up' | 'down'): Promise<void> {
    const q = this.questions.find(q => q.id === id);
    if (!q) return Promise.resolve();

    q.downvotes = q.downvotes || 0;

    if (type === 'up') {
      if (q.isUpvotedByMe) {
        q.isUpvotedByMe = false;
        q.upvotes--;
      } else {
        q.isUpvotedByMe = true;
        q.upvotes++;
        if (q.isDownvotedByMe) {
          q.isDownvotedByMe = false;
          q.downvotes--;
        }
      }
    } else {
      if (q.isDownvotedByMe) {
        q.isDownvotedByMe = false;
        q.downvotes--;
      } else {
        q.isDownvotedByMe = true;
        q.downvotes++;
        if (q.isUpvotedByMe) {
          q.isUpvotedByMe = false;
          q.upvotes--;
        }
      }
    }
    return Promise.resolve();
  }

  async toggleAnswerVote(id: string, type: 'up' | 'down'): Promise<void> {
    const a = this.answers.find(a => a.id === id);
    if (!a) return Promise.resolve();

    a.downvotes = a.downvotes || 0;

    if (type === 'up') {
      if (a.isUpvotedByMe) {
        a.isUpvotedByMe = false;
        a.upvotes--;
      } else {
        a.isUpvotedByMe = true;
        a.upvotes++;
        if (a.isDownvotedByMe) {
          a.isDownvotedByMe = false;
          a.downvotes--;
        }
      }
    } else {
      if (a.isDownvotedByMe) {
        a.isDownvotedByMe = false;
        a.downvotes--;
      } else {
        a.isDownvotedByMe = true;
        a.downvotes++;
        if (a.isUpvotedByMe) {
          a.isUpvotedByMe = false;
          a.upvotes--;
        }
      }
    }
    return Promise.resolve();
  }

  async toggleQuestionBookmark(id: string): Promise<void> {
    const q = this.questions.find(q => q.id === id);
    if (!q) return Promise.resolve();
    q.bookmarks = q.bookmarks || 0;
    
    if (q.isBookmarkedByMe) {
      q.isBookmarkedByMe = false;
      q.bookmarks--;
    } else {
      q.isBookmarkedByMe = true;
      q.bookmarks++;
    }
    return Promise.resolve();
  }

  async toggleQuestionFollow(id: string): Promise<void> {
    const q = this.questions.find(q => q.id === id);
    if (!q) return Promise.resolve();
    q.followers = q.followers || 0;
    
    if (q.isFollowedByMe) {
      q.isFollowedByMe = false;
      q.followers--;
    } else {
      q.isFollowedByMe = true;
      q.followers++;
    }
    return Promise.resolve();
  }

  async shareQuestion(id: string): Promise<void> {
    const q = this.questions.find(q => q.id === id);
    if (!q) return Promise.resolve();
    q.shareCount = (q.shareCount || 0) + 1;
    return Promise.resolve();
  }

  async acceptAnswer(answerId: string, questionId: string): Promise<void> {
    this.answers.forEach(a => {
      if (a.questionId === questionId) {
        if (a.id === answerId) {
          a.isAccepted = !a.isAccepted; // toggle
        } else {
          a.isAccepted = false; // only one accepted answer allowed
        }
      }
    });
    return Promise.resolve();
  }
}

export const questionRepository = new QuestionRepository();
`;

fs.writeFileSync('repositories/question.repository.ts', content);
