import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { constructMetadata } from "@/lib/seo";
import { ClientLayout } from "@/components/layout/client-layout";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = constructMetadata({
  title: "Today Decode — Global Intelligence & Geopolitical Risk",
  description: "Strategic analysis of Geopolitics, Economy, Security, and Global Shifts.",
  path: "/",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use robust check for maintenance mode env var
  const maintenanceEnv = String(process.env.MAINTENANCE_MODE || process.env.NEXT_PUBLIC_MAINTENANCE_MODE || '').toLowerCase().trim();
  const isMaintenanceMode = maintenanceEnv === 'true' || maintenanceEnv === '1' || maintenanceEnv === 'on';

  // Secondary Redirection Guard for the Server Side
  if (isMaintenanceMode) {
    const list = await headers();
    const pathname = list.get('x-url') || ''; // Middleware can be configured to pass this
    const searchParamsString = list.get('x-query') || '';

    // Check if we are on the coming-soon page to avoid redirect loops
    // Middleware should have handled this, but we check here too.
    const isComingSoon = pathname.includes('/coming-soon');
    const isPreview = searchParamsString.includes('preview=true');

    if (!isComingSoon && !isPreview) {
      // Only redirect if NOT on the coming-soon page and NOT in preview
      // Note: next/headers doesn't always have pathname, so we rely on middleware if possible
      // But the ClientLayout will hide the UI anyway if isMaintenanceMode is true.
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={<div className="min-h-screen bg-black" />}>
              <ClientLayout isMaintenanceMode={isMaintenanceMode}>
                {children}
              </ClientLayout>
            </Suspense>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
