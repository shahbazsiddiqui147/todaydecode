"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BreakingAlert } from "@/components/ui/breaking-alert";
import { ReactNode, useEffect } from "react";
import { ShieldAlert } from "lucide-react";

interface ClientLayoutProps {
    children: ReactNode;
    isMaintenanceMode: boolean;
}

export function ClientLayout({ children, isMaintenanceMode }: ClientLayoutProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const isComingSoon = pathname === '/coming-soon' || pathname === '/coming-soon/';
    const isAuthPath = pathname.startsWith('/auth');
    const isAdminPath = pathname.startsWith('/admin');
    const isPreviewParam = searchParams.get('preview') === 'true';

    // FAIL-SAFE REDIRECT: Push public traffic to coming-soon
    useEffect(() => {
        if (isMaintenanceMode && !isComingSoon && !isPreviewParam && !isAdminPath && !isAuthPath) {
            router.push('/coming-soon/');
        }
    }, [isMaintenanceMode, isComingSoon, isPreviewParam, isAdminPath, isAuthPath, router]);

    // UI RENDERING LOGIC
    // We hide the standard layout (Sidebar/Header) for:
    // 1. Coming Soon page
    // 2. Auth pages (Signin/Signup)
    // 3. Public pages during maintenance
    const shouldHideStandardLayout = isComingSoon || isAuthPath || (isMaintenanceMode && !isPreviewParam && !isAdminPath);

    if (shouldHideStandardLayout) {
        return (
            <div className="min-h-screen bg-black w-full overflow-hidden flex flex-col items-center justify-center">
                {/* 
                  Show Pulse Shield ONLY if this is a public page caught in maintenance.
                  If it's Auth or Coming Soon, render the children immediately.
                */}
                {(isMaintenanceMode && !isPreviewParam && !isComingSoon && !isAdminPath && !isAuthPath) ? (
                    <div className="flex flex-col items-center space-y-4 animate-pulse">
                        <ShieldAlert className="h-12 w-12 text-accent-red" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Establishing Protocol...</span>
                    </div>
                ) : (
                    <main className="min-h-screen w-full">
                        {children}
                    </main>
                )}
            </div>
        );
    }

    // Standard Layout (Dashboard / Public Pages with Nav)
    return (
        <div className="flex min-h-screen bg-primary">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                <BreakingAlert />
                <Header />
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
