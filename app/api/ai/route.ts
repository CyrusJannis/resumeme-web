import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const openaiSchema = z.object({
  resumeId: z.string(),
  action: z.enum(["optimize", "suggestions", "coverLetter"]),
  section: z.string().optional(),
  content: z.string(),
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

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
    const { resumeId, action, section, content } = openaiSchema.parse(body);

    // Verify subscription plan (AI features require Pro or Premium)
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (!subscription || subscription.plan === "free") {
      return NextResponse.json(
        { error: "Premium plan required for AI features" },
        { status: 403 }
      );
    }

    // Verify resume ownership
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

    let prompt = "";
    let maxTokens = 500;

    switch (action) {
      case "optimize":
        prompt = `Improve this resume ${section || "section"}. Make it more professional, impactful, and ATS-friendly:

${content}

Provide only the improved text without explanation.`;
        break;

      case "suggestions":
        prompt = `Provide 3-5 specific suggestions to improve this resume ${section || "section"}. Be concise and actionable:

${content}

Format as a numbered list.`;
        maxTokens = 800;
        break;

      case "coverLetter":
        prompt = `Create a professional cover letter based on this resume:

${content}

Make it compelling, specific, and no more than 250 words.`;
        maxTokens = 600;
        break;
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume writer and career coach. Help users improve their resumes with specific, actionable advice.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse =
      data.choices[0]?.message?.content ||
      "Unable to process request";

    // Log action
    await supabase.from("audit_logs").insert({
      user_id: session.user.id,
      action: `AI_${action.toUpperCase()}`,
      entity_type: "resume",
      entity_id: resumeId,
      changes: { section, tokensUsed: data.usage?.total_tokens || 0 },
    });

    return NextResponse.json({
      response: aiResponse,
      action,
      section,
    });
  } catch (error) {
    console.error("AI request error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}
