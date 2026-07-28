import { StudyGroup } from '@/types/community';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

export function GroupCard({ group }: { group: StudyGroup }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{group.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{group.membersCount} members</span>
          </div>
          {group.meetingTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{group.meetingTime}</span>
            </div>
          )}
          {group.meetingLocation && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{group.meetingLocation}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t flex gap-2">
        <Link href={`/community/group/${group.id}`} className="flex-1">
          <Button variant="outline" className="w-full">View Group</Button>
        </Link>
        <Button variant={group.isJoinedByMe ? "secondary" : "default"} className="flex-1">
          {group.isJoinedByMe ? 'Joined' : 'Join'}
        </Button>
      </CardFooter>
    </Card>
  );
}
