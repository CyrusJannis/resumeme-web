// app/dashboard/page.tsx
'use client';

import { useAuth } from '@/lib/auth/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Resume<span className="text-purple-400">ME</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-slate-400 text-lg">
            Your current plan: <span className="text-purple-400 font-semibold uppercase">{user?.plan}</span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* New Resume */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition cursor-pointer">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-white mb-2">Create Resume</h3>
            <p className="text-slate-400 text-sm mb-4">
              Start building your perfect resume with our AI-powered editor
            </p>
            <Link
              href="/editor/new"
              className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              Create New
            </Link>
          </div>

          {/* Upload Resume */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition cursor-pointer">
            <div className="text-4xl mb-4">⬆️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Upload Resume</h3>
            <p className="text-slate-400 text-sm mb-4">
              Import your existing resume and let AI optimize it
            </p>
            <Link
              href="/editor/upload"
              className="inline-block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition"
            >
              Upload
            </Link>
          </div>

          {/* Upgrade Plan */}
          {user?.plan === 'free' && (
            <div className="bg-gradient-to-br from-purple-900/50 to-cyan-900/50 border border-purple-500/50 rounded-lg p-6 hover:shadow-lg hover:shadow-purple-500/20 transition cursor-pointer">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">Upgrade Plan</h3>
              <p className="text-slate-300 text-sm mb-4">
                Unlock unlimited resumes and premium features
              </p>
              <Link
                href="/pricing"
                className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-lg transition"
              >
                View Plans
              </Link>
            </div>
          )}
        </div>

        {/* Your Resumes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Resumes</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-slate-400 mb-4">No resumes yet</p>
            <p className="text-slate-500 text-sm">
              Create your first resume to get started
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
