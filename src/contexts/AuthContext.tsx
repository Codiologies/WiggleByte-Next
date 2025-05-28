'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getUserData, type UserData } from '@/lib/firebase/auth';
import { signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';

// Define paths that require authentication
const PROTECTED_PATHS = [
  '/console',
  '/console/profile',
  '/console/settings',
  // Add any other paths that should be protected
];

// Define paths that require email verification
const VERIFIED_PATHS = [
  '/console',
  '/console/profile',
  '/console/settings',
  // Add any other paths that require email verification
];

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: Error | null;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  error: null,
  isEmailVerified: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AuthContextType['userData']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if current path requires authentication or verification
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname?.startsWith(path));
  const requiresVerification = VERIFIED_PATHS.some(path => pathname?.startsWith(path));

  useEffect(() => {
    let unsubscribe: () => void;
    let mounted = true;

    const setupAuth = async () => {
      try {
        unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (!mounted) return;

          try {
            setUser(user);
            
            if (user) {
              // Check email verification status
              const emailVerified = user.emailVerified;
              setIsEmailVerified(emailVerified);

              // Get user data from Firestore
              const data = await getUserData(user.uid);
              if (!mounted) return;
              
              if (data) {
                setUserData(data);
              } else {
                console.error('User data not found in Firestore');
                setError(new Error('User data not found. Please sign up again.'));
                // Sign out the user if their data is missing
                await signOut(auth);
              }

              // Handle protected routes and verification requirements
              if (isProtectedPath) {
                if (requiresVerification && !emailVerified) {
                  router.replace('/verify-email');
                }
              }
            } else {
              setUserData(null);
              setIsEmailVerified(false);
              
              // Redirect if on protected path but not logged in
              if (isProtectedPath) {
                router.replace('/login');
              }
            }
          } catch (err) {
            if (!mounted) return;
            console.error('Error in auth state change:', err);
            setError(err instanceof Error ? err : new Error('Unknown error occurred'));
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
        });
      } catch (err) {
        console.error('Error setting up auth:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize authentication'));
        setLoading(false);
      }
    };

    setupAuth();

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router, pathname, isProtectedPath, requiresVerification]);

  return (
    <AuthContext.Provider value={{ user, userData, loading, error, isEmailVerified }}>
      {children}
    </AuthContext.Provider>
  );
} 