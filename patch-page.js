const fs = require('fs');
const file = 'app/(main)/community/question/[id]/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// Import the sidebar
code = code.replace(
  "import { useState } from 'react';",
  "import { useState } from 'react';\nimport { DiscussionSidebar } from '@/components/community/post-details/discussion-sidebar';"
);

// Wrap main content and sidebar in a flex/grid layout
code = code.replace(
  "    <div className=\"max-w-4xl mx-auto py-6 px-4 space-y-8 animate-in fade-in duration-500\">\n      <div className=\"flex items-center gap-2 mb-2\">",
  `    <div className="max-w-7xl mx-auto py-6 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-8">
          <div className="flex items-center gap-2 mb-2">`
);

// Close the flex/grid tags
code = code.replace(
  "      <AnswerComposer questionId={question.id} />\n    </div>\n  );\n}",
  `      <AnswerComposer questionId={question.id} />
        </div>
        <div className="w-full lg:w-80 shrink-0 mt-12 lg:mt-0">
          <DiscussionSidebar />
        </div>
      </div>
    </div>
  );
}`
);

fs.writeFileSync(file, code);
