export type Author = {
  id: string;
  name: string;
  avatarUrl?: string;
  department?: string;
  semester?: number;
  role: 'Student' | 'Faculty' | 'Admin';
};

export type ReactionType = 'Like' | 'Love' | 'Celebrate' | 'Insightful' | 'Funny' | 'Confused';

export interface ReactionCounts {
  [key: string]: number;
}

export type PostCategory = 'Announcement' | 'Student Post' | 'Question' | 'Club Post' | 'Study Group' | 'Trending';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Attachment {
  id: string;
  name: string;
  size: string;
  url: string;
  type: string;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  images?: string[];
  attachments?: Attachment[];
  tags: string[];
  category: PostCategory;
  visibility: 'Everyone' | 'Department' | 'Connections' | 'Private Draft';
  createdAt: string;
  likes: number;
  reactions?: ReactionCounts;
  myReaction?: ReactionType;
  bookmarks: number;
  commentsCount: number;
  shareCount: number;
  views: number;
  isLikedByMe?: boolean;
  isBookmarkedByMe?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  content: string;
  createdAt: string;
  likes: number;
  reactions?: ReactionCounts;
  myReaction?: ReactionType;
  isLikedByMe?: boolean;
  replies: Comment[];
}

export interface Question {
  id: string;
  author: Author;
  title: string;
  body: string;
  difficulty?: Difficulty;
  images?: string[];
  attachments?: Attachment[];
  isAnonymous?: boolean;
  updatedAt?: string;
  subject?: string;
  department?: string;
  semester?: number;
  tags: string[];
  createdAt: string;
  upvotes: number;
  downvotes?: number;
  answersCount: number;
  views: number;
  bookmarks?: number;
  followers?: number;
  shareCount?: number;
  isUpvotedByMe?: boolean;
  isDownvotedByMe?: boolean;
  isBookmarkedByMe?: boolean;
  isFollowedByMe?: boolean;
}

export interface Answer {
  id: string;
  questionId: string;
  author: Author;
  body: string;
  images?: string[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt?: string;
  upvotes: number;
  downvotes?: number;
  isAccepted: boolean;
  isPinned: boolean;
  isUpvotedByMe?: boolean;
  isDownvotedByMe?: boolean;
  replies: Comment[];
}

export interface GroupMessage {
  id: string;
  groupId: string;
  author: Author;
  content: string;
  type: 'Text' | 'Image' | 'PDF' | 'Voice' | 'Code' | 'System' | 'File';
  attachments?: Attachment[];
  replyTo?: GroupMessage;
  reactions?: ReactionCounts;
  myReaction?: ReactionType;
  isPinned?: boolean;
  isAnnouncement?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  readBy?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creator: Author;
  department?: string;
  semester?: number;
  subject?: string;
  facultyMentor?: Author;
  privacy: 'Public' | 'Private' | 'Invite Only';
  bannerUrl?: string;
  avatarUrl?: string;
  membersCount: number;
  tags: string[];
  isJoinedByMe?: boolean;
  createdAt?: string;
  lastMessage?: GroupMessage;
  lastActivity?: string;
  unreadCount?: number;
  isPinned?: boolean;
  rules?: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  author: Author;
  role: 'Owner' | 'Admin' | 'Member';
  joinedAt: string;
}

export interface GroupResource {
  id: string;
  groupId: string;
  uploader: Author;
  title: string;
  type: 'PDF' | 'Slides' | 'Notes' | 'Assignment' | 'Link' | 'Folder';
  url?: string;
  size?: string;
  createdAt: string;
  folderId?: string;
}

export interface GroupTask {
  id: string;
  groupId: string;
  creator: Author;
  assignee?: Author;
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'InProgress' | 'Completed';
  createdAt: string;
}

export interface GroupEvent {
  id: string;
  groupId: string;
  creator: Author;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: 'Study Session' | 'Meeting' | 'Deadline';
  location?: string;
  isJoinedByMe?: boolean;
}

export interface Club {
  id: string;
  name: string;
  about: string;
  category: string;
  facultyAdvisor: Author;
  president?: Author;
  vicePresident?: Author;
  membersCount: number;
  foundedYear: number;
  status: 'Active' | 'Inactive';
  bannerUrl?: string;
  logoUrl?: string;
  isJoinedByMe?: boolean;
  isFollowedByMe?: boolean;
}

export interface ClubMember {
  id: string;
  clubId: string;
  author: Author;
  role: 'Owner' | 'Committee' | 'Volunteer' | 'Member';
  joinedAt: string;
}

export interface ClubEvent {
  id: string;
  clubId: string;
  creator: Author;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: 'Workshop' | 'Hackathon' | 'Seminar' | 'Social' | 'Other';
  location?: string;
  isJoinedByMe?: boolean;
  rsvpCount: number;
}

export interface ClubMedia {
  id: string;
  clubId: string;
  uploader: Author;
  url: string;
  type: 'Image' | 'Video';
  title: string;
  createdAt: string;
}

export interface CommunityNotification {
  id: string;
  type: 'Like' | 'Reply' | 'Mention' | 'GroupInvite' | 'ClubUpdate' | 'NewResource' | 'TaskAssigned' | 'MeetingReminder';
  content: string;
  isRead: boolean;
  createdAt: string;
  linkId?: string;
}

export interface DirectConversation {
  id: string;
  participants: string[];
}
