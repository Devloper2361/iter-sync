import { Question } from '@/types/community';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ArrowBigUp, ArrowBigDown, Eye, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { UserHoverCard } from './post-details/user-hover-card';

export function QuestionCard({ question }: { question: Question }) {
  const score = question.upvotes - (question.downvotes || 0);
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-0 sm:flex">
        {/* Left Stats Column (Desktop) */}
        <div className="hidden sm:flex flex-col items-end p-4 gap-2 min-w-[120px] text-muted-foreground border-r bg-muted/5">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-medium text-foreground">{score}</span>
            <span>votes</span>
          </div>
          
          <div className={`flex items-center gap-1.5 text-sm ${question.answersCount > 0 ? (/* check if accepted */ false ? 'text-emerald-600 font-medium border border-emerald-600 rounded-sm px-1.5 py-0.5 bg-emerald-50' : 'text-emerald-600 border border-emerald-600 rounded-sm px-1.5 py-0.5') : ''}`}>
            {false && <CheckCircle2 className="w-3.5 h-3.5" />}
            <span className="font-medium">{question.answersCount}</span>
            <span>answers</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <span className="font-medium">{question.views}</span>
            <span>views</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 flex flex-col min-w-0">
          <div className="flex justify-between items-start gap-4 mb-2">
            <Link href={`/community/question/${question.id}`} className="hover:text-primary transition-colors flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-indigo-700 dark:text-indigo-400">{question.title}</h3>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{question.body}</p>
          
          <div className="flex flex-wrap gap-1.5 mb-3">
            {question.department && (
              <Badge variant="outline" className="text-[10px] font-normal bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                {question.department}
              </Badge>
            )}
            {question.difficulty && (
              <Badge variant="outline" className={`text-[10px] font-normal ${
                question.difficulty === 'Beginner' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' :
                question.difficulty === 'Intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800' :
                question.difficulty === 'Advanced' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800' :
                'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
              }`}>
                {question.difficulty}
              </Badge>
            )}
            {question.tags.map(tag => (
              <span key={tag} className="text-xs bg-secondary/60 hover:bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground transition-colors cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-2">
            {/* Mobile Stats */}
            <div className="flex sm:hidden items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium"><ArrowBigUp className="w-3.5 h-3.5"/> {score}</span>
              <span className="flex items-center gap-1 font-medium"><MessageSquare className="w-3.5 h-3.5"/> {question.answersCount}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5"/> {question.views}</span>
            </div>
            
            <div className="hidden sm:block"></div> {/* Spacer for desktop */}
            
            <div className="flex items-center gap-2">
              <UserHoverCard author={question.author}>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={question.isAnonymous ? undefined : question.author.avatarUrl} />
                    <AvatarFallback className="text-[10px]">{question.isAnonymous ? 'A' : question.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                    {question.isAnonymous ? 'Anonymous' : question.author.name}
                  </span>
                </div>
              </UserHoverCard>
              <span className="text-xs text-muted-foreground">
                asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
