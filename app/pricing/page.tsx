"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// Dynamic import for Stripe - will load on client
let stripePromise: any;

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "Forever",
    description: "Perfect to get started",
    features: [
      "1 Resume",
      "Basic Editor",
      "No AI Features",
      "Limited Templates",
    ],
    buttonText: "Current Plan",
    buttonVariant: "outline",
    priceId: null,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "Best for professionals",
    features: [
      "5 Resumes",
      "Advanced Editor",
      "AI Optimization",
      "PDF Export",
      "Priority Support",
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "primary",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$19.99",
    period: "per month",
    description: "For the ambitious",
    features: [
      "20 Resumes",
      "Premium Editor",
      "AI Everything",
      "Cover Letter Generator",
      "Advanced Analytics",
      "24/7 Support",
    ],
    buttonText: "Upgrade to Premium",
    buttonVariant: "primary",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (priceId: string | null | undefined) => {
    if (!priceId) return;

    if (!session?.user?.id) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          userId: session.user.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to create checkout session");

      const { sessionId } = await response.json();

      // Redirect to Stripe checkout
      if (typeof window !== "undefined") {
        window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-400">
            Choose the plan that fits your needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 backdrop-blur transition transform hover:scale-105 ${
                plan.highlighted
                  ? "bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500 shadow-2xl"
                  : "bg-slate-700/50 border border-slate-600"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-slate-400 text-sm ml-2">
                  {plan.period}
                </span>
              </div>

              <button
                onClick={() => handleUpgrade(plan.priceId)}
                disabled={loading || !plan.priceId}
                className={`w-full py-3 rounded-lg font-semibold transition mb-8 ${
                  plan.buttonVariant === "primary"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
                    : "bg-slate-600 text-white hover:bg-slate-500"
                }`}
              >
                {loading ? "Processing..." : plan.buttonText}
              </button>

              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="text-emerald-400 mr-3">✓</span>
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
              <h3 className="text-lg font-bold text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-slate-400">
                Yes, you can cancel your subscription at any time. No questions
                asked.
              </p>
            </div>
            <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
              <h3 className="text-lg font-bold text-white mb-2">
                Is there a trial period?
              </h3>
              <p className="text-slate-400">
                Start with our Free plan and upgrade whenever you're ready.
              </p>
            </div>
            <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
              <h3 className="text-lg font-bold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-400">
                We accept all major credit cards and digital payment methods via
                Stripe.
              </p>
            </div>
            <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
              <h3 className="text-lg font-bold text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-slate-400">
                Yes, 30-day money-back guarantee on all paid plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
