import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token required" },
        { status: 400 }
      );
    }

    // Find user with this token
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("verification_token", token)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update user
    const { error: updateError } = await supabase
      .from("users")
      .update({
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        verification_token: null,
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
