import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const resumeSchema = z.object({
  title: z.string().min(1),
  content: z.any(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("id");

    if (resumeId) {
      // Get single resume
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .eq("user_id", session.user.id)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: "Resume not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    } else {
      // Get all user's resumes
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      return NextResponse.json(data || []);
    }
  } catch (error) {
    console.error("Resume GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content } = resumeSchema.parse(body);

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: session.user.id,
        title,
        content,
        status: "draft",
        version: 1,
      })
      .select()
      .single();

    if (error) throw error;

    // Log action
    await supabase.from("audit_logs").insert({
      user_id: session.user.id,
      action: "CREATE_RESUME",
      entity_type: "resume",
      entity_id: data.id,
      changes: { title },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Resume POST error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("id");

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, content } = resumeSchema.parse(body);

    // Verify ownership
    const { data: resume } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resumeId)
      .eq("user_id", session.user.id)
      .single();

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found or unauthorized" },
        { status: 404 }
      );
    }

    // Create version history
    await supabase.from("resume_versions").insert({
      resume_id: resumeId,
      version_number: resume.version,
      content: resume.content,
      created_by: session.user.id,
    });

    // Update resume
    const { data, error } = await supabase
      .from("resumes")
      .update({
        title,
        content,
        version: resume.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", resumeId)
      .select()
      .single();

    if (error) throw error;

    // Log action
    await supabase.from("audit_logs").insert({
      user_id: session.user.id,
      action: "UPDATE_RESUME",
      entity_type: "resume",
      entity_id: resumeId,
      changes: { title, version: resume.version + 1 },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Resume PUT error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("id");

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: resume } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resumeId)
      .eq("user_id", session.user.id)
      .single();

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found or unauthorized" },
        { status: 404 }
      );
    }

    // Soft delete
    const { error } = await supabase
      .from("resumes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", resumeId);

    if (error) throw error;

    // Log action
    await supabase.from("audit_logs").insert({
      user_id: session.user.id,
      action: "DELETE_RESUME",
      entity_type: "resume",
      entity_id: resumeId,
      changes: {},
    });

    return NextResponse.json({ message: "Resume deleted" });
  } catch (error) {
    console.error("Resume DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
