"use client";

import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/images/logo/logo.png"
              width={150}
              height={150}
              alt="Wiggle Byte Logo"
              className="transition-transform duration-200"
              style={{ borderRadius: '0' }}
            />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>

        {/* Security Compliance */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ISO 27001 CERTIFIED</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SOC 2 TYPE II COMPLIANT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col items-center mt-8 space-y-2">
          <div className="flex gap-8">
            <Link 
              href="/privacy-policy" 
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              PRIVACY POLICY
            </Link>
            <Link 
              href="/terms-of-use" 
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              TERMS OF USE
            </Link>
          </div>
          
          {/* Copyright */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            COPYRIGHT © 2025. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}