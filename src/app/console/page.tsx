"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsoleNavbar } from "@/components/ui/console-navbar";
import { Footer } from "@/components/ui/footer";
import { Download, Monitor, Apple, Laptop, AlertCircle, Calendar, CreditCard, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getSubscription, checkSubscriptionStatus, type SubscriptionData } from '@/lib/firebase/subscription';
import { format } from 'date-fns';

interface UserData {
  name?: string;
  email: string;
  company?: string;
}

export default function Console() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isDownloadEnabled, setIsDownloadEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/login');
  const router = useRouter();
  const { user, userData } = useAuth();

  // Handle redirects in useEffect
  useEffect(() => {
    if (shouldRedirect) {
      router.replace(redirectTo);
    }
  }, [shouldRedirect, router, redirectTo]);

  // Enhanced security and authentication check with email verification
  useEffect(() => {
    if (!user) {
      setShouldRedirect(true);
      setRedirectTo('/login');
      return;
    }
    
    // No email verification check needed anymore
  }, [user]);

  // Subscription check with enhanced security
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setShouldRedirect(true);
        return;
      }

      try {
        const subscriptionData = await getSubscription(user.uid);
        setSubscription(subscriptionData);
        
        if (subscriptionData) {
          const isActive = await checkSubscriptionStatus(user.uid);
          setIsDownloadEnabled(isActive);
        } else {
          setIsDownloadEnabled(false);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        toast.error('Failed to load subscription status');
        setShouldRedirect(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  // Handle direct access check in useEffect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fromAuth = sessionStorage.getItem('fromAuth');
      if (!fromAuth && !user) {
        setShouldRedirect(true);
      }
      sessionStorage.removeItem('fromAuth');
    }
  }, [user]);

  // Loading skeleton for console dashboard
  const ConsoleDashboardSkeleton = () => (
    <div className="container mx-auto px-4 py-16">
      <div className="animate-pulse space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subscription Card */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full mt-4"></div>
          </CardContent>
        </Card>

        {/* Download Section */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <ConsoleNavbar />
        <ConsoleDashboardSkeleton />
      </div>
    );
  }

  const handleDownload = async () => {
    if (!isDownloadEnabled) {
      toast.error('Please subscribe to a plan to download the software');
      router.push('/pricing');
      return;
    }

    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = '/downloads/wigglebyte-agent.exe';
      link.download = 'wigglebyte-agent.exe';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download the software. Please try again.');
    }
  };

  const handleRenew = () => {
    router.push('/pricing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <ConsoleNavbar />
      <main className="flex-1 py-12 px-4 max-w-4xl mx-auto w-full">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl dark:text-white">
                Welcome, {userData?.name || user.email?.split('@')[0]}!
              </CardTitle>
              <CardDescription className="text-lg dark:text-gray-300">
                Get The WiggleByte Agent Now - Sleep Tight Tonight
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Subscription Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Subscription Status</h2>
          
          {subscription ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold capitalize">{subscription.planType} Plan</h3>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">
                    {subscription.billingCycle} billing
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  subscription.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {subscription.status === 'active' ? 'Active' : 'Expired'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expires</p>
                    <p className="font-medium">
                      {format(subscription.endDate.toDate(), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Payment</p>
                    <p className="font-medium">
                      {format(subscription.startDate.toDate(), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              {subscription.status === 'expired' && (
                <Button onClick={handleRenew} className="w-full">
                  Renew Subscription
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Subscribe to a plan to access all features
              </p>
              <Button onClick={handleRenew}>View Plans</Button>
            </div>
          )}
        </div>

        {/* Download Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Get The Agent</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">WiggleByte Agent</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  V1.0.0 • Windows
                </p>
              </div>
              <Button
                onClick={handleDownload}
                disabled={!isDownloadEnabled}
                className="flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                {isDownloadEnabled ? 'Download' : 'Subscribe to Download'}
              </Button>
            </div>

            {!isDownloadEnabled && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg">
                <p className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Subscribe to a plan to download and use the software
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor className="h-8 w-8 text-gray-400" />
                <div>
                  <h3 className="text-lg font-semibold">Apple Desktop OS</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Apple Exclusive
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                <Clock className="h-4 w-4" />
                Coming Soon
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor className="h-8 w-8 text-gray-400" />
                <div>
                  <h3 className="text-lg font-semibold">Linux OS</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Linux Exclusive(Ubuntu)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                <Clock className="h-4 w-4" />
                Coming Soon
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg">
            <p className="text-sm">
              We Will Be Coming Soon With Apple Desktop OS And Linux OS. Till Then Stay Tuned.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}