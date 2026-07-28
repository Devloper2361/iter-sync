import { StudyGroup } from '@/types/community';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, Info, ShieldCheck, Users, Link as LinkIcon, FileText, Image as ImageIcon, Video, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { AIFeatures } from './ai-features';

interface GroupInfoSidebarProps {
  group: StudyGroup;
  onClose: () => void;
}

export function GroupInfoSidebar({ group, onClose }: GroupInfoSidebarProps) {
  return (
    <div className="w-80 border-l bg-card flex flex-col h-[70vh] max-h-[800px] rounded-r-xl">
      <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0 bg-muted/20">
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 -ml-2 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </Button>
        <h3 className="font-medium">Group Info</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center p-6 text-center">
          <Avatar className="w-24 h-24 border-2 shadow-sm mb-4">
            {group.avatarUrl ? (
              <AvatarImage src={group.avatarUrl} className="object-cover" />
            ) : (
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {group.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <h2 className="text-xl font-semibold mb-1">{group.name}</h2>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            Group • {group.membersCount} members
          </p>
        </div>

        <Separator />

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><Info className="w-4 h-4" /> Description</h4>
            <p className="text-sm">{group.description}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><ShieldCheck className="w-4 h-4" /> Created By</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium">{group.creator.name}</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-md">CR</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Created {group.createdAt ? format(new Date(group.createdAt), 'MMM d, yyyy') : 'Unknown'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Subject & Dept</h4>
            <p className="text-sm">{group.subject} • {group.department} {group.semester ? `(Sem ${group.semester})` : ''}</p>
          </div>
        </div>

        <Separator />

        <div className="p-2">
          <Button variant="ghost" className="w-full justify-start text-sm font-normal">
            <ImageIcon className="w-4 h-4 mr-3 text-blue-500" /> Media, Links, and Docs
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm font-normal">
            <Users className="w-4 h-4 mr-3 text-indigo-500" /> Search Members
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm font-normal">
            <Bell className="w-4 h-4 mr-3 text-amber-500" /> Mute Notifications
          </Button>
          {group.privacy === 'Invite Only' && (
             <Button variant="ghost" className="w-full justify-start text-sm font-normal">
               <LinkIcon className="w-4 h-4 mr-3 text-emerald-500" /> Invite Link
             </Button>
          )}
        </div>
        
        <Separator />

        <div className="p-4">
          <AIFeatures />
        </div>

      </ScrollArea>
    </div>
  );
}
