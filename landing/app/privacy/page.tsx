import { promises as fs } from 'fs';
import { join } from 'path';
import ReactMarkdown from 'react-markdown';

export const metadata = {
  title: "Privacy Policy | Repohistory"
};

export default async function PrivacyPage() {
  const privacyContent = await fs.readFile(
    join(process.cwd(), 'privacy.md'),
    'utf8'
  );

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-32 max-w-2xl prose prose-gray dark:prose-invert">
      <ReactMarkdown>
        {privacyContent}
      </ReactMarkdown>
    </div>
  );
}
