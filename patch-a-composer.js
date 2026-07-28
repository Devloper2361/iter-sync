const fs = require('fs');
const file = 'components/community/question-details/answer-composer.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "images: images.map(img => img.url),\n      isAccepted: false,\n      isPinned: false,\n      replies: []\n    }, {",
  "images: images.map(img => img.url),\n      isAccepted: false,\n      isPinned: false,\n      replies: [],\n      upvotes: 0\n    }, {"
);

fs.writeFileSync(file, code);
