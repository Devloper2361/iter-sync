import { useQuestions } from '@/hooks/use-questions';
import { QuestionCard } from './question-card';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QuestionsTab() {
  const { data: questions, isLoading } = useQuestions();

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Q&A Forum</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ask Question
        </Button>
      </div>
      <div className="space-y-4">
        {questions?.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}
