'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { createSubscription, handleSubscribe } from '@/lib/firebase/subscription';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Script from 'next/script';

interface SelectedPlan {
  planType: string;
  billingCycle: string;
  price: number;
  currency: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Function to fetch exchange rate
const fetchExchangeRate = async (): Promise<number> => {
  try {
    const response = await fetch('/api/exchange-rate');
    const data = await response.json();
    return data.rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 85.60; // Fallback rate
  }
};

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(85.60); // Default rate
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch exchange rate when component mounts
    const getExchangeRate = async () => {
      setIsLoadingRate(true);
      const rate = await fetchExchangeRate();
      setExchangeRate(rate);
      setIsLoadingRate(false);
    };
    getExchangeRate();

    // Check if user is logged in
    if (!user) {
      router.push('/login?redirect=payment');
      return;
    }

    // Get selected plan from session storage
    const storedPlan = sessionStorage.getItem('selectedPlan');
    if (!storedPlan) {
      router.push('/pricing');
      return;
    }

    setSelectedPlan(JSON.parse(storedPlan));
  }, [user, router]);

  // Function to convert USD to INR using the fetched rate
  const convertUSDToINR = (usdAmount: number): number => {
    return Math.round(usdAmount * exchangeRate);
  };

  const initializeRazorpay = async () => {
    if (!selectedPlan || !user) return;

    try {
      setIsProcessing(true);

      // Convert price to INR if the currency is USD
      const amountInINR = selectedPlan.currency === 'USD' 
        ? convertUSDToINR(selectedPlan.price)
        : selectedPlan.price;

      // Log the request we're about to make
      console.log('Creating payment order:', {
        originalAmount: selectedPlan.price,
        originalCurrency: selectedPlan.currency,
        amountInINR,
        planType: selectedPlan.planType,
        billingCycle: selectedPlan.billingCycle,
      });

      // Create order on the server
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInINR,
          currency: 'INR', // Razorpay only accepts INR
          planType: selectedPlan.planType,
          billingCycle: selectedPlan.billingCycle,
        }),
      });

      // Log the raw response
      console.log('Raw response status:', response.status);
      console.log('Raw response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error(`Invalid response from server: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        console.error('Payment creation failed:', data);
        throw new Error(data.error || data.details || 'Failed to create payment');
      }

      // Log successful order creation
      console.log('Order created successfully:', data);

      // Check if Razorpay key is available
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        console.error('Razorpay key is missing');
        throw new Error('Payment configuration is incomplete');
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'WiggleByte Security',
        description: `${selectedPlan.planType} Plan - ${selectedPlan.billingCycle} subscription`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            console.log('Payment response received:', response);

            // Verify payment on the server
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            console.log('Payment verification response:', verifyData);

            if (!verifyResponse.ok || !verifyData.verified) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            // Create subscription in Firestore
            await createSubscription(
              user.uid,
              selectedPlan.planType as any,
              selectedPlan.billingCycle as any,
              verifyData.paymentId
            );

            // Store payment history
            await handleSubscribe(
              user.uid,
              selectedPlan.planType,
              selectedPlan.billingCycle,
              selectedPlan.price,
              selectedPlan.currency,
              'Razorpay',
              verifyData.paymentId
            );

            // Clear session storage
            sessionStorage.removeItem('selectedPlan');

            toast.success('Payment successful!');
            router.push('/console');
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error instanceof Error ? error.message : 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.displayName || user.email?.split('@')[0],
          email: user.email,
        },
        theme: {
          color: '#2563eb',
        },
      };

      console.log('Initializing Razorpay with options:', {
        ...options,
        key: options.key ? '***' : undefined, // Don't log the actual key
      });

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading skeleton for payment summary
  const PaymentSummarySkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Loading skeleton for payment button
  const PaymentButtonSkeleton = () => (
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
  );

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-2xl w-full mx-auto px-4">
            <PaymentSummarySkeleton />
            <PaymentButtonSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Purchase</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-medium capitalize">{selectedPlan?.planType}</span>
              </div>
              <div className="flex justify-between">
                <span>Billing Cycle:</span>
                <span className="font-medium capitalize">{selectedPlan?.billingCycle}</span>
              </div>
              <div className="flex justify-between">
                <span>Price (USD):</span>
                <span className="font-medium">${selectedPlan?.price}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Exchange Rate:</span>
                <span className="flex items-center">
                  {isLoadingRate ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading rate...</span>
                    </div>
                  ) : (
                    `1 USD = ₹${exchangeRate.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Amount in INR:</span>
                <span>₹{selectedPlan ? convertUSDToINR(selectedPlan.price) : 0}</span>
              </div>
            </div>

            <Button
              onClick={initializeRazorpay}
              disabled={isProcessing || isLoadingRate}
              className="w-full py-6 text-lg font-semibold"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </div>
              ) : isLoadingRate ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading Payment...
                </div>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}