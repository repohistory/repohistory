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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <ReactMarkdown>
              {privacyContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
