import { NextResponse } from "next/server";
import Stripe from "stripe";

// ✅ Ensure STRIPE_SECRET_KEY is set
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}


// ✅ Initialize Stripe with latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
   apiVersion: '2025-05-28.basil'
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    // ✅ Validate the amount
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount provided" },
        { status: 400 }
      );
    }

    // ✅ Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // ✅ Send the client secret back to the client
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
