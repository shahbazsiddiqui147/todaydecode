"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BreakingAlert } from "@/components/ui/breaking-alert";
import { ReactNode } from "react";

interface ClientLayoutProps {
    children: ReactNode;
    isMaintenanceMode: boolean;
}

export function ClientLayout({ children, isMaintenanceMode }: ClientLayoutProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Check if we are on the coming-soon page
    const isComingSoon = pathname === '/coming-soon';

    // Developer bypass check (matching middleware logic)
    const isPreviewParam = searchParams.get('preview') === 'true';

    // Hiding rules:
    // If it's the coming-soon page, hide menus (unless it's a preview)
    // If maintenance mode is active globally AND not in preview, hide menus
    const shouldHideMenus = (isComingSoon || isMaintenanceMode) && !isPreviewParam;

    if (shouldHideMenus) {
        return <main className="min-h-screen bg-black">{children}</main>;
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
