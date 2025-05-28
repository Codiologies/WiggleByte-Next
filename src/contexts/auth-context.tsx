'use client';

import { createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  userData: {
    name: string;
    email: string;
    company: string;
    createdAt: string;
    emailVerified?: boolean;
    verifiedAt?: string;
    lastPasswordChange?: string;
  } | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // This is a placeholder - the actual implementation should be in your AuthContext.tsx
  // We're just creating this to fix the import error
  return (
    <AuthContext.Provider value={{
      user: null,
      userData: null,
      loading: true,
      error: null,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 