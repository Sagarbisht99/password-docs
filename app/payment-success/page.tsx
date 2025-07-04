"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentSuccess() {
  const [status, setStatus] = useState<"processing" | "succeeded" | "failed">("processing");
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment_intent = searchParams.get("payment_intent");
    const payment_intent_client_secret = searchParams.get("payment_intent_client_secret");

    if (payment_intent && payment_intent_client_secret) {
      setTimeout(() => {
        setStatus("succeeded"); // simulate success
      }, 2000); // Add delay to show processing animation
    } else {
      setStatus("failed");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 rounded-xl bg-white shadow-xl">
        <AnimatePresence mode="wait">
          {status === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold">Processing Payment</h2>
              <p className="mt-2">Please wait while we confirm your payment...</p>
              <div className="mt-6 flex justify-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              </div>
            </motion.div>
          )}

          {status === "succeeded" && (
            <motion.div
              key="succeeded"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100"
              >
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                </svg>
              </motion.div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">Payment Successful!</h2>
              <p className="mt-2 text-gray-600">Thank you for your purchase.</p>
            </motion.div>
          )}

          {status === "failed" && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">Payment Failed</h2>
              <p className="mt-2 text-gray-600">Please try again or contact support.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
