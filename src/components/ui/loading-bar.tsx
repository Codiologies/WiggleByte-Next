'use client';

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function LoadingBarContent() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Show loading bar on route change start
    window.addEventListener('beforeunload', handleStart);
    
    // Hide loading bar when route change is complete
    const timeout = setTimeout(() => {
      handleComplete();
    }, 500); // Adjust timing as needed

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]); // Re-run effect on route change

  if (!isLoading) return null;

  return (
    <div className="loading-bar" />
  );
}

export function LoadingBar() {
  return (
    <Suspense fallback={null}>
      <LoadingBarContent />
    </Suspense>
  );
} 