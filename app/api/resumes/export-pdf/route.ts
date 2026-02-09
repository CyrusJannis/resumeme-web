import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { resumeId } = await req.json();

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID required" },
        { status: 400 }
      );
    }

    // Verify subscription (PDF export requires Pro+)
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (!subscription || subscription.plan === "free") {
      return NextResponse.json(
        { error: "Premium feature - upgrade to Pro plan" },
        { status: 403 }
      );
    }

    // Get resume
    const { data: resume } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resumeId)
      .eq("user_id", session.user.id)
      .single();

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    // For MVP: Generate PDF server-side or use client-side library
    // This is a placeholder that returns the resume data
    // In production, use html2pdf, puppeteer, or jsPDF

    const pdfUrl = `${process.env.NEXTAUTH_URL}/api/resumes/${resumeId}/pdf`;

    // Log action
    await supabase.from("audit_logs").insert({
      user_id: session.user.id,
      action: "EXPORT_PDF",
      entity_type: "resume",
      entity_id: resumeId,
      changes: { title: resume.title },
    });

    return NextResponse.json({
      pdfUrl,
      title: `${resume.title}.pdf`,
      resumeId,
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "PDF export failed" },
      { status: 500 }
    );
  }
}
