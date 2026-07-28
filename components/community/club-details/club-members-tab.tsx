"use client"
import { useState } from 'react';
import { useClubMembers } from '@/hooks/use-clubs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ClubMembersTabProps {
  clubId: string;
}

export function ClubMembersTab({ clubId }: ClubMembersTabProps) {
  const { data: members, isLoading } = useClubMembers(clubId);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'Name' | 'Role' | 'Recent'>('Name');

  if (isLoading) {
    return (
      <div className="pt-6 space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Owner': return <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">Owner</Badge>;
      case 'Committee': return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Committee</Badge>;
      case 'Volunteer': return <Badge variant="secondary" className="bg-green-500/10 text-green-700">Volunteer</Badge>;
      default: return null;
    }
  };

  const getRoleWeight = (role: string) => {
    switch (role) {
      case 'Owner': return 4;
      case 'Committee': return 3;
      case 'Volunteer': return 2;
      default: return 1;
    }
  };

  const filteredMembers = members?.filter(member => 
    member.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortOrder === 'Name') return a.author.name.localeCompare(b.author.name);
    if (sortOrder === 'Role') return getRoleWeight(b.role) - getRoleWeight(a.role);
    if (sortOrder === 'Recent') return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
    return 0;
  });

  return (
    <div className="pt-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search members..." 
              className="pl-9 bg-background/50" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder('Name')}>Sort by Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('Role')}>Sort by Role</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('Recent')}>Sort by Recently Joined</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Button className="w-full sm:w-auto shadow-sm" variant="secondary" onClick={() => alert('Invite member dialog opened')}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Members
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMembers?.length ? filteredMembers.map(member => (
          <Card key={member.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border shadow-sm">
                  <AvatarImage src={member.author.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {member.author.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm flex items-center gap-2">
                    {member.author.name}
                    {getRoleBadge(member.role)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {member.author.department || 'Club Member'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => alert(`Messaging ${member.author.name}`)}>Message</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Remove from Club</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            No members found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
