import { Sidebar } from "@/components/admin/sidebar";
import { constructMetadata } from "@/lib/seo";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

export const metadata = constructMetadata({
    title: "Admin Command Center",
    description: "Administrative sovereignty layer for geopolitical intelligence management.",
    path: "/admin/",
    noIndex: true,
});

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0F172A]">
                <div className="p-10 max-w-7xl mx-auto space-y-10">
                    {children}
                </div>
            </main>
            <Toaster position="top-right" richColors closeButton />
        </div>
    );
}
