import { GroupMember, GroupResource, GroupTask, GroupEvent, GroupMessage } from '@/types/community';
import { mockUsers } from './mock-community-db';

export const mockGroupMembers: Record<string, GroupMember[]> = {
  'g1': [
    { id: 'gm1', groupId: 'g1', author: mockUsers['u1'], role: 'Owner', joinedAt: new Date(Date.now() - 864000000).toISOString() },
    { id: 'gm2', groupId: 'g1', author: mockUsers['u2'], role: 'Admin', joinedAt: new Date(Date.now() - 500000000).toISOString() },
    { id: 'gm3', groupId: 'g1', author: mockUsers['u3'], role: 'Member', joinedAt: new Date(Date.now() - 200000000).toISOString() },
  ]
};

export const mockGroupResources: Record<string, GroupResource[]> = {
  'g1': [
    { id: 'res1', groupId: 'g1', uploader: mockUsers['u1'], title: 'Chapter 1-4 Summary', type: 'PDF', size: '2.4 MB', createdAt: new Date(Date.now() - 100000).toISOString() },
    { id: 'res2', groupId: 'g1', uploader: mockUsers['u2'], title: 'Lecture Slides', type: 'Slides', size: '15 MB', createdAt: new Date(Date.now() - 200000).toISOString() },
  ]
};

export const mockGroupTasks: Record<string, GroupTask[]> = {
  'g1': [
    { id: 'task1', groupId: 'g1', creator: mockUsers['u1'], assignee: mockUsers['u2'], title: 'Create Flashcards', description: 'Make flashcards for Chapter 5', dueDate: new Date(Date.now() + 86400000).toISOString(), priority: 'High', status: 'InProgress', createdAt: new Date().toISOString() },
    { id: 'task2', groupId: 'g1', creator: mockUsers['u2'], title: 'Review past papers', description: 'Go through 2023 OS paper', dueDate: new Date(Date.now() + 172800000).toISOString(), priority: 'Medium', status: 'Todo', createdAt: new Date().toISOString() },
  ]
};

export const mockGroupEvents: Record<string, GroupEvent[]> = {
  'g1': [
    { id: 'ev1', groupId: 'g1', creator: mockUsers['u1'], title: 'OS Midterm Group Study', description: 'Review session before midterm', startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 90000000).toISOString(), type: 'Study Session', location: 'Library Room 3', isJoinedByMe: true },
  ]
};

export const mockGroupMessages: Record<string, GroupMessage[]> = {
  'g1': [
    {
      id: 'm1',
      groupId: 'g1',
      author: mockUsers['u1'],
      content: 'Hey everyone, welcome to the OS study group!',
      type: 'Text',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'm2',
      groupId: 'g1',
      author: mockUsers['u2'],
      content: 'Thanks! Did anyone get the notes from yesterday?',
      type: 'Text',
      createdAt: new Date(Date.now() - 86000000).toISOString(),
    },
    {
      id: 'm3',
      groupId: 'g1',
      author: mockUsers['u3'],
      content: 'I have them, I will share them in the resources tab.',
      type: 'Text',
      replyTo: {
        id: 'm2',
        groupId: 'g1',
        author: mockUsers['u2'],
        content: 'Thanks! Did anyone get the notes from yesterday?',
        type: 'Text',
        createdAt: new Date(Date.now() - 86000000).toISOString(),
      },
      createdAt: new Date(Date.now() - 85000000).toISOString(),
      reactions: { 'Like': 2, 'Heart': 1 },
    },
    {
      id: 'm4',
      groupId: 'g1',
      author: mockUsers['u1'],
      content: 'I also found this great video explaining Deadlocks.',
      type: 'Text',
      attachments: [{ id: 'a1', name: 'deadlocks.mp4', size: '15MB', url: 'https://example.com/deadlocks', type: 'video/mp4' }],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'm5',
      groupId: 'g1',
      author: mockUsers['u2'],
      content: 'Just created a task for everyone to review past papers. Please check it out!',
      type: 'System',
      isAnnouncement: true,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    }
  ]
};
