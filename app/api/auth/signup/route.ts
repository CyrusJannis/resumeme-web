import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { sendVerificationEmail } from "@/lib/email";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = signupSchema.parse(body);

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = Buffer.from(
      `${email}-${Date.now()}-${Math.random()}`
    )
      .toString("base64")
      .substring(0, 32);

    // Create user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: hashedPassword,
        name,
        verification_token: verificationToken,
      })
      .select()
      .single();

    if (error) throw error;

    // Create free subscription
    await supabase.from("subscriptions").insert({
      user_id: newUser.id,
      plan: "free",
      status: "active",
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${verificationToken}`;
    await sendVerificationEmail(email, name, verificationUrl);

    return NextResponse.json(
      {
        message: "User created successfully. Please verify your email.",
        userId: newUser.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}
