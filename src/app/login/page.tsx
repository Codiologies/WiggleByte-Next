"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Lock, Mail } from "lucide-react";
import { signIn, signInWithGoogle, AuthError } from "@/lib/firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { PasswordInput } from "@/components/ui/password-input";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginValues = z.infer<typeof loginSchema>;

// Add LoginFormSkeleton component
const LoginFormSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
  >
    <div className="text-center mb-8">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto skeleton-loading"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mt-2 skeleton-loading"></div>
    </div>

    <div className="space-y-4">
      {/* Email field skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 skeleton-loading"></div>
        <div className="relative">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full skeleton-loading"></div>
        </div>
      </div>

      {/* Password field skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 skeleton-loading"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 skeleton-loading"></div>
        </div>
        <div className="relative">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full skeleton-loading"></div>
        </div>
      </div>

      {/* Button skeleton */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mt-6 skeleton-loading"></div>

      {/* Sign up link skeleton */}
      <div className="mt-6 text-center">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto skeleton-loading"></div>
      </div>
    </div>
  </motion.div>
);

// Add Google button component
const GoogleSignInButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <Button
    type="button"
    variant="outline"
    className="w-full h-12 mb-6 flex items-center justify-center gap-2 bg-white hover:bg-white dark:bg-white dark:hover:bg-white border border-gray-300 dark:border-gray-300 shadow-sm"
    onClick={onClick}
    disabled={disabled}
  >
    <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      alt="Google"
      className="w-5 h-5"
    />
    <span className="text-gray-700 font-medium text-sm">
      Continue with Google
    </span>
  </Button>
);

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Check for success message
  useEffect(() => {
    const success = searchParams.get('success');
    const message = searchParams.get('message');

    if (success === 'true') {
      toast.success("Account created successfully!", {
        description: "You can now log in with your credentials.",
      });
    }

    // Handle verify-email message from redirect
    if (message === 'verify-email') {
      // Redirect to clean URL to prevent loop
      router.replace('/login');
      toast.info("Email verification is no longer required.", {
        description: "You can log in directly with your credentials.",
      });
    }
  }, [searchParams, router]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Set the auth flag before redirecting
      sessionStorage.setItem('fromAuth', 'true');
      router.replace("/console");
    }
  }, [user, router]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      setIsLoading(true);

      // Sign in with Firebase
      const { userCredential, userData } = await signIn(data.email, data.password);
      
      // Set the auth flag before redirecting
      sessionStorage.setItem('fromAuth', 'true');
      
      // Force a small delay to ensure session is set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast.success("Logged in successfully!", {
        description: `Welcome back, ${userData.name}!`,
      });

      // Use replace instead of push to prevent back navigation
      router.replace("/console");
      
      // Force a page reload to ensure all auth state is properly initialized
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle unverified email error specifically
      if (error instanceof Error && error.message.includes('verify your email')) {
        toast.error("Email not verified", {
          description: (
            <div className="flex flex-col gap-2">
              <p>Please verify your email before logging in.</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push('/verify-email')}
              >
                Go to Verification Page
              </Button>
            </div>
          ),
          duration: 10000, // Show for 10 seconds to give user time to read
        });
        return;
      }
      
      // Show specific error messages for common auth errors
      if (error instanceof AuthError) {
        switch (error.code) {
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            toast.error("Invalid credentials", {
              description: "The email or password you entered is incorrect. Please try again.",
            });
            break;
          case 'auth/too-many-requests':
            toast.error("Too many attempts", {
              description: "Too many failed login attempts. Please try again later or reset your password.",
            });
            break;
          case 'auth/user-disabled':
            toast.error("Account disabled", {
              description: "This account has been disabled. Please contact support.",
            });
            break;
          default:
            toast.error("", {
              description: error.message || "Please check your credentials and try again.",
            });
        }
        return;
      }
      
      // Fallback error message
      toast.error("Login failed", {
        description: "Please check your email and password and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { userCredential, userData } = await signInWithGoogle('login');
      
      // Set the auth flag before redirecting
      sessionStorage.setItem('fromAuth', 'true');
      toast.success("Logged in successfully!", {
        description: `Welcome back, ${userData.name}!`,
      });
      router.replace("/console");
    } catch (error: unknown) {
      console.error('Google sign-in error:', error);
      
      // Handle specific error cases
      if (error && typeof error === 'object' && 'code' in error && error.code === 'NO_ACCOUNT') {
        toast.error("No account found", {
          description: (
            <div className="flex flex-col gap-2">
              <p>No account found with this email.</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push('/signup')}
              >
                Create Account
              </Button>
            </div>
          ),
          duration: 10000, // Show for 10 seconds
        });
        return;
      }
      
      toast.error("Google sign-in failed", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false);
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
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LOGIN TO YOUR ACCOUNT</h1>
            </div>

            {/* Replace old Google button with new component */}
            <GoogleSignInButton onClick={handleGoogleSignIn} disabled={isLoading} />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-200">EMAIL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder=""
                            type="email"
                            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            {...field}
                          />
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="dark:text-gray-200">PASSWORD</FormLabel>
                        <Link href="/forgot-password" className="text-sm text-[#2496f8] hover:underline">
                          FORGOT PASSWORD
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                          <PasswordInput
                            placeholder="••••••••"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#2496f8] hover:bg-[#1d8ae3] text-white mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>

                <div className="mt-6 text-center text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    DON'T HAVE AN ACCOUNT?{" "}
                    <Link href="/signup" className="text-[#2496f8] font-medium hover:underline">
                      SIGN UP
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="w-full max-w-md mx-4">
            <LoginFormSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
