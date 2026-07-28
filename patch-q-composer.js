const fs = require('fs');
const file = 'components/community/question-composer/index.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "images: images.map(img => img.url),\n      attachments,\n      isAnonymous\n    }, {",
  "images: images.map(img => img.url),\n      attachments,\n      isAnonymous,\n      views: 0,\n      upvotes: 0,\n      answersCount: 0\n    }, {"
);

fs.writeFileSync(file, code);
