import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      // Return default free subscription if not found
      return NextResponse.json({
        plan: "free",
        status: "active",
      });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Subscription GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
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

    const { action } = await req.json();

    if (action === "cancel") {
      // Get stripe subscription ID
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("stripe_subscription_id")
        .eq("user_id", session.user.id)
        .single();

      if (!subscription?.stripe_subscription_id) {
        return NextResponse.json(
          { error: "No active subscription" },
          { status: 400 }
        );
      }

      // Cancel subscription at period end
      await stripe.subscriptions.update(
        subscription.stripe_subscription_id,
        { cancel_at_period_end: true }
      );

      // Update in DB
      await supabase
        .from("subscriptions")
        .update({ cancel_at_period_end: true })
        .eq("user_id", session.user.id);

      return NextResponse.json({ message: "Subscription canceled" });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Subscription POST error:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
