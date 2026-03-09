import { Sidebar } from "@/components/admin/sidebar";
import { constructMetadata } from "@/lib/seo";
import { Toaster } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = constructMetadata({
    title: "Admin Research Desk",
    description: "Institutional oversight layer for geopolitical strategic management.",
    path: "/admin/",
    noIndex: true,
});

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#020617] text-[#F1F5F9] transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="h-16 shrink-0 border-b border-[#1E293B] bg-[#020617]/80 backdrop-blur-md flex items-center justify-end px-10">
                    <ThemeToggle />
                </header>
                <main className="flex-1 overflow-y-auto bg-[#020617]">
                    <div className="p-10 max-w-7xl mx-auto space-y-10">
                        {children}
                    </div>
                </main>
            </div>
            <Toaster position="top-right" richColors closeButton />
        </div>
    );
}
