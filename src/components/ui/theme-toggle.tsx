"use client";

import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-md"
        disabled
      >
        <Sun className="h-5 w-5" />
        <span className="sr-only">Loading theme</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("light")}
        className={`relative p-2 rounded-md transition-all duration-200 ${
          theme === "light"
            ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/70 dark:hover:bg-gray-700/70"
        }`}
        title="Light"
      >
        <Sun className="h-4 w-4" />
        {theme === "light" && (
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("dark")}
        className={`relative p-2 rounded-md transition-all duration-200 ${
          theme === "dark"
            ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/70 dark:hover:bg-gray-700/70"
        }`}
        title="Dark"
      >
        <Moon className="h-4 w-4" />
        {theme === "dark" && (
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("system")}
        className={`relative p-2 rounded-md transition-all duration-200 ${
          theme === "system"
            ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/70 dark:hover:bg-gray-700/70"
        }`}
        title="System"
      >
        <Monitor className="h-4 w-4" />
        {theme === "system" && (
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
        )}
      </Button>
    </div>
  );
}
