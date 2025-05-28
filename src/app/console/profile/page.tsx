"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ConsoleNavbar } from "@/components/ui/console-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { updatePassword, type UserData } from "@/lib/firebase/auth";
import type { User } from "firebase/auth";
import { Mail, Building, Lock, Receipt, Shield, KeyRound, CreditCard, Settings, Calendar, AlertCircle, Edit2, Check, X } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSubscription, type SubscriptionData } from "@/lib/firebase/subscription";
import { format } from "date-fns";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// Company name schema
const companySchema = z.object({
  company: z.string().min(2, "Company name must be at least 2 characters"),
});

type CompanyValues = z.infer<typeof companySchema>;

// Password change schema
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (password) => /[a-z]/.test(password),
      "Password must contain at least one lowercase letter"
    )
    .refine(
      (password) => /[_\W]/.test(password),
      "Password must contain at least one special character or underscore"
    ),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;

export default function ProfilePage() {
  const { user, userData } = useAuth() as { user: User | null; userData: UserData | null };
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [showEmail, setShowEmail] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);

  const companyForm = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company: userData?.company || "",
    },
  });

  // Update form when userData changes
  useEffect(() => {
    if (userData?.company) {
      companyForm.setValue("company", userData.company);
    }
  }, [userData, companyForm]);

  const onCompanySubmit = async (data: CompanyValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await setDoc(doc(db, "users", user.uid), {
        company: data.company
      }, { merge: true });
      
      toast.success("Company name updated successfully");
      setIsEditingCompany(false);
    } catch (error) {
      toast.error("Failed to update company name", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        const sub = await getSubscription(user.uid);
        setSubscription(sub);
      }
    };
    fetchSubscription();
  }, [user]);

  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordChangeValues) => {
    try {
      setIsLoading(true);
      await updatePassword(data.currentPassword, data.newPassword);
      toast.success("Password updated successfully");
      form.reset();
      setIsChangingPassword(false);
    } catch (error) {
      toast.error("Failed to update password", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Never";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <ConsoleNavbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#2496f8] to-[#1d8ae3] p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl border-2 border-white/30">
                    {userData?.name?.[0].toUpperCase() || user?.email?.[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{userData?.name}</h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto"
                        onClick={() => setShowEmail(!showEmail)}
                      >
                        {showEmail ? (
                          <span className="text-sm">{user?.email}</span>
                        ) : (
                          <span className="text-sm flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>Click To See</span>
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#2496f8]/10 flex items-center justify-center">
                      <Building className="h-5 w-5 text-[#2496f8]" />
                    </div>
                    {!isEditingCompany ? (
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {userData?.company || "Not set"}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-[#2496f8]/10"
                            onClick={() => setIsEditingCompany(true)}
                          >
                            <Edit2 className="h-4 w-4 text-[#2496f8]" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Form {...companyForm}>
                        <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="flex-1">
                          <FormField
                            control={companyForm.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      {...field}
                                      placeholder="Enter company name"
                                      className="h-8"
                                      disabled={isLoading}
                                    />
                                    <Button
                                      type="submit"
                                      size="sm"
                                      className="h-8 px-2 bg-[#2496f8] hover:bg-[#1d8ae3]"
                                      disabled={isLoading}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 px-2"
                                      onClick={() => {
                                        setIsEditingCompany(false);
                                        companyForm.reset();
                                      }}
                                      disabled={isLoading}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                    )}
                  </div>
                </div>

                <Link
                  href="/history"
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#2496f8]/10 flex items-center justify-center group-hover:bg-[#2496f8]/20 transition-colors">
                    <Receipt className="h-5 w-5 text-[#2496f8]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Billing Logs</p>
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-[#2496f8] transition-colors">View Billing Logs</p>
                  </div>
                </Link>
              </div>
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => setIsChangingPassword(true)}
                  variant="outline"
                  className="w-full justify-start space-x-2 hover:bg-[#2496f8]/5 hover:text-[#2496f8] hover:border-[#2496f8] transition-colors"
                >
                  <Lock className="h-4 w-4" />
                  <span>Reset Login Info</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start space-x-2 hover:bg-[#2496f8]/5 hover:text-[#2496f8] hover:border-[#2496f8] transition-colors"
                  asChild
                >
                  <Link href="/console">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#2496f8]/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-[#2496f8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subscription Status</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your subscription and billing</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
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
                      <Button
                        variant="outline"
                        className="w-full hover:bg-[#2496f8] hover:text-white transition-colors"
                        asChild
                      >
                        <Link href="/payment">Renew Subscription</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-6 w-6 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Subscribe to a plan to access all features
                    </p>
                    <Button
                      variant="outline"
                      className="hover:bg-[#2496f8] hover:text-white transition-colors"
                      asChild
                    >
                      <Link href="/payment">View Plans</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Account Security Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#2496f8]/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-[#2496f8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Login Settings</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account security settings</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {!isChangingPassword ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#2496f8]/10 flex items-center justify-center">
                          <Lock className="h-5 w-5 text-[#2496f8]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Password</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Last changed: {formatDate(userData?.lastPasswordChange ?? 'N/A')}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsChangingPassword(true)}
                        variant="outline"
                        className="hover:bg-[#2496f8] hover:text-white transition-colors"
                      >
                        Change
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#2496f8]/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-[#2496f8]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Email Verification</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user?.emailVerified ? "Verified" : "Not verified"}
                          </p>
                        </div>
                      </div>
                      {!user?.emailVerified && (
                        <Button
                          variant="outline"
                          className="hover:bg-[#2496f8] hover:text-white transition-colors"
                          onClick={() => toast.error("Please verify your email first")}
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                                <PasswordInput
                                  placeholder="Enter your current password"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                                <PasswordInput
                                  placeholder="Enter your new password"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                                <PasswordInput
                                  placeholder="Confirm your new password"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex space-x-4 pt-2">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-[#2496f8] hover:bg-[#1d8ae3] text-white"
                        >
                          {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsChangingPassword(false);
                            form.reset();
                          }}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 