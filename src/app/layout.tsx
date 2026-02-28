import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { constructMetadata } from "@/lib/seo";
import { ClientLayout } from "@/components/layout/client-layout";
import { Suspense } from "react";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const maintenanceEnv = String(process.env.MAINTENANCE_MODE || process.env.NEXT_PUBLIC_MAINTENANCE_MODE || '').toLowerCase().trim();
  const isMaintenanceMode = maintenanceEnv === 'true' || maintenanceEnv === '1' || maintenanceEnv === 'on';

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
