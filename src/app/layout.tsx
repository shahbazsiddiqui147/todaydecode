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
  // 1. Get maintenance state
  const m1 = process.env.MAINTENANCE_MODE;
  const m2 = process.env.NEXT_PUBLIC_MAINTENANCE_MODE;
  const maintenanceRaw = String(m1 || m2 || '').toLowerCase().trim();
  const isMaintenanceMode = maintenanceRaw.includes('true') || maintenanceRaw === '1' || maintenanceRaw === 'on';

  // 2. SERVER-SIDE REDIRECTION GUARD
  // This runs on every page request handled by this layout
  if (isMaintenanceMode) {
    const headerList = await headers();
    const pathname = headerList.get('x-invoke-path') || ''; // Standard Next.js header for path

    // We only redirect if we aren't already going to coming-soon
    const isComingSoonPage = pathname.includes('/coming-soon');
    const isStaticAsset = pathname.includes('.') || pathname.startsWith('/_next');

    // Check for preview bypass via cookie or header
    const hasPreviewCookie = headerList.get('cookie')?.includes('preview_access=true');
    const hasPreviewQuery = headerList.get('referer')?.includes('preview=true');

    if (!isComingSoonPage && !isStaticAsset && !hasPreviewCookie && !hasPreviewQuery) {
      // Since we can't reliably get the full path in all scenarios here, 
      // we rely on ClientLayout to hide everything, but we can attempt a hard redirect
      // if we are sure we aren't on coming-soon.
      if (pathname === '/' || pathname === '') {
        redirect('/coming-soon/');
      }
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
