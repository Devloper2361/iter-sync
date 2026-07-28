import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, FileText, BrainCircuit, MessageSquare, CalendarClock, ListChecks, GraduationCap, Zap, Search } from 'lucide-react';
import { toast } from 'sonner';

export function AIFeatures() {
  const handleAIAction = (action: string) => {
    toast.success(`Generating ${action}...`, {
      description: 'The AI assistant is working on your request.'
    });
  };

  return (
    <Card className="shadow-sm border-muted/60 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <Sparkles className="w-4 h-4" /> AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={() => handleAIAction('Unread Summary')} variant="outline" className="w-full justify-start text-xs h-9 bg-white/50 hover:bg-white dark:bg-background/50 dark:hover:bg-background shadow-sm border-indigo-100 dark:border-indigo-900/50">
          <Zap className="w-3.5 h-3.5 mr-2 text-yellow-600 dark:text-yellow-400" /> Summarize Unread
        </Button>
        <Button onClick={() => handleAIAction('Discussion Summary')} variant="outline" className="w-full justify-start text-xs h-9 bg-white/50 hover:bg-white dark:bg-background/50 dark:hover:bg-background shadow-sm border-indigo-100 dark:border-indigo-900/50">
          <MessageSquare className="w-3.5 h-3.5 mr-2 text-purple-600 dark:text-purple-400" /> Summarize Discussion
        </Button>
        <Button onClick={() => handleAIAction('Quiz')} variant="outline" className="w-full justify-start text-xs h-9 bg-white/50 hover:bg-white dark:bg-background/50 dark:hover:bg-background shadow-sm border-indigo-100 dark:border-indigo-900/50">
          <FileText className="w-3.5 h-3.5 mr-2 text-blue-600 dark:text-blue-400" /> Generate Quiz
        </Button>
        <Button onClick={() => handleAIAction('Revision Notes')} variant="outline" className="w-full justify-start text-xs h-9 bg-white/50 hover:bg-white dark:bg-background/50 dark:hover:bg-background shadow-sm border-indigo-100 dark:border-indigo-900/50">
          <GraduationCap className="w-3.5 h-3.5 mr-2 text-emerald-600 dark:text-emerald-400" /> Generate Revision Notes
        </Button>
        <Button onClick={() => handleAIAction('Flashcards')} variant="outline" className="w-full justify-start text-xs h-9 bg-white/50 hover:bg-white dark:bg-background/50 dark:hover:bg-background shadow-sm border-indigo-100 dark:border-indigo-900/50">
          <ListChecks className="w-3.5 h-3.5 mr-2 text-orange-600 dark:text-orange-400" /> Generate Flashcards
        </Button>
        <Button onClick={() => handleAIAction('Study Plan')} variant="outline" className="w-full justify-start text-xs h-9 bg-white/50 hover:bg-white dark:bg-background/50 dark:hover:bg-background shadow-sm border-indigo-100 dark:border-indigo-900/50">
          <BrainCircuit className="w-3.5 h-3.5 mr-2 text-indigo-600 dark:text-indigo-400" /> Generate Study Plan
        </Button>
        <Button onClick={() => handleAIAction('Meeting Agenda')} variant="outline" className="w-full justify-start text-xs h-9 bg-white/50 hover:bg-white dark:bg-background/50 dark:hover:bg-background shadow-sm border-indigo-100 dark:border-indigo-900/50">
          <CalendarClock className="w-3.5 h-3.5 mr-2 text-pink-600 dark:text-pink-400" /> Create Meeting Agenda
        </Button>
        <Button onClick={() => handleAIAction('Important Points')} variant="outline" className="w-full justify-start text-xs h-9 bg-white/50 hover:bg-white dark:bg-background/50 dark:hover:bg-background shadow-sm border-indigo-100 dark:border-indigo-900/50">
          <Search className="w-3.5 h-3.5 mr-2 text-teal-600 dark:text-teal-400" /> Extract Important Points
        </Button>
      </CardContent>
    </Card>
  );
}
