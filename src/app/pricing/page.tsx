"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { hasUsedFreeTrial, createFreeTrial, getSubscription, getSubscriptionButtonStates } from '@/lib/firebase/subscription';
import { toast } from "sonner";
import type { SubscriptionData } from '@/lib/firebase/subscription';

const pricingPlans = [
  {
    name: "FREE TRIAL",
    description: "Use WiggleByte Agent Then Review The Results",
    monthlyPrice: "$0",
    annualPrice: "$0",
    features: [
      "SQLMAP DETECTION",
      "CROSS-SITE SCRIPTING",
      "24/7 Helpline ",
      "Multiple Devices",
      "Side By Side Results",
      "No Payment Needed!!",
    ],
    cta: "START FREE TRIAL",
    planType: "free",
    isFree: true,
  },
  {
    name: "SIMPLE",
    description: "Detect The Most Common Bugs In The Website",
    monthlyPrice: "$10",
    annualPrice: "$96",
    features: [
      "SQLMAP Detection",
      "OWASP TOP-10",
      "XSS(CROSS-SITE SCRIPTING)",
      "IDORs  Detection",
      "50 High Requests",
      "24/7 Helpline With Outlook",
    ],
    cta: "GET NOW",
    planType: "simple",
  },
  {
    name: "PREMIUM",
    description: "Get The Best Results With The Best Tools",
    monthlyPrice: "$15",
    annualPrice: "$144",
    features: [
      "SQLMAP Detection",
      "OWASP TOP-10",
      "XSS(CROSS-SITE SCRIPTING)",
      "IDORs  Detection",
      "Unlimited High Requests",
      "24/7 Helpline With Outlook",
    ],
    popular: true,
    cta: "GET NOW",
    planType: "premium",
  },
];

interface SelectedPlan {
  planType: string;
  billingCycle: string;
  price: number;
  currency: string;
}

