import { Post, Comment, Question, Answer, StudyGroup, Club, CommunityNotification, Author } from '@/types/community';

export const mockUsers: Record<string, Author> = {
  u1: { id: 'u1', name: 'Alice Smith', role: 'Student', department: 'Computer Science', semester: 5 },
  u2: { id: 'u2', name: 'Bob Jones', role: 'Student', department: 'Electrical', semester: 3 },
  u3: { id: 'u3', name: 'Dr. John Doe', role: 'Faculty', department: 'Computer Science' },
};

export const mockPosts: Post[] = [
  {
    id: 'p1',
    author: mockUsers['u3'],
    title: 'Welcome to the New Semester!',
    body: 'We are excited to welcome everyone back to campus. Please make sure to check your schedules.',
    images: [],
    tags: ['welcome', 'announcement'],
    category: 'Announcement',
    visibility: 'Everyone',
    createdAt: new Date(Date.now() - 100000).toISOString(),
    likes: 45,
    bookmarks: 12,
    commentsCount: 2,
    shareCount: 5,
    views: 300,
    isLikedByMe: false,
    isBookmarkedByMe: false,
  },
  {
    id: 'p2',
    author: mockUsers['u1'],
    title: 'Looking for a study group for OS',
    body: 'Hey guys, anyone want to form a study group for Operating Systems? I am free on weekends.',
    images: [],
    tags: ['study', 'os', 'cs'],
    category: 'Student Post',
    visibility: 'Everyone',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likes: 12,
    bookmarks: 3,
    commentsCount: 1,
    shareCount: 0,
    views: 150,
    isLikedByMe: true,
    isBookmarkedByMe: false,
  }
];

export const mockComments: Record<string, Comment[]> = {
  'p1': [
    {
      id: 'c1',
      postId: 'p1',
      author: mockUsers['u1'],
      content: 'Looking forward to it!',
      createdAt: new Date(Date.now() - 50000).toISOString(),
      likes: 2,
      isLikedByMe: false,
      replies: [
        {
          id: 'c2',
          postId: 'p1',
          author: mockUsers['u2'],
          content: 'Same here!',
          createdAt: new Date(Date.now() - 20000).toISOString(),
          likes: 1,
          replies: []
        }
      ]
    }
  ],
  'p2': [
    {
      id: 'c3',
      postId: 'p2',
      author: mockUsers['u2'],
      content: 'I am interested! DM me.',
      createdAt: new Date(Date.now() - 10000).toISOString(),
      likes: 0,
      replies: []
    }
  ]
};

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    author: mockUsers['u2'],
    title: 'How to traverse a Binary Tree?',
    body: 'I am struggling with inorder traversal. Can someone explain it simply?',
    subject: 'Data Structures',
    department: 'Computer Science',
    semester: 3,
    tags: ['dsa', 'trees', 'help'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    upvotes: 15,
    answersCount: 1,
    views: 200,
  }
];

export const mockAnswers: Record<string, Answer[]> = {
  'q1': [
    {
      id: 'a1',
      questionId: 'q1',
      author: mockUsers['u1'],
      body: 'Inorder traversal is Left -> Root -> Right. So you recursively visit the left child, then print the current node, then recursively visit the right child.',
      createdAt: new Date(Date.now() - 40000000).toISOString(),
      upvotes: 20,
      isAccepted: true,
      isPinned: false,
      replies: []
    }
  ]
};

export const mockStudyGroups: StudyGroup[] = [
  {
    id: 'g1',
    name: 'OS Midterm Prep',
    description: 'Preparing for the upcoming OS midterm. All CS students welcome.',
    creator: mockUsers['u1'],
    membersCount: 5,
    department: 'Computer Science',
    semester: 5,
    subject: 'Operating Systems',
    privacy: 'Public',
    bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80',
    tags: ['OS', 'CS', 'Midterm'],
    isJoinedByMe: true,
    createdAt: new Date(Date.now() - 1000000000).toISOString(),
    lastActivity: new Date(Date.now() - 1800000).toISOString(),
    unreadCount: 3,
    isPinned: true,
    lastMessage: {
      id: 'm5',
      groupId: 'g1',
      author: mockUsers['u2'],
      content: 'Just created a task for everyone to review past papers. Please check it out!',
      type: 'System',
      isAnnouncement: true,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    }
  },
  {
    id: 'g2',
    name: 'Web Dev Bootcamp',
    description: 'React, Next.js, and Tailwind CSS learning group.',
    creator: mockUsers['u2'],
    membersCount: 12,
    department: 'Computer Science',
    semester: 4,
    subject: 'Web Technologies',
    privacy: 'Invite Only',
    avatarUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80',
    tags: ['React', 'NextJS'],
    isJoinedByMe: false,
    createdAt: new Date(Date.now() - 2000000000).toISOString(),
    lastActivity: new Date(Date.now() - 50000000).toISOString(),
    unreadCount: 0,
    isPinned: false,
    lastMessage: {
      id: 'm10',
      groupId: 'g2',
      author: mockUsers['u3'],
      content: 'Can someone share the link to the Tailwind docs?',
      type: 'Text',
      createdAt: new Date(Date.now() - 50000000).toISOString(),
    }
  }
];

export const mockClubs: Club[] = [
  {
    id: 'cl1',
    name: 'Coding Club',
    about: 'We build cool stuff and participate in hackathons.',
    category: 'Technology',
    facultyAdvisor: mockUsers['u3'],
    president: mockUsers['u1'],
    vicePresident: mockUsers['u2'],
    membersCount: 120,
    foundedYear: 2018,
    status: 'Active',
    bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80',
    isJoinedByMe: true,
    isFollowedByMe: true,
  }
];

export const mockNotifications: CommunityNotification[] = [
  {
    id: 'n1',
    type: 'Like',
    content: 'Alice liked your post.',
    isRead: false,
    createdAt: new Date().toISOString(),
    linkId: 'p2'
  }
];
