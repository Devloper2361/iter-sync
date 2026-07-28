export type PostType = 'General Post' | 'Question' | 'Announcement' | 'Poll' | 'Event' | 'Study Group Update' | 'Club Update' | 'Marketplace Share';

export type VisibilityType = 'Everyone' | 'Department' | 'Semester' | 'Club' | 'Study Group' | 'Private Draft';

export interface PostDraft {
  id: string;
  title: string;
  content: string;
  type: PostType;
  visibility: VisibilityType;
  tags: string[];
  images: string[];
  updatedAt: string;
}

export interface ImageFile {
  id: string;
  url: string;
  file?: File;
  progress: number;
}
