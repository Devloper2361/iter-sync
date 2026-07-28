import { ClubMember, ClubEvent, ClubMedia, Post } from '@/types/community';
import { mockUsers } from './mock-community-db';

export const mockClubMembers: Record<string, ClubMember[]> = {
  'cl1': [
    {
      id: 'm1',
      clubId: 'cl1',
      author: mockUsers['u1'],
      role: 'Owner',
      joinedAt: new Date(Date.now() - 31536000000).toISOString(),
    },
    {
      id: 'm2',
      clubId: 'cl1',
      author: mockUsers['u2'],
      role: 'Committee',
      joinedAt: new Date(Date.now() - 15768000000).toISOString(),
    },
    {
      id: 'm3',
      clubId: 'cl1',
      author: mockUsers['u3'],
      role: 'Member',
      joinedAt: new Date(Date.now() - 864000000).toISOString(),
    }
  ]
};

export const mockClubEvents: Record<string, ClubEvent[]> = {
  'cl1': [
    {
      id: 'e1',
      clubId: 'cl1',
      creator: mockUsers['u1'],
      title: 'Intro to React Workshop',
      description: 'Learn the basics of React and build your first app.',
      startTime: new Date(Date.now() + 86400000 * 2).toISOString(),
      endTime: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString(),
      type: 'Workshop',
      location: 'Lab 3, CS Department',
      isJoinedByMe: true,
      rsvpCount: 45,
    },
    {
      id: 'e2',
      clubId: 'cl1',
      creator: mockUsers['u2'],
      title: 'Annual Hackathon 2024',
      description: 'Join us for a 48-hour coding marathon. Prizes worth $5000!',
      startTime: new Date(Date.now() + 86400000 * 15).toISOString(),
      endTime: new Date(Date.now() + 86400000 * 17).toISOString(),
      type: 'Hackathon',
      location: 'Main Auditorium',
      isJoinedByMe: false,
      rsvpCount: 120,
    }
  ]
};

export const mockClubMedia: Record<string, ClubMedia[]> = {
  'cl1': [
    {
      id: 'med1',
      clubId: 'cl1',
      uploader: mockUsers['u1'],
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80',
      type: 'Image',
      title: 'Hackathon 2023 Winners',
      createdAt: new Date(Date.now() - 31536000000).toISOString(),
    },
    {
      id: 'med2',
      clubId: 'cl1',
      uploader: mockUsers['u2'],
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
      type: 'Image',
      title: 'Team Building Trip',
      createdAt: new Date(Date.now() - 15768000000).toISOString(),
    }
  ]
};

export const mockClubPosts: Record<string, Post[]> = {
  'cl1': [
    {
      id: 'cp1',
      author: mockUsers['u1'],
      title: 'New React Workshop Announced!',
      body: 'Check out our upcoming workshop on React. RSVP on the events tab.',
      images: ['https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80'],
      tags: ['workshop', 'react'],
      category: 'Club Post',
      visibility: 'Everyone',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      likes: 25,
      bookmarks: 5,
      commentsCount: 3,
      shareCount: 2,
      views: 150,
      isLikedByMe: true,
      isBookmarkedByMe: false,
    }
  ]
};
