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

    // Check if we are on the coming-soon page
    const isComingSoon = pathname === '/coming-soon' || pathname === '/coming-soon/';

    // Developer bypass check
    const isPreviewParam = searchParams.get('preview') === 'true';

    // Hiding rules
    const shouldHideMenus = (isComingSoon || isMaintenanceMode) && !isPreviewParam;

    // CLIENT-SIDE REDIRECT FAIL-SAFE
    // If we are in maintenance mode, not in preview, and NOT on the coming-soon page, force a client-side move.
    useEffect(() => {
        if (isMaintenanceMode && !isComingSoon && !isPreviewParam) {
            router.push('/coming-soon/');
        }
    }, [isMaintenanceMode, isComingSoon, isPreviewParam, router]);

    if (shouldHideMenus) {
        return (
            <div className="min-h-screen bg-black w-full overflow-hidden flex flex-col items-center justify-center">
                {!isComingSoon ? (
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
