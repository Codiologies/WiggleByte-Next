"use client";

import { memo } from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { CheckCircle, Lock, Mail, User } from "lucide-react";
import { signUp, signInWithGoogle } from "@/lib/firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthError } from "@/lib/firebase/auth";

// Updated schema with password requirements
const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .refine(
      (password) => /[A-Z]/.test(password),
      { message: "Password must contain at least one uppercase letter." }
    )
    .refine(
      (password) => /[a-z]/.test(password),
      { message: "Password must contain at least one lowercase letter." }
    )
    .refine(
      (password) => /[_\W]/.test(password),
      { message: "Password must contain at least one special character or underscore." }
    ),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
});

type SignUpValues = z.infer<typeof signUpSchema>;

// Types
interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

interface FormStepProps {
  form: any;
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
  password: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Separate PasswordStrengthMeter component
const PasswordStrengthMeter = memo(({ password }: { password: string }) => {
  const calculateStrength = useCallback((pass: string): PasswordStrength => {
    if (!pass) return { score: 0, label: "Too Weak", color: "bg-red-500" };

    const checks = [
      pass.length >= 8,
      /[A-Z]/.test(pass),
      /[a-z]/.test(pass),
      /[_\W]/.test(pass)
    ];
    
    const score = checks.filter(Boolean).length;
    
    const strengthMap: Record<number, PasswordStrength> = {
      0: { score, label: "Too Weak", color: "bg-red-500" },
      1: { score, label: "Weak", color: "bg-red-500" },
      2: { score, label: "Fair", color: "bg-orange-500" },
      3: { score, label: "Good", color: "bg-orange-500" },
      4: { score, label: "Strong", color: "bg-green-500" }
    };

    return strengthMap[score] || strengthMap[0];
  }, []);

  const strength = useMemo(() => calculateStrength(password), [password, calculateStrength]);

  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1 text-xs">
        <span>Password Strength: {strength.label}</span>
        <span>{Math.min(100, strength.score * 25)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${strength.color} transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(100, strength.score * 25)}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        <ul className="list-disc pl-5 space-y-1">
          {[
            { check: password.length >= 8, text: "At least 8 characters" },
            { check: /[A-Z]/.test(password), text: "At least one uppercase letter" },
            { check: /[a-z]/.test(password), text: "At least one lowercase letter" },
            { check: /[_\W]/.test(password), text: "At least one special character or underscore" }
          ].map(({ check, text }, index) => (
            <li key={index} className={check ? "text-green-500" : ""}>{text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
});

PasswordStrengthMeter.displayName = 'PasswordStrengthMeter';

// Separate form step components
const FirstStep = memo(({ form, onNext }: FormStepProps) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">FULL NAME</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder=""
                                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                {...field}
                              />
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

                    <Button
                      type="button"
                      className="w-full bg-[#2496f8] hover:bg-[#1d8ae3] text-white"
                      onClick={onNext}
                    >
                      CONTINUE
                    </Button>
                  </motion.div>
));

FirstStep.displayName = 'FirstStep';

const SecondStep = memo(({ form, isLoading, onPrev, password, onPasswordChange }: FormStepProps) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">COMPANY NAME</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder=""
                                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                {...field}
                              />
                              <CheckCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
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
                          <FormLabel className="dark:text-gray-200">PASSWORD</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                              <PasswordInput
                                placeholder="••••••••"
                                className="pl-10"
                                value={password}
                                onChange={onPasswordChange}
                                onBlur={field.onBlur}
                                name={field.name}
                              />
                            </div>
                          </FormControl>
                          <PasswordStrengthMeter password={password} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col space-y-2">
                      <Button
                        type="submit"
                        className="w-full bg-[#2496f8] hover:bg-[#1d8ae3] text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={onPrev}
                        disabled={isLoading}
                        className="dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        BACK
                      </Button>
                    </div>
                  </motion.div>
));

SecondStep.displayName = 'SecondStep';

// Add SignupFormSkeleton component
const SignupFormSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
    <div className="text-center mb-8">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse"></div>
    </div>

    <div className="space-y-4">
      {/* First step skeletons */}
      <div className="space-y-4">
        {/* Name field skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
          <div className="relative">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
          </div>
        </div>

        {/* Email field skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
          <div className="relative">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
      </div>

      {/* Login link skeleton */}
      <div className="mt-6 text-center">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Add SecondStepSkeleton component
const SecondStepSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
    <div className="text-center mb-8">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse"></div>
    </div>

    <div className="space-y-4">
      {/* Company field skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        <div className="relative">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
        </div>
      </div>

      {/* Password field skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
        <div className="relative">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
        </div>
        {/* Password strength meter skeleton */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2 animate-pulse"></div>
      </div>

      {/* Buttons skeleton */}
      <div className="space-y-2">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
      </div>

      {/* Login link skeleton */}
      <div className="mt-6 text-center">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto animate-pulse"></div>
      </div>
    </div>
  </div>
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

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.emailVerified) {
        router.replace("/console");
      } else {
        router.replace("/verify-email");
      }
    }
  }, [user, router]);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      company: "",
    },
  });

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    form.setValue("password", value);
  }, [form]);

  const onSubmit = useCallback(async (data: SignUpValues) => {
    try {
      setIsLoading(true);
      
      // Create account via Firebase and store data in Firestore
      await signUp(data.email, data.password, { 
        name: data.name, 
        company: data.company 
      });
      
      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account."
      });
      
      // Redirect to verify-email page instead of login
      router.push('/verify-email');
      
    } catch (error) {
      console.error('Signup error:', error);
      toast.error("Failed to create account", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const nextFormStep = useCallback(() => {
    form.trigger(['name', 'email']).then((valid) => {
      if (valid) setFormStep(1);
    });
  }, [form]);

  const prevFormStep = useCallback(() => {
    setFormStep(0);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { userCredential, userData } = await signInWithGoogle('signup');
      
      // Set the auth flag before redirecting
      sessionStorage.setItem('fromAuth', 'true');
      toast.success("Account created successfully!", {
        description: `Welcome, ${userData.name}!`,
      });
      router.replace("/console");
    } catch (error: unknown) {
      console.error('Google sign-in error:', error);
      
      // Handle specific error cases
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ACCOUNT_EXISTS') {
        toast.error("Account already exists", {
          description: (
            <div className="flex flex-col gap-2">
              <p>An account with this email already exists.</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push('/login')}
              >
                Go to Login
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

  // Show loading state while checking auth
  if (typeof user === 'undefined') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <motion.div
            className="max-w-md w-full mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SignupFormSkeleton />
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show loading state during form submission
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <motion.div
            className="max-w-md w-full mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {formStep === 0 ? <SignupFormSkeleton /> : <SecondStepSkeleton />}
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // Regular signup page with navbar and footer
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          className="max-w-md w-full mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CREATE YOUR ACCOUNT</h1>
            </div>

            {/* Replace old Google button with new component */}
            <GoogleSignInButton onClick={handleGoogleSignIn} disabled={isLoading} />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or sign up with email
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {formStep === 0 ? (
                  <FirstStep
                    form={form}
                    isLoading={isLoading}
                    onNext={nextFormStep}
                    onPrev={prevFormStep}
                    password={password}
                    onPasswordChange={handlePasswordChange}
                  />
                ) : (
                  <SecondStep
                    form={form}
                    isLoading={isLoading}
                    onNext={nextFormStep}
                    onPrev={prevFormStep}
                    password={password}
                    onPasswordChange={handlePasswordChange}
                  />
                )}

                <div className="mt-6 text-center text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    <Link href="/login" className="text-[#2496f8] font-medium hover:underline">
                      LOGIN
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