import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetRequestSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

// Request password reset
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = resetRequestSchema.parse(body);

    // Find user
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      // Don't reveal if email exists (security)
      return NextResponse.json(
        { message: "If email exists, reset link sent" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = Buffer.from(
      `${email}-${Date.now()}-${Math.random()}`
    )
      .toString("base64")
      .substring(0, 32);

    const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Save reset token
    await supabase
      .from("users")
      .update({
        reset_token: resetToken,
        reset_token_expires: resetTokenExpires.toISOString(),
      })
      .eq("id", user.id);

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(email, user.name, resetUrl);

    return NextResponse.json(
      { message: "Password reset link sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset request error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Request failed" },
      { status: 500 }
    );
  }
}

// Reset password with token
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = resetSchema.parse(body);

    // Find user with this token
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("reset_token", token)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check token expiry
    if (new Date(user.reset_token_expires) < new Date()) {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    const { error } = await supabase
      .from("users")
      .update({
        password_hash: hashedPassword,
        reset_token: null,
        reset_token_expires: null,
      })
      .eq("id", user.id);

    if (error) throw error;

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Reset failed" },
      { status: 500 }
    );
  }
}