export default function CleanPricing() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [buttonStates, setButtonStates] = useState({ freeTrialDisabled: false, simpleDisabled: false, premiumDisabled: false });
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSub = async () => {
      if (!user) {
        setIsLoadingSubscription(false);
        return;
      }

      try {
        setIsLoadingSubscription(true);
        const sub = await getSubscription(user.uid);
        setSubscription(sub);
        setButtonStates(getSubscriptionButtonStates(sub));
      } catch (error) {
        console.error('Error fetching subscription:', error);
        toast.error('Failed to load subscription data. Please try refreshing the page.');
      } finally {
        setIsLoadingSubscription(false);
      }
    };
    fetchSub();
  }, [user]);

  const handleSubscribe = async (planType: string, billingCycle: string, price: string) => {
    if (!user) {
      router.push('/login?redirect=pricing');
      return;
    }

    setLoadingPlan(planType);
    try {
      if (planType === 'free') {
        const hasTrial = await hasUsedFreeTrial(user.uid);
        if (hasTrial) {
          toast.error('You have already used your free trial. Please select a paid plan.');
          setLoadingPlan(null);
          return;
        }
        await createFreeTrial(user.uid);
        router.push('/console');
        return;
      }

      // Handle paid plans
      const numericPrice = parseFloat(price.replace('$', ''));
      const selectedPlan: SelectedPlan = {
        planType,
        billingCycle,
        price: numericPrice,
        currency: 'USD'
      };
      
      sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
      router.push('/payment');
    } catch (error) {
      console.error('Error handling subscription:', error);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  // Loading skeleton for pricing cards
  const PricingCardSkeleton = () => (
    <Card className="relative overflow-hidden animate-pulse">
      <CardHeader className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </CardFooter>
    </Card>
  );

  // Only show loading skeleton when subscription is being fetched for logged-in users
  if (user && isLoadingSubscription) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mt-4 animate-pulse"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <PricingCardSkeleton />
              <PricingCardSkeleton />
              <PricingCardSkeleton />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 py-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <div className="inline-block mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-sm font-semibold tracking-wide uppercase px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            BIG PROTECTION FOR SMBs
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
            SIMPLE PLANS WITH NO HIDDEN FEES<br className="hidden md:block" />
          </h1>

          {/* Billing toggle */}
          <div className="mb-16 inline-flex items-center rounded-full p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            <button
              className={`py-2.5 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              MONTHLY
            </button>
            <button
              className={`py-2.5 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
                billingCycle === "annual"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setBillingCycle("annual")}
            >
              <span className="flex items-center">
                12 MONTHS
                <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">SAVE 20%</span>
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        {(() => {
          const visiblePlans = billingCycle === "monthly"
            ? pricingPlans
            : pricingPlans.filter((plan: any) => plan.planType !== 'free');
          const gridCols = visiblePlans.length === 3
            ? "md:grid-cols-3"
            : "md:grid-cols-2 justify-center";
          return (
            <div className={`max-w-6xl mx-auto px-4 grid gap-8 ${gridCols}`}>
              {visiblePlans.map((plan: any) => {
                let disabled = loadingPlan === plan.planType;
                // Only apply subscription-based button states if user is logged in
                if (user) {
                  if (plan.planType === 'free') disabled = disabled || buttonStates.freeTrialDisabled;
                  if (plan.planType === 'simple') disabled = disabled || buttonStates.simpleDisabled;
                  if (plan.planType === 'premium') disabled = disabled || buttonStates.premiumDisabled;
                }
                return (
                  <div key={plan.name} className="relative">
                    <Card 
                      className={`h-full flex flex-col overflow-hidden border-2 ${
                        plan.popular 
                          ? 'border-purple-500 dark:border-purple-400 shadow-xl shadow-purple-200 dark:shadow-purple-900/20' 
                          : plan.isFree
                          ? 'border-green-500 dark:border-green-400 shadow-xl shadow-green-200 dark:shadow-green-900/20'
                          : 'border-blue-200 dark:border-blue-800 shadow-lg'
                      } dark:bg-gray-800 rounded-xl`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-4 left-0 right-0 mx-auto w-40 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 py-1.5 text-center text-xs font-semibold text-white shadow-lg transform -rotate-1">
                          MOST POPULAR
                        </div>
                      )}
                      
                      {plan.isFree && (
                        <div className="absolute -top-4 left-0 right-0 mx-auto w-40 rounded-full bg-gradient-to-r from-green-500 to-green-600 py-1.5 text-center text-xs font-semibold text-white shadow-lg transform -rotate-1">
                          FREE TRIAL
                        </div>
                      )}
                      
                      <CardHeader className={`${(plan.popular || plan.isFree) ? 'pt-10 pb-6' : 'pb-4'} text-center`}>
                        <CardTitle className={`text-2xl font-bold ${
                          plan.popular 
                            ? 'text-purple-600 dark:text-purple-400' 
                            : plan.isFree
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {plan.name}
                        </CardTitle>
                        
                        <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
                          {plan.description}
                        </CardDescription>
                        
                        <div className="mt-6 flex items-end justify-center">
                          <span className="text-5xl font-extrabold text-gray-800 dark:text-white">
                            {billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 mb-2">
                            {billingCycle === "monthly" ? "/MONTH" : "/YEAR"}
                          </span>
                        </div>
                        
                        {billingCycle === "annual" && (
                          <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                            SAVE 20% WITH 12 MONTHS BILLING
                          </div>
                        )}
                      </CardHeader>
                      
                      <CardContent className="flex-1 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <ul className="space-y-4 text-sm">
                          {plan.features.map((feature: string) => (
                            <li key={feature} className="flex items-start">
                              <div className={`mr-3 mt-0.5 h-5 w-5 rounded-full ${
                                plan.popular 
                                  ? 'bg-purple-100 dark:bg-purple-900/30' 
                                  : plan.isFree
                                  ? 'bg-green-100 dark:bg-green-900/30'
                                  : 'bg-blue-100 dark:bg-blue-900/30'
                              } flex items-center justify-center flex-shrink-0`}>
                                <Check className={`h-3 w-3 ${
                                  plan.popular 
                                    ? 'text-purple-600 dark:text-purple-400' 
                                    : plan.isFree
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-blue-600 dark:text-blue-400'
                                }`} />
                              </div>
                              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      
                      <CardFooter className="pt-6 pb-8">
                        <Button
                          className={`w-full py-6 rounded-lg text-base font-semibold transition-all duration-200 ${
                            plan.popular
                              ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/20 hover:shadow-xl transform hover:-translate-y-0.5"
                              : plan.isFree
                              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-200 dark:shadow-green-900/20 hover:shadow-xl transform hover:-translate-y-0.5"
                              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20 hover:shadow-xl transform hover:-translate-y-0.5"
                          }`}
                          onClick={() => handleSubscribe(
                            plan.planType, 
                            billingCycle, 
                            billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice
                          )}
                          disabled={disabled}
                        >
                          <span className="flex items-center justify-center">
                            {loadingPlan === plan.planType ? 'Processing...' : plan.cta}
                            {loadingPlan !== plan.planType && <ArrowRight className="ml-2 h-5 w-5" />}
                          </span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </main>
      <Footer />
    </div>
  );
}