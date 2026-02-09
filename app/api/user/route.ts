import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

// Mark this route as dynamic
export const dynamic = "force-dynamic";

const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  avatar_url: z.string().url().optional(),
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

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return safe user data
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      email_verified: user.email_verified,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error("User GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
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

    const body = await req.json();
    const { name, avatar_url } = profileUpdateSchema.parse(body);

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (avatar_url) updateData.avatar_url = avatar_url;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", session.user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      email: data.email,
      name: data.name,
      avatar_url: data.avatar_url,
    });
  } catch (error) {
    console.error("User PUT error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
