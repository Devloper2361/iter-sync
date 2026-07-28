"use client"
import { useState, useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/use-messages';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Pin, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { MessageBubble } from './message-bubble';
import { ChatComposer } from './chat-composer';
import { getSocket } from '@/lib/socket';

interface DiscussionTabProps {
  groupId: string;
}

export function DiscussionTab({ groupId }: DiscussionTabProps) {
  const { data: messages, isLoading } = useMessages(groupId);
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Small delay to ensure render is complete before scrolling
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    
    const handleTypingStarted = (data: { groupId: string, user: { id: string, name: string } }) => {
      if (data.groupId === groupId && data.user.id !== user?.id) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.add(data.user.name);
          return newSet;
        });
      }
    };
    
    const handleTypingStopped = (data: { groupId: string, user: { id: string, name: string } }) => {
      if (data.groupId === groupId) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.user.name);
          return newSet;
        });
      }
    };

    socket.on('TypingStarted', handleTypingStarted);
    socket.on('TypingStopped', handleTypingStopped);

    return () => {
      socket.off('TypingStarted', handleTypingStarted);
      socket.off('TypingStopped', handleTypingStopped);
    };
  }, [groupId, user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
      
      {/* Pinned Message */}
      <div className="bg-primary/5 border-b px-4 py-3 flex items-start gap-3 shrink-0">
         <Pin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
         <div className="flex-1 min-w-0">
           <p className="text-xs font-semibold text-primary mb-0.5">Pinned Message</p>
           <p className="text-sm text-foreground truncate">Welcome to the study group! Make sure to check the rules in Group Info.</p>
         </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-muted/20 flex flex-col">
        {messages && messages.length > 0 ? (
          messages.map(message => (
             <MessageBubble
                key={message.id}
                message={message}
                isMe={user?.id === message.author.id}
              />
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center">
            <MessageSquare className="w-12 h-12 mb-4 text-muted/50" />
            <p className="font-medium">No messages yet</p>
            <p className="text-sm mt-1 mb-4">Start the conversation!</p>
          </div>
        )}
        
        {typingUsers.size > 0 && (
          <div className="text-xs text-muted-foreground italic flex items-center gap-1.5 ml-2">
            <div className="flex gap-0.5 items-center bg-muted/50 px-2 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="p-4 bg-background border-t shrink-0">
        <ChatComposer groupId={groupId} />
      </div>
    </div>
  );
}
