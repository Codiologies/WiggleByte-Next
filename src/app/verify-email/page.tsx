"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Mail, CheckCircle, XCircle, RefreshCw, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { verifyEmail, checkVerificationCode, sendEmailVerification, forceRefreshUser, getUserData } from "@/lib/firebase/auth";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

function VerifyEmailContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Poll for verification status
  const checkVerificationStatus = useCallback(async () => {
    if (user) {
      try {
        // First check Firebase Auth state
        await forceRefreshUser(user);
        
        // Then check Firestore state
        const userData = await getUserData(user.uid);
        
        // Consider verification complete if either Firebase Auth or Firestore shows verified
        const isVerified = user.emailVerified || userData?.emailVerified;
        
        if (isVerified) {
          setIsVerificationComplete(true);
          setVerificationStatus('success');
          toast.success("Email verified successfully!");
          
          // If Firestore is not updated yet, update it
          if (!userData?.emailVerified) {
            try {
              await setDoc(doc(db, 'users', user.uid), {
                emailVerified: true,
                verifiedAt: new Date().toISOString()
              }, { merge: true });
            } catch (error) {
              console.error('Error updating Firestore:', error);
            }
          }
          
          setTimeout(() => {
            router.replace('/console');
          }, 2000);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    }
  }, [user, router]);

  // Set up polling when component mounts
  useEffect(() => {
    if (user && !user.emailVerified) {
      // Initial check
      checkVerificationStatus();
      
      // Set up polling every 2 seconds
      const intervalId = setInterval(checkVerificationStatus, 2000);
      
      // Cleanup interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [user, checkVerificationStatus]);

  useEffect(() => {
    const actionCode = searchParams.get('oobCode');
    if (actionCode) {
      handleVerification(actionCode);
    }
  }, [searchParams]);

  useEffect(() => {
    // Only redirect if user is logged in and verified
    if (user?.emailVerified) {
      router.replace('/console');
    }
  }, [user, router]);

  const handleVerification = async (actionCode: string) => {
    try {
      setIsVerifying(true);
      const isValid = await checkVerificationCode(actionCode);
      
      if (!isValid) {
        setVerificationStatus('error');
        toast.error("Invalid or expired verification link");
        return;
      }

      await verifyEmail(actionCode);
      
      // If user is logged in, force refresh their state
      if (user) {
        await forceRefreshUser(user);
      }
      
      setVerificationStatus('success');
      setIsVerificationComplete(true);
      toast.success("Email verified successfully!");
      
      // Only redirect if user is logged in
      if (user) {
        setTimeout(() => {
          router.replace('/console');
        }, 2000);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      toast.error("Failed to verify email", {
        description: error instanceof Error ? error.message : "Please try again later"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user) {
      toast.error("Please log in to resend verification email");
      router.push('/login');
      return;
    }
    
    try {
      setIsLoading(true);
      await sendEmailVerification(user);
      toast.success("Verification email sent", {
        description: "Please check your inbox and spam folder"
      });
    } catch (error) {
      toast.error("Failed to send verification email", {
        description: error instanceof Error ? error.message : "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusContent = () => {
    if (isVerificationComplete) {
      return (
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verified!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your email has been successfully verified.
            {!user && " You can now log in to access your account."}
          </p>
          {!user && (
            <Button
              asChild
              className="bg-[#2496f8] hover:bg-[#1d8ae3] text-white"
            >
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Go to Login
              </Link>
            </Button>
          )}
        </div>
      );
    }

    switch (verificationStatus) {
      case 'error':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">The verification link is invalid or has expired.</p>
            {user ? (
              <Button
                onClick={handleResendVerification}
                disabled={isLoading}
                className="bg-[#2496f8] hover:bg-[#1d8ae3] text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            ) : (
              <Button
                asChild
                className="bg-[#2496f8] hover:bg-[#1d8ae3] text-white"
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Go to Login
                </Link>
              </Button>
            )}
          </div>
        );
      default:
        return (
          <div className="text-center">
            <Mail className="h-16 w-16 text-[#2496f8] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Email</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {user 
                ? "Please check your email for a verification link. If you haven't received it, you can request a new one."
                : "Please log in to resend the verification email or verify your email using the link sent to your inbox."}
            </p>
            {user ? (
              <Button
                onClick={handleResendVerification}
                disabled={isLoading}
                className="bg-[#2496f8] hover:bg-[#1d8ae3] text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            ) : (
              <Button
                asChild
                className="bg-[#2496f8] hover:bg-[#1d8ae3] text-white"
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Go to Login
                </Link>
              </Button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            {getStatusContent()}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="w-full max-w-md mx-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 