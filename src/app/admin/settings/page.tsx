import { Settings as SettingsIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B] dark:border-[#1E293B]">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-[#94A3B8] uppercase italic pb-1">Platform <span className="text-[#64748B] dark:text-[#F1F5F9] not-italic">Parameters</span></h1>
                    <p className="text-[#64748B] dark:text-[#94A3B8] text-xs font-black uppercase tracking-widest">Configure global institutional sovereignty settings.</p>
                </div>
                <Button className="h-11 rounded-xl font-black uppercase tracking-widest text-[11px] px-6 shadow-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-black dark:hover:bg-white/90">
                    <Save className="h-4 w-4 mr-2" /> Commit Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card border border-[#1E293B] p-8 rounded-[2.5rem] space-y-6">
                    <h3 className="text-xs font-black uppercase italic tracking-widest text-muted-foreground border-b border-[#1E293B] pb-4">Aesthetic Protocol</h3>
                    <div className="space-y-4 text-xs font-black uppercase tracking-widest text-muted-foreground italic">
                        <p>// Default Maintenance Mode: <span className="text-emerald-500">OFF</span></p>
                        <p>// Trailing Slash Enforcement: <span className="text-emerald-500">ON</span></p>
                        <p>// Institutional Border Hardening: <span className="text-emerald-500">ON</span></p>
                    </div>
                </div>

                <div className="bg-card border border-[#1E293B] p-8 rounded-[2.5rem] flex flex-col items-center justify-center">
                    <SettingsIcon className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic text-center">Settings configuration silo in terminal phase...</span>
                </div>
            </div>
        </div>
    );
}
