export type Author = {
  id: string;
  name: string;
  avatarUrl?: string;
  department?: string;
  semester?: number;
  role: 'Student' | 'Faculty' | 'Admin';
};

export type PostCategory = 'Announcement' | 'Student Post' | 'Question' | 'Club Post' | 'Study Group' | 'Trending';

export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  images: string[];
  tags: string[];
  category: PostCategory;
  visibility: 'Public' | 'Department' | 'Connections';
  createdAt: string;
  likes: number;
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
  isLikedByMe?: boolean;
  replies: Comment[];
}

export interface Question {
  id: string;
  author: Author;
  title: string;
  body: string;
  subject?: string;
  department?: string;
  semester?: number;
  tags: string[];
  createdAt: string;
  upvotes: number;
  answersCount: number;
  views: number;
  isUpvotedByMe?: boolean;
}

export interface Answer {
  id: string;
  questionId: string;
  author: Author;
  body: string;
  createdAt: string;
  upvotes: number;
  isAccepted: boolean;
  isPinned: boolean;
  isUpvotedByMe?: boolean;
  replies: Comment[];
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creator: Author;
  membersCount: number;
  meetingTime?: string;
  meetingLocation?: string;
  tags: string[];
  isJoinedByMe?: boolean;
}

export interface Club {
  id: string;
  name: string;
  about: string;
  facultyAdvisor: string;
  membersCount: number;
  gallery: string[];
  events: any[]; // simplify for now
  isJoinedByMe?: boolean;
}

export interface CommunityNotification {
  id: string;
  type: 'Like' | 'Reply' | 'Mention' | 'GroupInvite' | 'ClubUpdate';
  content: string;
  isRead: boolean;
  createdAt: string;
  linkId?: string;
}
