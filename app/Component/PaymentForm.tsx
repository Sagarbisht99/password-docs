"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Get the publishable key
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const PaymentFormContent = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  // Debug: Log stripe and elements status
  useEffect(() => {
    console.log("PaymentFormContent Status:", {
      stripe: !!stripe,
      elements: !!elements,
      processing,
      publishableKey: !!publishableKey,
      stripePromise: !!stripePromise,
    });
  }, [stripe, elements, processing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe or Elements not initialized");
      return;
    }

    setProcessing(true);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (submitError) {
        console.error("Payment error:", submitError);
      }
    } catch (err) {
      console.error("Payment submission error:", err);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 max-h-[70vh] overflow-y-auto">
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Processing..." : `Pay $${amount}`}
      </button>
      {/* Debug: Show why button is disabled */}
    </form>
  );
};

export default function PaymentForm({ amount }: { amount: number }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        console.log("Creating payment intent for amount:", amount);
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        });

        const data = await response.json();
        console.log("Payment intent response:", data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to create payment intent");
        }

        if (data.error) {
          throw new Error(data.error);
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
      }
    };

    createPaymentIntent();
  }, [amount]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show configuration status
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {!publishableKey ? (
        <div className="text-red-500 p-6 text-center">
          Error: Stripe publishable key is missing. Please check your .env.local
          file.
        </div>
      ) : !stripePromise ? (
        <div className="text-red-500 p-6 text-center">
          Error: Failed to initialize Stripe. Please check your publishable key.
        </div>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentFormContent amount={amount} />
        </Elements>
      )}
    </div>
  );
}
