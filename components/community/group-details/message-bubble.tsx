/* eslint-disable @next/next/no-img-element */
import { GroupMessage } from '@/types/community';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Paperclip, Download, Play, FileText, Check, CheckCheck, Clock } from 'lucide-react';
import Image from 'next/image';

interface MessageBubbleProps {
  message: GroupMessage;
  isMe: boolean;
}

export function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const isSystem = message.type === 'System';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground font-medium">
          {message.content}
        </span>
      </div>
    );
  }

  const renderStatus = () => {
    if (!isMe) return null;
    switch (message.status) {
      case 'sending': return <Clock className="w-3 h-3 opacity-50" />;
      case 'sent': return <Check className="w-3 h-3 opacity-70" />;
      case 'delivered': return <CheckCheck className="w-3 h-3 opacity-70" />;
      case 'read': return <CheckCheck className="w-3 h-3 text-blue-300 dark:text-blue-400" />;
      default: 
        if (message.readBy && message.readBy.length > 0) return <CheckCheck className="w-3 h-3 text-blue-300 dark:text-blue-400" />;
        return <Check className="w-3 h-3 opacity-70" />;
    }
  };

  return (
    <div className={cn("flex w-full gap-3 max-w-[85%]", isMe ? "ml-auto flex-row-reverse" : "")}>
      {!isMe && (
        <Avatar className="w-8 h-8 shrink-0 border bg-muted/50 mt-auto">
          {message.author.avatarUrl ? (
            <AvatarImage src={message.author.avatarUrl} className="object-cover" />
          ) : (
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {message.author.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      )}

      <div className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
        {!isMe && (
          <span className="text-xs font-medium text-muted-foreground mb-1 ml-1">
            {message.author.name}
            {message.author.role === 'Admin' && <span className="ml-1 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">Admin</span>}
            {message.author.role === 'Faculty' && <span className="ml-1 text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-md">Faculty</span>}
          </span>
        )}

        <div className={cn(
          "rounded-2xl px-4 py-2.5 relative group",
          isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border shadow-sm rounded-bl-sm"
        )}>
          {/* Reply Preview */}
          {message.replyTo && (
            <div className={cn(
              "text-xs p-2 mb-2 rounded-lg border-l-2 opacity-80 line-clamp-1",
              isMe ? "bg-primary-foreground/10 border-primary-foreground/30" : "bg-muted border-primary"
            )}>
              <span className="font-semibold block mb-0.5">{message.replyTo.author.name}</span>
              {message.replyTo.content}
            </div>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-2 space-y-2">
              {message.attachments.map(att => {
                const isImage = att.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(att.name);
                const isVideo = att.type.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(att.name);

                if (isImage) {
                  return (
                    <div key={att.id} className="relative overflow-hidden rounded-lg border bg-black/5 max-w-xs">
                      {/* Standard img tag to easily handle Blob URLs and remote URLs without Next image domain restrictions */}
                      <img
                        src={att.url}
                        alt={att.name}
                        className="max-h-60 w-auto object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => window.open(att.url, '_blank')}
                      />
                    </div>
                  );
                }

                if (isVideo) {
                  return (
                    <div key={att.id} className="relative overflow-hidden rounded-lg border bg-black max-w-xs">
                      <video
                        src={att.url}
                        controls
                        className="max-h-60 w-full rounded-lg"
                      />
                    </div>
                  );
                }

                return (
                  <div key={att.id} className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg border text-sm",
                    isMe ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground" : "bg-muted/50 border-border text-foreground"
                  )}>
                    <div className={cn(
                      "p-2 rounded-md shrink-0 flex items-center justify-center",
                      isMe ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
                    )}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-xs leading-tight">{att.name}</p>
                      <p className={cn("text-[10px] mt-0.5", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {att.size}
                      </p>
                    </div>
                    <a
                      href={att.url}
                      download={att.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "p-1.5 rounded-md hover:bg-black/10 transition-colors shrink-0",
                        isMe ? "text-primary-foreground" : "text-foreground"
                      )}
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* Content */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>

          {/* Time & Read Status */}
          <div className={cn(
            "flex items-center gap-1 text-[10px] mt-1 justify-end",
            isMe ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            {format(new Date(message.createdAt), 'h:mm a')}
            {renderStatus()}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className={cn("flex flex-wrap gap-1 mt-1", isMe ? "justify-end" : "justify-start")}>
            {Object.entries(message.reactions).map(([type, count]) => (
              <span key={type} className="bg-muted border shadow-sm px-1.5 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                {type === 'Like' ? '👍' : type === 'Heart' ? '❤️' : type === 'Laugh' ? '😂' : '😮'}
                <span className="font-medium text-muted-foreground">{count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
