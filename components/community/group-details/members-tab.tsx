"use client"
import { useState } from 'react';
import { useGroupMembers, useRemoveGroupMember, useUpdateMemberRole } from '@/hooks/use-study-groups';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, MessageSquare, MoreVertical, Loader2, Shield, Trash2, Crown } from 'lucide-react';
import { InviteMemberDialog } from './invite-member-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface MembersTabProps {
  groupId: string;
}

export function MembersTab({ groupId }: MembersTabProps) {
  const { user } = useAuth();
  const { data: members, isLoading } = useGroupMembers(groupId);
  const removeMember = useRemoveGroupMember(groupId);
  const updateRole = useUpdateMemberRole(groupId);

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Owner': return <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-md">Owner</span>;
      case 'Admin': return <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">Admin</span>;
      default: return null;
    }
  };

  const myMember = members?.find(m => m.author.id === user?.id);
  const myRole = myMember?.role;
  const isOwner = myRole === 'Owner';
  const isAdmin = myRole === 'Admin' || myRole === 'Owner';

  const filteredMembers = members?.filter(m => m.author.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search members..." 
            className="pl-9 bg-background/50 h-9 text-sm" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {(isAdmin) && (
          <Button className="w-full sm:w-auto h-9" variant="outline" onClick={() => setInviteDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredMembers.map(member => (
          <Card key={member.id} className="shadow-none border bg-card/50 hover:bg-card transition-colors">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border bg-muted/50">
                  <AvatarImage src={member.author.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                    {member.author.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm flex items-center gap-2">
                    {member.author.name}
                    {member.author.id === user?.id && <span className="text-[10px] text-muted-foreground font-normal">(You)</span>}
                    {getRoleBadge(member.role)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[150px]">
                    {member.author.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                
                {((isAdmin && member.role !== 'Owner') || isOwner) && member.author.id !== user?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isOwner && member.role === 'Member' && (
                        <DropdownMenuItem onClick={() => updateRole.mutate({ memberId: member.id, role: 'Admin' })}>
                          <Shield className="w-4 h-4 mr-2" />
                          Make Admin
                        </DropdownMenuItem>
                      )}
                      {isOwner && member.role === 'Admin' && (
                        <DropdownMenuItem onClick={() => updateRole.mutate({ memberId: member.id, role: 'Member' })}>
                          <Shield className="w-4 h-4 mr-2" />
                          Revoke Admin
                        </DropdownMenuItem>
                      )}
                      {isOwner && (
                        <DropdownMenuItem onClick={() => {
                          if (confirm('Are you sure you want to transfer ownership? You will become an Admin.')) {
                            updateRole.mutate({ memberId: member.id, role: 'Owner' });
                          }
                        }}>
                          <Crown className="w-4 h-4 mr-2 text-amber-500" />
                          Transfer Ownership
                        </DropdownMenuItem>
                      )}
                      {isOwner && <DropdownMenuSeparator />}
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10"
                        onClick={() => {
                          if (confirm('Are you sure you want to remove this member?')) {
                            removeMember.mutate(member.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <InviteMemberDialog
        groupId={groupId}
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        existingMembers={members || []}
      />
    </div>
  );
}
