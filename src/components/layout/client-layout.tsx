"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BreakingAlert } from "@/components/ui/breaking-alert";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { ReactNode } from "react";
interface ClientLayoutProps {
    children: ReactNode;
    footer: ReactNode;
    isMaintenanceMode: boolean;
    initialCategories?: any[];
    initialMetrics?: any;
    initialAlert?: any;
}

export function ClientLayout({
    children,
    footer,
    isMaintenanceMode,
    initialCategories = [],
    initialMetrics = null,
    initialAlert = null
}: ClientLayoutProps) {
    const pathname = usePathname();

    const isComingSoon = pathname === '/coming-soon' || pathname === '/coming-soon/';
    const isAuthPath = pathname.startsWith('/auth');
    const isAdminPath = pathname.startsWith('/admin');

    // UI RENDERING LOGIC
    // We hide the standard layout (Sidebar/Header) for:
    // 1. Coming Soon page
    // 2. Auth pages (Signin/Signup)
    // 3. Admin pages (Management Workspace)
    const shouldHideStandardLayout = isComingSoon || isAuthPath || isAdminPath;

    if (shouldHideStandardLayout) {
        return (
            <div className="min-h-screen bg-background w-full overflow-hidden flex flex-col">
                <main className="min-h-screen w-full">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar initialCategories={initialCategories} initialMetrics={initialMetrics} />
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                <BreakingAlert initialAlert={initialAlert} />
                <Header />
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
                {footer}
            </div>
        </div>
    );
}
