const fs = require('fs');
let types = fs.readFileSync('types/community.ts', 'utf8');

// Update Question type
types = types.replace(
  "export interface Question {",
  "export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';\n\nexport interface Attachment {\n  id: string;\n  name: string;\n  size: string;\n  url: string;\n  type: string;\n}\n\nexport interface Question {"
);

types = types.replace(
  "body: string;",
  "body: string;\n  difficulty?: Difficulty;\n  images?: string[];\n  attachments?: Attachment[];\n  isAnonymous?: boolean;\n  updatedAt?: string;"
);

types = types.replace(
  "upvotes: number;\n  answersCount: number;\n  views: number;\n  isUpvotedByMe?: boolean;",
  "upvotes: number;\n  downvotes?: number;\n  answersCount: number;\n  views: number;\n  bookmarks?: number;\n  followers?: number;\n  shareCount?: number;\n  isUpvotedByMe?: boolean;\n  isDownvotedByMe?: boolean;\n  isBookmarkedByMe?: boolean;\n  isFollowedByMe?: boolean;"
);

// Update Answer type
types = types.replace(
  "body: string;",
  "body: string;\n  images?: string[];\n  attachments?: Attachment[];\n  updatedAt?: string;"
);

types = types.replace(
  "upvotes: number;",
  "upvotes: number;\n  downvotes?: number;\n  isDownvotedByMe?: boolean;"
);

fs.writeFileSync('types/community.ts', types);
