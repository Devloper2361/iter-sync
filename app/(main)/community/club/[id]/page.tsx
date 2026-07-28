"use client"

import { useClub } from '@/hooks/use-clubs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Calendar, Image as ImageIcon, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function ClubDetailsPage({ params }: { params: { id: string } }) {
  const { data: club, isLoading } = useClub(params.id);

  if (isLoading) return <div className="p-8 text-center">Loading club...</div>;
  if (!club) return <div className="p-8 text-center text-destructive">Club not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <Link href="/community" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Clubs
      </Link>

      <div className="relative h-48 md:h-64 rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 overflow-hidden flex items-end p-6 border">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 w-full flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-md">{club.name}</h1>
            <p className="text-white/90 mt-2 font-medium drop-shadow flex items-center gap-2">
              <Users className="w-4 h-4" />
              {club.membersCount} Members
            </p>
          </div>
          <Button variant={club.isJoinedByMe ? "secondary" : "default"} size="lg" className="shadow-lg">
            {club.isJoinedByMe ? 'Joined' : 'Join Club'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{club.about}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center border-2 border-dashed rounded-lg m-6 mt-0">
              <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
              <p>No recent activity in the club feed.</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Faculty Advisor</span>
                <span className="font-medium">{club.facultyAdvisor}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming events.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 opacity-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
