import { Question } from '@/types/community';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, ArrowBigUp } from 'lucide-react';
import Link from 'next/link';

export function QuestionCard({ question }: { question: Question }) {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={question.author.avatarUrl} />
          <AvatarFallback>{question.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium leading-none">{question.author.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/community/question/${question.id}`} className="hover:underline">
          <h3 className="font-semibold text-lg mb-2">{question.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">{question.body}</p>
        <div className="flex gap-2 mt-4">
          {question.tags.map(tag => (
            <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-6 border-t pt-4 text-muted-foreground">
        <button className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
          <ArrowBigUp className={`w-5 h-5 ${question.isUpvotedByMe ? 'fill-primary text-primary' : ''}`} />
          <span>{question.upvotes}</span>
        </button>
        <Link href={`/community/question/${question.id}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>{question.answersCount} Answers</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
