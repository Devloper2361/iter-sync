import { eventRepository } from '@/repositories/event.repository';
import { ClubEvent } from '@/types/community';

export class EventService {
  async getClubEvents(clubId: string) {
    return eventRepository.getClubEvents(clubId);
  }

  async createEvent(event: Omit<ClubEvent, 'id' | 'rsvpCount'>) {
    return eventRepository.createEvent(event);
  }

  async updateEvent(id: string, updates: Partial<ClubEvent>) {
    return eventRepository.updateEvent(id, updates);
  }

  async deleteEvent(id: string) {
    return eventRepository.deleteEvent(id);
  }

  async rsvpEvent(id: string) {
    return eventRepository.rsvpEvent(id);
  }

  async cancelRsvp(id: string) {
    return eventRepository.cancelRsvp(id);
  }
}

export const eventService = new EventService();
