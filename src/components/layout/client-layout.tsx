"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/MobileNav";
import { BreakingAlert } from "@/components/ui/breaking-alert";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { MaintenancePage } from "@/components/layout/MaintenancePage";

interface ClientLayoutProps {
    children: ReactNode;
    footer: ReactNode;
    isMaintenanceMode: boolean;
    initialCategories?: any[];
    initialMetrics?: any;
    initialAlert?: any;
    headerNavigation?: any[];
    sideNavigation?: any[];
}

export function ClientLayout({
    children,
    footer,
    isMaintenanceMode,
    initialCategories = [],
    initialMetrics = null,
    initialAlert = null,
    headerNavigation = [],
    sideNavigation = []
}: ClientLayoutProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const isAuthPath = pathname === '/auth' || pathname.startsWith('/auth/');
    const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/');

    // UI RENDERING LOGIC
    // We hide the standard layout (Sidebar/Header) for:
    // 1. Auth pages (Signin/Signup)
    // 2. Admin pages (Management Workspace)
    const shouldHideStandardLayout = isAuthPath || isAdminPath;

    // INSTITUTIONAL OVERRIDE (Maintenance Bypass)
    // Allow ADMIN, EDITOR, and AUTHOR to bypass the maintenance screen.
    const userRole = session?.user?.role;
    const canBypassMaintenance = userRole === 'ADMIN' || userRole === 'EDITOR' || userRole === 'AUTHOR';

    // MAINTENANCE FRAMEWORK
    // If enabled, restrict all public ingress routes unless overridden by institutional role.
    if (isMaintenanceMode && !shouldHideStandardLayout && !canBypassMaintenance) {
        return (
            <AnalyticsProvider>
                <MaintenancePage />
            </AnalyticsProvider>
        );
    }

    if (shouldHideStandardLayout) {
        return (
            <AnalyticsProvider>
                <div className="min-h-screen bg-background w-full overflow-hidden flex flex-col">
                    <main className="min-h-screen w-full">
                        {children}
                    </main>
                </div>
            </AnalyticsProvider>
        );
    }

    return (
        <AnalyticsProvider>
            <div className="flex min-h-screen bg-background text-foreground">
                <Sidebar
                    initialCategories={initialCategories}
                    initialMetrics={initialMetrics}
                    navigationItems={sideNavigation}
                />
                <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                    <BreakingAlert initialAlert={initialAlert} />
                    <Header
                        navigationItems={headerNavigation}
                        onMenuClick={() => setIsMobileNavOpen(true)}
                    />
                    <MobileNav
                        isOpen={isMobileNavOpen}
                        onClose={() => setIsMobileNavOpen(false)}
                        categories={initialCategories}
                    />
                    <main className="flex-1">
                        {children}
                    </main>
                    {footer}
                </div>
            </div>
        </AnalyticsProvider>
    );
}
