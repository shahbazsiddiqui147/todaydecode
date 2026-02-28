import { Sidebar } from "@/components/admin/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
    title: "Admin Command Center | Today Decode",
    description: "Administrative sovereignty layer for geopolitical intelligence management.",
    path: "/admin/",
    noIndex: true, // Hide admin from Google
});

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#0A0F1E] text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
