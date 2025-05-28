"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Receipt } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { logOut } from "@/lib/firebase/auth";
import { toast } from "sonner";

function NavbarContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, userData, loading } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("You've been logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  // Dynamic navigation based on auth state
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Unlock The Cost", href: "/pricing" },
    { name: "Know Us", href: "/know-us" },
    { name: "Knowledge Hub", href: "/knowledge-hub" },
    { name: "Blog", href: "/blog" },
    { name: "Help", href: "/help" },
    // Add Console link when user is logged in and email is verified
    ...(user && user.emailVerified ? [{ name: "Console", href: "/console" }] : []),
  ];

  const isActive = (path: string) => pathname === path;

  // Get user initial and name with fallbacks, but only when we have complete data
  const userInitial = !loading && userData?.name ? userData.name[0].toUpperCase() : '?';
  const userName = !loading && userData?.name ? userData.name : 'User';

  // Only show profile when we have complete user data
  const showProfile = !loading && user && userData;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
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

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.name === "Console" && !user?.emailVerified ? (
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
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        isActive(item.href)
                          ? "text-[#2496f8] bg-blue-50 dark:bg-blue-950"
                          : "text-gray-700 dark:text-gray-300 hover:text-[#2496f8]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {showProfile && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-[#2496f8] dark:hover:text-[#2496f8]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2496f8] flex items-center justify-center text-white">
                    {userInitial}
                  </div>
                  <span className="hidden md:inline-block">{userName}</span>
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
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            {!showProfile && (
              <>
                <Button
                  variant="outline"
                  asChild
                  className="border-2 border-[#2496f8] text-[#2496f8] hover:bg-[#2496f8] hover:text-white dark:border-[#2496f8] dark:text-[#2496f8] transition-all duration-200 font-medium"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-[#2496f8] hover:bg-[#1d8ae3] text-white px-6 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 hover:scale-105"
                >
                  <Link href="/signup">SignUp</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-[#2496f8] hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.name === "Console" && !user?.emailVerified ? (
                  <button
                    onClick={() => {
                      toast.error("Please verify your email first", {
                        description: "Check your inbox for the verification link"
                      });
                      router.push('/verify-email');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                    disabled
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "text-[#2496f8] bg-blue-50 dark:bg-blue-950"
                        : "text-gray-700 dark:text-gray-300 hover:text-[#2496f8] hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Mobile Auth Buttons / Profile */}
            <div className="pt-4 space-y-2 border-t border-gray-200 dark:border-gray-800 mt-4">
              {showProfile && (
                <>
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
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Identity
                      </Link>

                      <Link
                        href="/history"
                        className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setIsMenuOpen(false)}
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
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                      disabled
                    >
                      Identity
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </>
              )}
              {!showProfile && (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full border-2 border-[#2496f8] text-[#2496f8] hover:bg-[#2496f8] hover:text-white"
                  >
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-[#2496f8] hover:bg-[#1d8ae3] text-white font-medium"
                  >
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>SignUp</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
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
      <NavbarContent />
    </Suspense>
  );
}
