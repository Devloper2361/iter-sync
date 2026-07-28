const fs = require('fs');
const file = 'data/mock-community-db.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "    meetingTime: 'Saturday 10 AM',\n    meetingLocation: 'Library Room 3',\n    tags: ['OS', 'CS', 'Midterm'],\n    isJoinedByMe: false,",
  `    department: 'Computer Science',
    semester: 5,
    subject: 'Operating Systems',
    privacy: 'Public',
    bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80',
    tags: ['OS', 'CS', 'Midterm'],
    isJoinedByMe: true,
    createdAt: new Date(Date.now() - 1000000000).toISOString(),`
);

fs.writeFileSync(file, code);
