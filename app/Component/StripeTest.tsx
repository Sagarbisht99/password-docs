"use client";

import { useEffect } from 'react';

export default function StripeTest() {
  useEffect(() => {
    // Log all environment variables that start with NEXT_PUBLIC_
    console.log('Environment Variables:');
    console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    
    // Check if the key exists and has the correct format
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('❌ Stripe publishable key is missing');
    } else if (!key.startsWith('pk_test_') && !key.startsWith('pk_live_')) {
      console.error('❌ Invalid Stripe publishable key format');
    } else {
      console.log('✅ Stripe publishable key is valid');
    }
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Stripe Configuration Status</h2>
      <div className="text-sm">
        <p>Publishable Key Status: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Present' : '❌ Missing'}</p>
        <p>Key Format: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_') ? '✅ Test Key' : '❌ Invalid Format'}</p>
      </div>
    </div>
  );
} 