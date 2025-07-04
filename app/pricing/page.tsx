"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import PaymentForm from "../Component/PaymentForm";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "Basic",
    price: 100,
    duration: "/year",
    save: "Save $20",
    features: [
      "Secure Password Manager",
      "5GB Encrypted File Storage",
      "Basic Docs Viewer",
      "Single Device Access",
      "Email Support",
      "Access Logs for 7 Days",
    ],
    button: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: 250,
    duration: "/year",
    save: "Save $50",
    features: [
      "Advanced Password Vault",
      "50GB File Storage with Sync",
      "Docs Editor & Sharing",
      "Multi-Device Access",
      "2-Factor Authentication",
      "Priority Email Support",
      "Access Logs for 30 Days",
    ],
    button: "Get Started",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    duration: "",
    save: "",
    features: [
      "Unlimited Password Storage",
      "1TB Cloud File Storage",
      "Full Docs Suite (Edit, Share, Collaborate)",
      "Admin Team Controls",
      "Role-based Access & Audit Logs",
      "SSO + IAM Integration",
      "24/7 Dedicated Account Manager",
    ],
    button: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(
    null
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useLayoutEffect(() => {
    cardsRef.current.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  const handlePlanSelect = (plan: (typeof plans)[0]) => {
    if (plan.name === "Enterprise") {
      // Handle enterprise contact form or redirect
      window.location.href = "mailto:sales@encryptohub.com";
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen w-full py-5 px-4 md:px-8">
      <div>
        <div className="text-center mt-7 mb-12">
          <h1 className="text-4xl font-bold">Pricing Plans</h1>
          <p className="text-lg mt-2">Choose the plan that fits your needs</p>
        </div>

        <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-3 place-items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              initial={{ scale: 1 }}
              whileHover={{
                scale: 1.04,
                y: -5,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                mass: 0.5,
              }}
              className={`w-full max-w-[360px] min-h-[460px] rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md border transition-colors duration-500
              ${
                plan.highlight
                  ? "border-blue-500 shadow-lg shadow-blue-500/20"
                  : "border-border"
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  {plan.save && (
                    <span className="bg-zinc-800 text-sm px-2 py-0.5 rounded-full text-orange-500 font-medium">
                      {plan.save}
                    </span>
                  )}
                </div>

                <p className="text-3xl font-bold">
                  {typeof plan.price === "number"
                    ? `$${plan.price}`
                    : plan.price}
                  <span className="text-base font-normal">{plan.duration}</span>
                </p>

                <p className="text-sm mt-2">
                  {plan.name === "Pro"
                    ? "Perfect for professionals & startups"
                    : plan.name === "Enterprise"
                    ? "Tailored solutions for big teams"
                    : "Starter tools for individuals"}
                </p>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePlanSelect(plan)}
                className="mt-6 bg-blue-500 text-white py-2 rounded-xl font-medium hover:scale-105 transition-transform duration-200"
              >
                {plan.button}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background rounded-xl p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4">Complete Your Purchase</h2>
            <p className="text-gray-600 mb-6">
              {selectedPlan.name} Plan - ${selectedPlan.price}/year
            </p>

            <PaymentForm amount={selectedPlan.price as number} />
          </div>
        </div>
      )}
    </div>
  );
}
