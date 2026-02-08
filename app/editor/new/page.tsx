// app/editor/new/page.tsx
import ResumeEditor from '@/components/editor/ResumeEditor';

export const metadata = {
  title: 'Create Resume - ResumeME',
  description: 'Create a new ATS-optimized resume',
};

export default function NewResumePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-bold text-white">
            Resume<span className="text-purple-400">ME</span>
          </a>
        </div>
      </header>

      <ResumeEditor />
    </div>
  );
}
