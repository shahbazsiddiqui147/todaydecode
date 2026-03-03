import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { constructMetadata } from "@/lib/seo";
import { ClientLayout } from "@/components/layout/client-layout";
import { Suspense } from "react";
import { PreviewBanner } from "@/components/ui/PreviewBanner";
import {
  fetchShellCategories,
  fetchShellMetrics,
  fetchHighestRiskAlert,
  fetchHeaderNavigation,
  fetchSideNavigation,
  fetchSiteSettings
} from "@/lib/fetchers";

import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = constructMetadata({
  title: "Today Decode — Global Strategic Analysis & Geopolitical Risk",
  description: "Strategic analysis of Geopolitics, Economy, Security, and Global Shifts.",
  path: "/",
});

async function ShellDataWrapper({ children }: { children: React.ReactNode }) {
  const [categories, metrics, highestRiskAlert, headerNav, sideNav, settings] = await Promise.all([
    fetchShellCategories(),
    fetchShellMetrics(),
    fetchHighestRiskAlert(),
    fetchHeaderNavigation(),
    fetchSideNavigation(),
    fetchSiteSettings()
  ]);

  return (
    <ClientLayout
      isMaintenanceMode={settings.maintenanceMode}
      initialCategories={categories}
      initialMetrics={metrics}
      initialAlert={highestRiskAlert as any}
      headerNavigation={headerNav}
      sideNavigation={sideNav}
      footer={<Footer />}
    >
      {children}
    </ClientLayout>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={
              <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
                <div className="h-1 w-32 bg-secondary overflow-hidden rounded-full">
                  <div className="h-full bg-accent-red animate-progress-loading" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                  Initializing Strategic Assets...
                </span>
              </div>
            }>
              <ShellDataWrapper>
                {children}
              </ShellDataWrapper>
              <PreviewBanner />
            </Suspense>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
