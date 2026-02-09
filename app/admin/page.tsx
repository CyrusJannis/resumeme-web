"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Stats {
  totalUsers: number;
  totalResumes: number;
  activeSubscriptions: number;
  totalRevenue: string;
  planBreakdown: Record<string, number>;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      loadStats();
    }
  }, [status]);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const { stats } = await response.json();
        setStats(stats);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">System analytics and management</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
                <p className="text-slate-400 text-sm">Total Resumes</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">
                  {stats.totalResumes}
                </p>
              </div>
              <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
                <p className="text-slate-400 text-sm">Active Subscriptions</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">
                  {stats.activeSubscriptions}
                </p>
              </div>
              <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
                <p className="text-slate-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">
                  ${stats.totalRevenue}
                </p>
              </div>
            </div>

            {/* Plan Breakdown */}
            <div className="bg-slate-700/50 backdrop-blur p-8 rounded-xl border border-slate-600">
              <h2 className="text-2xl font-bold text-white mb-6">
                Subscription Plans
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {Object.entries(stats.planBreakdown).map(([plan, count]) => (
                  <div
                    key={plan}
                    className="bg-slate-800/50 p-6 rounded-lg border border-slate-600"
                  >
                    <p className="text-slate-400 text-sm capitalize">{plan}</p>
                    <p className="text-2xl font-bold text-white mt-2">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
