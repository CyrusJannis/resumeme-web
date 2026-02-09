"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Resume {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResumes: 0,
    lastUpdated: null as string | null,
  });

  useEffect(() => {
    if (status === "authenticated") {
      loadResumes();
    }
  }, [status]);

  const loadResumes = async () => {
    try {
      const response = await fetch("/api/resumes");
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
        setStats({
          totalResumes: data.length,
          lastUpdated: data[0]?.updated_at || null,
        });
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Please log in</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">
            Welcome, {session?.user?.name || "User"}!
          </h1>
          <p className="text-slate-400">Manage your resumes and subscriptions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
            <p className="text-slate-400 text-sm">Total Resumes</p>
            <p className="text-4xl font-bold text-white mt-2">
              {stats.totalResumes}
            </p>
          </div>
          <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
            <p className="text-slate-400 text-sm">Status</p>
            <p className="text-xl font-bold text-emerald-400 mt-2">Active</p>
          </div>
          <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
            <p className="text-slate-400 text-sm">Plan</p>
            <p className="text-xl font-bold text-blue-400 mt-2">Pro</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-12">
          <Link
            href="/editor/new"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            + Create New Resume
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 font-semibold"
          >
            Upgrade Plan
          </Link>
        </div>

        {/* Resumes List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Resumes</h2>
          {resumes.length === 0 ? (
            <div className="bg-slate-700/50 backdrop-blur p-12 rounded-xl border border-slate-600 text-center">
              <p className="text-slate-400 mb-6">No resumes yet</p>
              <Link
                href="/editor/new"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Resume
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600 hover:border-blue-500 transition cursor-pointer group"
                >
                  <Link href={`/editor/${resume.id}`}>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                      {resume.title}
                    </h3>
                  </Link>
                  <p className="text-slate-400 text-sm mt-2">
                    Updated{" "}
                    {new Date(resume.updated_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Link
                      href={`/editor/${resume.id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                    <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
                      Export PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
