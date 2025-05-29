import "./globals.css";
import type { Metadata } from "next";
import { Inter, Ubuntu_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { LoadingBar } from '@/components/ui/loading-bar';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/ui/theme-provider';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

const ubuntuMono = Ubuntu_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ubuntu-mono',
});

export const metadata: Metadata = {
  title: "WiggleByte",
  description: "Your AI coding companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={ubuntuMono.variable}>
      <body className={cn(
        'min-h-screen bg-background antialiased',
        inter.className
      )}>
        <LoadingBar />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Providers>
              {children}
              <Toaster richColors position="top-right" />
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
