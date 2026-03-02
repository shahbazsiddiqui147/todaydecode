import Stripe from "stripe";

if (!process.env.STRIPE_API_KEY) {
    throw new Error("STRIPE_API_KEY is missing from environment variables.");
}

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
});
