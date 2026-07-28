import { Club } from '@/types/community';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Users, CalendarDays, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

interface ClubHeaderProps {
  club: Club;
}

export function ClubHeader({ club }: ClubHeaderProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm animate-in fade-in duration-500">
      <div className="h-48 sm:h-64 md:h-80 w-full relative bg-muted">
        {club.bannerUrl ? (
          <Image src={club.bannerUrl} alt="Club Banner" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/10 to-primary/5" />
        )}
      </div>
      <CardContent className="p-6 sm:p-8 relative">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-end -mt-16 sm:-mt-24 mb-6">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background shadow-lg rounded-xl">
            <AvatarImage src={club.logoUrl} className="object-cover" />
            <AvatarFallback className="text-2xl sm:text-4xl bg-primary/10 text-primary font-bold rounded-xl">
              {club.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2 mt-4 sm:mt-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{club.name}</h1>
              {club.status === 'Active' && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-0 shadow-none">Active</Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><Badge variant="outline">{club.category}</Badge></span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{club.membersCount} Members</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" />Est. {club.foundedYear}</span>
            </div>
          </div>
          <div className="w-full sm:w-auto flex items-center gap-3 shrink-0">
            <Button variant={club.isJoinedByMe ? "secondary" : "default"} className="flex-1 sm:flex-none shadow-sm">
              {club.isJoinedByMe ? 'Joined' : 'Join Club'}
            </Button>
            <Button variant={club.isFollowedByMe ? "secondary" : "outline"} className="flex-1 sm:flex-none shadow-sm">
              {club.isFollowedByMe ? 'Following' : 'Follow'}
            </Button>
          </div>
        </div>

        <div className="space-y-4 max-w-3xl">
          <p className="text-muted-foreground leading-relaxed">{club.about}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary" className="shadow-none border-0 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Advisor: {club.facultyAdvisor?.name || 'N/A'}
            </Badge>
            {club.president && (
              <Badge variant="secondary" className="shadow-none border-0">
                President: {club.president.name}
              </Badge>
            )}
             {club.vicePresident && (
              <Badge variant="secondary" className="shadow-none border-0">
                VP: {club.vicePresident.name}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
