"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Sparkles, FileText, Zap } from "lucide-react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">ResumeME</div>
          <div className="flex gap-6 items-center">
            <Link href="/pricing" className="text-slate-400 hover:text-white">
              Pricing
            </Link>
            {session ? (
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-slate-400 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your AI-Powered Resume Builder
          </h1>
          <p className="text-2xl text-slate-400 mb-12">
            Create stunning, ATS-optimized resumes in minutes with AI assistance
          </p>
          <div className="flex gap-6 justify-center">
            {session ? (
              <Link
                href="/editor/new"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2"
              >
                Start Building <ArrowRight size={20} />
              </Link>
            ) : (
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2"
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
            )}
            <Link
              href="/pricing"
              className="px-8 py-4 bg-slate-700 text-white text-lg font-semibold rounded-lg hover:bg-slate-600"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-700/50 backdrop-blur p-8 rounded-xl border border-slate-600">
              <Sparkles className="text-yellow-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-3">AI Optimization</h3>
              <p className="text-slate-400">
                Get intelligent suggestions to improve your resume and increase
                your chances of getting hired
              </p>
            </div>
            <div className="bg-slate-700/50 backdrop-blur p-8 rounded-xl border border-slate-600">
              <FileText className="text-blue-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-3">
                Professional Templates
              </h3>
              <p className="text-slate-400">
                Choose from industry-leading templates designed by professionals
              </p>
            </div>
            <div className="bg-slate-700/50 backdrop-blur p-8 rounded-xl border border-slate-600">
              <Zap className="text-emerald-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-3">
                Instant PDF Export
              </h3>
              <p className="text-slate-400">
                Download and share your resume as a beautifully formatted PDF
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur p-16 rounded-2xl border border-blue-500/50 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to land your dream job?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Start building your perfect resume today with ResizeMe
          </p>
          {!session && (
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2"
            >
              Get Started Now <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8 px-8">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <p>© 2026 ResizeMe. All rights reserved.</p>
          <div className="flex gap-6 justify-center mt-4 text-sm">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
