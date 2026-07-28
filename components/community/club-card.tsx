import { Club } from '@/types/community';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import Link from 'next/link';

export function ClubCard({ club }: { club: Club }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{club.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{club.about}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{club.membersCount} members</span>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t flex gap-2">
        <Link href={`/community/club/${club.id}`} className="flex-1">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
        <Button variant={club.isJoinedByMe ? "secondary" : "default"} className="flex-1">
          {club.isJoinedByMe ? 'Joined' : 'Join'}
        </Button>
      </CardFooter>
    </Card>
  );
}
