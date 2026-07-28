"use client"

import { useStudyGroup } from '@/hooks/use-study-groups';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Clock, MapPin, Tag, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function GroupDetailsPage({ params }: { params: { id: string } }) {
  const { data: group, isLoading } = useStudyGroup(params.id);

  if (isLoading) return <div className="p-8 text-center">Loading group...</div>;
  if (!group) return <div className="p-8 text-center text-destructive">Study group not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <Link href="/community" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Study Groups
      </Link>

      <Card className="border-t-4 border-primary">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">{group.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <span>Created by {group.creator.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {group.membersCount} Members</span>
              </div>
            </div>
            <Button variant={group.isJoinedByMe ? "secondary" : "default"}>
              {group.isJoinedByMe ? 'Leave Group' : 'Join Group'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {group.tags.map(tag => (
              <span key={tag} className="text-xs bg-secondary px-2.5 py-1 rounded-full text-secondary-foreground font-medium flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
            {group.description}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Logistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <span className="font-semibold block">Meeting Time</span>
                  <span className="text-muted-foreground">{group.meetingTime || 'TBD'}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <span className="font-semibold block">Location</span>
                  <span className="text-muted-foreground">{group.meetingLocation || 'TBD'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Group Discussions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center border-2 border-dashed rounded-lg m-6 mt-0">
              <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
              <p>No active discussions yet.</p>
              <Button variant="outline" className="mt-4">Start a discussion</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
