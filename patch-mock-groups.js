const fs = require('fs');
let file = fs.readFileSync('data/mock-community-db.ts', 'utf8');

file = file.replace(/export const mockStudyGroups: StudyGroup\[\] = \[\s*\{\s*id: 'g1',[\s\S]*?\}\s*\];/, `export const mockStudyGroups: StudyGroup[] = [
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
];`);

fs.writeFileSync('data/mock-community-db.ts', file);
