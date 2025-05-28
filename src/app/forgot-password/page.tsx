"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { sendPasswordReset } from "@/lib/firebase/auth";
import { Navbar } from "@/components/ui/navbar";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      setIsLoading(true);
      await sendPasswordReset(data.email);
      setIsEmailSent(true);
      toast.success("Password reset email sent", {
        description: "Please check your email for the reset link.",
      });
    } catch (error) {
      toast.error("Failed to send reset email", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-6">
            <Link
              href="/login"
              className="text-gray-600 dark:text-gray-400 hover:text-[#2496f8] dark:hover:text-[#2496f8] mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
          </div>

          {!isEmailSent ? (
            <>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="Enter your email"
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
                    disabled={isLoading}
                    className="w-full bg-[#2496f8] hover:bg-[#1d8ae3] text-white"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Check Your Email
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 