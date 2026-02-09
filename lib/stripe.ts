import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

if (!stripeSecretKey) {
  console.error("Missing STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-01-28.clover",
});

export const STRIPE_PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    resumes: 1,
    aiSuggestions: false,
    pdfExport: false,
  },
  PRO: {
    name: "Pro",
    price: 9.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || "price_pro",
    resumes: 5,
    aiSuggestions: true,
    pdfExport: true,
  },
  PREMIUM: {
    name: "Premium",
    price: 19.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM || "price_premium",
    resumes: 20,
    aiSuggestions: true,
    pdfExport: true,
    coverLetterGenerator: true,
  },
};
