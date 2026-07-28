"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, FileText, ListTodo, Presentation, Users, Megaphone, Share2, AlignLeft } from 'lucide-react';

export function ClubAIFeatures() {
  const handleAiAction = (action: string) => {
    alert(`${action} feature will use the Gemini AI API to generate content.`);
  };

  return (
    <Card className="shadow-sm border-primary/20 bg-gradient-to-b from-background to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          Club Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start text-left font-normal bg-background/50 hover:bg-background" onClick={() => handleAiAction('Generate Event Description')}>
          <FileText className="w-4 h-4 mr-3 text-blue-500" />
          Generate Event Description
        </Button>
        <Button variant="outline" className="w-full justify-start text-left font-normal bg-background/50 hover:bg-background" onClick={() => handleAiAction('Generate Announcement')}>
          <Megaphone className="w-4 h-4 mr-3 text-rose-500" />
          Generate Announcement
        </Button>
        <Button variant="outline" className="w-full justify-start text-left font-normal bg-background/50 hover:bg-background" onClick={() => handleAiAction('Generate Invitation')}>
          <Users className="w-4 h-4 mr-3 text-indigo-500" />
          Generate Invitation
        </Button>
        <Button variant="outline" className="w-full justify-start text-left font-normal bg-background/50 hover:bg-background" onClick={() => handleAiAction('Generate Social Caption')}>
          <Share2 className="w-4 h-4 mr-3 text-pink-500" />
          Generate Social Caption
        </Button>
        <Button variant="outline" className="w-full justify-start text-left font-normal bg-background/50 hover:bg-background" onClick={() => handleAiAction('Summarize Event')}>
          <AlignLeft className="w-4 h-4 mr-3 text-teal-500" />
          Summarize Event
        </Button>
        <Button variant="outline" className="w-full justify-start text-left font-normal bg-background/50 hover:bg-background" onClick={() => handleAiAction('Suggest Agenda')}>
          <ListTodo className="w-4 h-4 mr-3 text-green-500" />
          Suggest Agenda
        </Button>
        <Button variant="outline" className="w-full justify-start text-left font-normal bg-background/50 hover:bg-background" onClick={() => handleAiAction('Suggest Sponsors')}>
          <Presentation className="w-4 h-4 mr-3 text-amber-500" />
          Suggest Sponsors
        </Button>
        <p className="text-xs text-muted-foreground text-center pt-2">
          Powered by Gemini AI
        </p>
      </CardContent>
    </Card>
  );
}
