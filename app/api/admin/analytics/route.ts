import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// Mark this route as dynamic
export const dynamic = "force-dynamic";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get total stats
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id");

    const { data: resumes, error: resumesError } = await supabase
      .from("resumes")
      .select("id");

    const { data: subscriptions, error: subsError } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("status", "active");

    const { data: invoices, error: invoicesError } = await supabase
      .from("invoices")
      .select("amount")
      .eq("status", "paid");

    if (usersError || resumesError || subsError || invoicesError) {
      throw new Error("Failed to fetch stats");
    }

    const totalRevenue =
      invoices?.reduce(
        (sum, inv) => sum + (inv.amount || 0),
        0
      ) / 100 || 0;

    const planBreakdown = subscriptions?.reduce(
      (acc: Record<string, number>, sub) => {
        acc[sub.plan] = (acc[sub.plan] || 0) + 1;
        return acc;
      },
      {}
    ) || {};

    return NextResponse.json({
      stats: {
        totalUsers: users?.length || 0,
        totalResumes: resumes?.length || 0,
        activeSubscriptions: subscriptions?.length || 0,
        totalRevenue: totalRevenue.toFixed(2),
        planBreakdown,
      },
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
