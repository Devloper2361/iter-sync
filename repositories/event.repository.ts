import { ClubEvent } from '@/types/community';
import { mockClubEvents } from '@/data/mock-clubs-db';

export class EventRepository {
  async getClubEvents(clubId: string): Promise<ClubEvent[]> {
    await new Promise(r => setTimeout(r, 300));
    return mockClubEvents[clubId] || [];
  }

  async createEvent(event: Omit<ClubEvent, 'id' | 'rsvpCount'>): Promise<ClubEvent> {
    await new Promise(r => setTimeout(r, 400));
    const newEvent: ClubEvent = {
      ...event,
      id: `e${Date.now()}`,
      rsvpCount: 0,
      isJoinedByMe: false,
    };
    if (!mockClubEvents[event.clubId]) {
      mockClubEvents[event.clubId] = [];
    }
    mockClubEvents[event.clubId].unshift(newEvent);
    return newEvent;
  }

  async updateEvent(id: string, updates: Partial<ClubEvent>): Promise<ClubEvent> {
    await new Promise(r => setTimeout(r, 400));
    for (const clubId in mockClubEvents) {
      const index = mockClubEvents[clubId].findIndex(e => e.id === id);
      if (index !== -1) {
        mockClubEvents[clubId][index] = { ...mockClubEvents[clubId][index], ...updates };
        return mockClubEvents[clubId][index];
      }
    }
    throw new Error('Event not found');
  }

  async deleteEvent(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 400));
    for (const clubId in mockClubEvents) {
      const index = mockClubEvents[clubId].findIndex(e => e.id === id);
      if (index !== -1) {
        mockClubEvents[clubId].splice(index, 1);
        return;
      }
    }
  }

  async rsvpEvent(id: string): Promise<ClubEvent> {
    await new Promise(r => setTimeout(r, 300));
    for (const clubId in mockClubEvents) {
      const event = mockClubEvents[clubId].find(e => e.id === id);
      if (event && !event.isJoinedByMe) {
        event.isJoinedByMe = true;
        event.rsvpCount += 1;
        return event;
      }
    }
    throw new Error('Event not found or already RSVPed');
  }

  async cancelRsvp(id: string): Promise<ClubEvent> {
    await new Promise(r => setTimeout(r, 300));
    for (const clubId in mockClubEvents) {
      const event = mockClubEvents[clubId].find(e => e.id === id);
      if (event && event.isJoinedByMe) {
        event.isJoinedByMe = false;
        event.rsvpCount -= 1;
        return event;
      }
    }
    throw new Error('Event not found or not RSVPed');
  }
}

export const eventRepository = new EventRepository();
