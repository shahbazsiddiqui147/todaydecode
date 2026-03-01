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

    // UI RENDERING LOGIC
    // We hide the standard layout (Sidebar/Header) for:
    // 1. Coming Soon page
    // 2. Auth pages (Signin/Signup)
    // 3. Admin pages (Management Workspace)
    const shouldHideStandardLayout = isComingSoon || isAuthPath || isAdminPath;

    if (shouldHideStandardLayout) {
        return (
            <div className="min-h-screen bg-black w-full overflow-hidden flex flex-col items-center justify-center">
                <main className="min-h-screen w-full">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
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
