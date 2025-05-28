"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, User, KeyRound, Bell, Shield, Home, HelpCircle, Unlock, ChevronDown, Zap, Lock, Users, Receipt } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { logOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Define types for navigation items
type NavigationItem = {
  name: string;
  href?: string;
  dropdown?: {
    name: string;
    icon: React.ElementType;
  }[];
};

function ConsoleNavbarContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Redirect to verify-email if not verified
  useEffect(() => {
    if (user && !user.emailVerified) {
      router.replace('/verify-email');
      return;
    }
  }, [user, router]);

  // Navigation items matching main navbar
  const navigation: NavigationItem[] = [
    { name: "Home", href: "/" },
    { name: "Unlock The Cost", href: "/pricing" },
    { name: "Know Us", href: "/know-us" },
    { name: "Knowledge Hub", href: "/knowledge-hub" },
    { name: "Blog", href: "/blog" },
    { name: "Help", href: "/help" },
    // Only show Console link if email is verified
    ...(user?.emailVerified ? [{ name: "Console", href: "/console" }] : []),
  ];

  const isActive = (path: string | undefined) => path ? pathname === path : false;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logOut();
      toast.success("You've been logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const settingsOptions = [
    {
      name: "Edit Profile",
      icon: User,
      href: "/console/profile",
      description: "Update your personal information"
    },
    {
      name: "Change Password",
      icon: KeyRound,
      href: "/console/change-password",
      description: "Update your account password"
    },
    {
      name: "Notifications",
      icon: Bell,
      href: "/console/notifications",
      description: "Manage your notification preferences"
    },
    {
      name: "Security Settings",
      icon: Shield,
      href: "/console/security",
      description: "Configure security options"
    }
  ];

  // Get user initial and name with fallbacks, but only when we have complete data
  const userInitial = !loading && userData?.name ? userData.name[0].toUpperCase() : '?';
  const userName = !loading && userData?.name ? userData.name : 'User';

  // Only show profile when we have complete user data
  const showProfile = !loading && user && userData;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <img 
                src="/images/logo/logo.png" 
                width={150} 
                height={150} 
                alt="Wiggle Byte Logo" 
                className="group-hover:scale-110 transition-transform duration-200"
                style={{ borderRadius: '0' }}
              />
              <span className="font-bold text-2xl text-[#2496f8] group-hover:text-[#1d8ae3] transition-colors duration-200">
                
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative" ref={item.dropdown ? dropdownRef : undefined}>
                {item.dropdown ? (
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-[#2496f8]"
                  >
                    {item.name}
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : item.name === "Console" && !user?.emailVerified ? (
                  <button
                    onClick={() => {
                      toast.error("Please verify your email first", {
                        description: "Check your inbox for the verification link"
                      });
                      router.push('/verify-email');
                    }}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                    disabled
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      isActive(item.href)
                        ? "text-[#2496f8] bg-blue-50 dark:bg-blue-950"
                        : "text-gray-700 dark:text-gray-300 hover:text-[#2496f8]"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.dropdown && isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    {item.dropdown.map((dropdownItem) => {
                      const Icon = dropdownItem.icon;
                      return (
                        <div
                          key={dropdownItem.name}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 cursor-default"
                        >
                          <Icon className="h-5 w-5 mr-3 text-[#2496f8]" />
                          <div>
                            <div className="font-medium">{dropdownItem.name}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Profile and Logout */}
          {showProfile && (
            <div className="flex items-center space-x-4" ref={profileRef}>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-[#2496f8] dark:hover:text-[#2496f8]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2496f8] flex items-center justify-center text-white">
                    {userInitial}
                  </div>
                  <span className="hidden md:inline-block">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {user?.emailVerified ? (
                      <>
                        <Link
                          href="/console/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Identity
                        </Link>
                        <Link
                          href="/history"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          Billing Logs
                        </Link>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          toast.error("Please verify your email first", {
                            description: "Check your inbox for the verification link"
                          });
                          router.push('/verify-email');
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        disabled
                      >
                        <User className="h-4 w-4 mr-2" />
                        Identity
                      </button>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {isLoading ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4 space-y-2">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.dropdown ? (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#2496f8] hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {item.name}
                </button>
              ) : item.name === "Console" && !user?.emailVerified ? (
                <button
                  onClick={() => {
                    toast.error("Please verify your email first", {
                      description: "Check your inbox for the verification link"
                    });
                    router.push('/verify-email');
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                  disabled
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  href={item.href || '#'}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-[#2496f8] bg-blue-50 dark:bg-blue-950"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#2496f8] hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.name}
                </Link>
              )}
              {/* Mobile dropdown items */}
              {item.dropdown && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.dropdown.map((dropdownItem) => {
                    const Icon = dropdownItem.icon;
                    return (
                      <div
                        key={dropdownItem.name}
                        className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 cursor-default"
                      >
                        <Icon className="h-4 w-4 mr-2 text-[#2496f8]" />
                        {dropdownItem.name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          
          {/* Mobile Profile Section */}
          {showProfile && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
              <div className="flex items-center px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-[#2496f8] flex items-center justify-center text-white mr-2">
                  {userInitial}
                </div>
                <span className="text-gray-700 dark:text-gray-300">{userName}</span>
              </div>
              {user?.emailVerified ? (
                <>
                  <Link
                    href="/console/profile"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Identity
                  </Link>
                  <Link
                    href="/history"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Billing Logs
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    toast.error("Please verify your email first", {
                      description: "Check your inbox for the verification link"
                    });
                    router.push('/verify-email');
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                  disabled
                >
                  Identity 
                </button>
              )}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export function ConsoleNavbar() {
  return (
    <Suspense fallback={
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    }>
      <ConsoleNavbarContent />
    </Suspense>
  );
} 