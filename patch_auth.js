const fs = require('fs');

// Patch Login
const loginPath = 'app/(auth)/login/page.tsx';
let loginContent = fs.readFileSync(loginPath, 'utf8');

loginContent = loginContent.replace(
  "  const [isClient, setIsClient] = useState(false);\n  useEffect(() => setIsClient(true), []);\n\n",
  ""
);
loginContent = loginContent.replace(
  "  useEffect(() => {\n    if (isClient && isAuthenticated) {\n      router.push('/dashboard');\n    }\n  }, [isClient, isAuthenticated, router]);",
  "  useEffect(() => {\n    if (isAuthenticated) {\n      router.push('/dashboard');\n    }\n  }, [isAuthenticated, router]);"
);
loginContent = loginContent.replace(
  "  if (!isClient) return null;\n\n",
  ""
);

fs.writeFileSync(loginPath, loginContent, 'utf8');

// Patch AuthGuard
const guardPath = 'components/shared/auth-guard.tsx';
let guardContent = fs.readFileSync(guardPath, 'utf8');

guardContent = guardContent.replace(
  "  if (!isClient) {\n    return <div className=\"min-h-screen flex items-center justify-center bg-background\"><p>Loading...</p></div>;\n  }\n\n  if (!isAuthenticated || !user) {\n    return <div className=\"min-h-screen flex items-center justify-center bg-background\"><p>Redirecting...</p></div>;\n  }",
  "  if (!isClient) {\n    return null;\n  }\n\n  if (!isAuthenticated || !user) {\n    return null;\n  }"
);

fs.writeFileSync(guardPath, guardContent, 'utf8');
console.log("Patched!");
