// app/pricing/page.tsx
'use client';

import { useAuth } from '@/lib/auth/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const PRICING_PLANS = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    price: '$0',
    period: 'Forever',
    features: [
      '1 Resume',
      'Basic Editor',
      'Download as PDF',
      'Community Support',
    ],
    cta: 'Current Plan',
    ctaDisabled: true,
    popular: false,
    priceId: 'free',
  },
  {
    name: 'Pro',
    description: 'Best for job seekers',
    price: '$9',
    period: '/month',
    features: [
      '5 Resumes',
      'AI Resume Optimizer',
      'ATS Score Check',
      'Cover Letter Generator',
      'Interview Prep Guide',
      'Email Support',
    ],
    cta: 'Upgrade to Pro',
    ctaDisabled: false,
    popular: true,
    priceId: 'price_pro_monthly', // Add real price ID from Stripe
  },
  {
    name: 'Premium',
    description: 'For career changers',
    price: '$19',
    period: '/month',
    features: [
      'Unlimited Resumes',
      'AI Resume Optimizer',
      'ATS Score Check',
      'Cover Letter Generator',
      'Interview Prep Guide',
      'LinkedIn Optimization',
      'Priority Support',
      'Custom Templates',
    ],
    cta: 'Upgrade to Premium',
    ctaDisabled: false,
    popular: false,
    priceId: 'price_premium_monthly', // Add real price ID from Stripe
  },
];

export default function PricingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (priceId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setSelectedPlan(priceId);
    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      });

      const data = await response.json();
      if (data.sessionId) {
        // Redirect to Stripe checkout
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Resume<span className="text-purple-400">ME</span>
          </Link>
          <div className="flex items-center gap-4">
            {!loading && user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-400">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border transition ${
                plan.popular
                  ? 'border-purple-500 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg shadow-purple-500/20 md:scale-105'
                  : 'border-slate-700 bg-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-2">{plan.period}</span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(plan.priceId)}
                  disabled={plan.ctaDisabled || (selectedPlan === plan.priceId && isLoading)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition mb-8 ${
                    plan.ctaDisabled
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {selectedPlan === plan.priceId && isLoading ? 'Processing...' : plan.cta}
                </button>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-300">
                      <span className="text-purple-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I change my plan anytime?',
                a: 'Yes! Upgrade or downgrade anytime. Changes take effect at the next billing cycle.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 14-day money-back guarantee if you\'re not satisfied.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, Apple Pay, and Google Pay through Stripe.',
              },
              {
                q: 'Is there a contract?',
                a: 'No! You can cancel anytime with just one click.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
