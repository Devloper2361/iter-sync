const fs = require('fs');
const path = 'app/(main)/marketplace/listing/[id]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { useAuth } from '@/hooks/use-auth';\nimport { ArrowLeft",
  "import { useAuth } from '@/hooks/use-auth';\nimport { useDirectConversation } from '@/hooks/use-conversation';\nimport { ArrowLeft"
);

content = content.replace(
  "const reportListing = useReportListing();\n  const [editDialogOpen",
  "const reportListing = useReportListing();\n  const directConversation = useDirectConversation();\n  const [editDialogOpen"
);

content = content.replace(
  "const handleChatSeller = () => {\n    router.push('/community/group/g1');\n  };",
  `const handleChatSeller = () => {
    if (!listing) return;
    directConversation.mutate(
      { currentUserId, sellerId: listing.seller.id },
      {
        onSuccess: (conversation) => {
          router.push(\`/community/messages/\${conversation.id}\`);
        },
        onError: () => {
          toast.error("Failed to open chat with seller.");
        }
      }
    );
  };`
);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched!");
