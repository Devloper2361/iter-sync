import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Building2, GraduationCap, CalendarDays } from 'lucide-react';
import { Author } from '@/types/community';
import { Badge } from '@/components/ui/badge';
import React from 'react';

export function UserHoverCard({ author, children }: { author: Author, children: React.ReactNode }) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="flex justify-between space-x-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={author.avatarUrl} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-semibold">{author.name}</h4>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{author.role}</Badge>
            </div>
            <div className="flex items-center pt-2">
              <Building2 className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {author.department || 'General Department'}
              </span>
            </div>
            {author.semester && (
              <div className="flex items-center pt-1">
                <GraduationCap className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  Semester {author.semester}
                </span>
              </div>
            )}
            <div className="flex items-center pt-1">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined Sept 2023
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
