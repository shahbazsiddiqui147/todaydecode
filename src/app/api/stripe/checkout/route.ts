import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { priceId } = await req.json();

        if (!priceId) {
            return new NextResponse("Price ID is required", { status: 400 });
        }

        // 1. Find or create Stripe customer
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        let stripeCustomerId = user.stripeCustomerId;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: session.user.email,
                name: session.user.name || undefined,
                metadata: {
                    userId: user.id,
                },
            });
            stripeCustomerId = customer.id;

            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId },
            });
        }

        // 2. Create Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/?canceled=true`,
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error: any) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error);
        return new NextResponse(error.message || "Internal Server Error", { status: 500 });
    }
}
