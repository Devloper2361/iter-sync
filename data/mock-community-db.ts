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
    visibility: 'Public',
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
    visibility: 'Public',
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
    meetingTime: 'Saturday 10 AM',
    meetingLocation: 'Library Room 3',
    tags: ['OS', 'CS', 'Midterm'],
    isJoinedByMe: false,
  }
];

export const mockClubs: Club[] = [
  {
    id: 'cl1',
    name: 'Coding Club',
    about: 'We build cool stuff and participate in hackathons.',
    facultyAdvisor: 'Dr. John Doe',
    membersCount: 120,
    gallery: [],
    events: [],
    isJoinedByMe: true,
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
