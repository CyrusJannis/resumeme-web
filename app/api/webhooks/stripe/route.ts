import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { sendPaymentReceipt } from "@/lib/email";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

async function getPaymentMethod(customerId: string) {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
  return paymentMethods.data[0]?.id || null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    console.error("Missing webhook signature or secret");
    return NextResponse.json(
      { error: "Webhook signature or secret missing" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const customerId = session.customer;

        // Find user by stripe customer ID
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!user) {
          console.error("User not found for customer:", customerId);
          break;
        }

        // Get subscription from Stripe
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          const priceId = subscription.items.data[0]?.price.id;

          // Determine plan from price
          let plan = "free";
          if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO) {
            plan = "pro";
          } else if (
            priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM
          ) {
            plan = "premium";
          }

          // Update subscription
          await supabase
            .from("subscriptions")
            .update({
              plan,
              status: "active",
              stripe_subscription_id: subscription.id,
              current_period_start: new Date(
                (subscription as any).current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                (subscription as any).current_period_end * 1000
              ).toISOString(),
            })
            .eq("user_id", user.id);

          // Send receipt email
          const amount = `$${(subscription.items.data[0]?.price.unit_amount || 0) / 100}`;
          await sendPaymentReceipt(
            user.email,
            user.name,
            amount,
            plan,
            subscription.id
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        // Find user
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!user) break;

        // Update subscription
        await supabase
          .from("subscriptions")
          .update({
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq("user_id", user.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        // Find user
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!user) break;

        // Downgrade to free plan
        await supabase
          .from("subscriptions")
          .update({
            plan: "free",
            status: "inactive",
            stripe_subscription_id: null,
          })
          .eq("user_id", user.id);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer;

        // Find user
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!user) break;

        // Store invoice
        await supabase.from("invoices").insert({
          user_id: user.id,
          stripe_invoice_id: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: "paid",
          paid_at: new Date(invoice.paid_at * 1000).toISOString(),
        });

        // Log action
        await supabase.from("audit_logs").insert({
          user_id: user.id,
          action: "PAYMENT_RECEIVED",
          entity_type: "invoice",
          entity_id: invoice.id,
          changes: { amount: invoice.amount_paid, currency: invoice.currency },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        console.error("Payment failed for invoice:", invoice.id);
        // Could send failure email or notification here
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
