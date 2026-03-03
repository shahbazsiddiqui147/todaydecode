import { Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NavigationPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B] dark:border-[#1E293B]">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-[#94A3B8] uppercase italic pb-1">Site <span className="text-[#64748B] dark:text-[#F1F5F9] not-italic">Architecture</span></h1>
                    <p className="text-[#64748B] dark:text-[#94A3B8] text-xs font-black uppercase tracking-widest">Manage menus and navigational silos.</p>
                </div>
                <Button className="h-11 rounded-xl font-black uppercase tracking-widest text-[11px] px-6 shadow-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-black dark:hover:bg-white/90">
                    <Plus className="h-4 w-4 mr-2" /> New Menu Item
                </Button>
            </div>

            <div className="min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-[#1E293B] rounded-[2.5rem] bg-card/50">
                <div className="p-6 rounded-full bg-muted/50 mb-4">
                    <Layers className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-black uppercase text-foreground italic">Navigation Engine Standby</h3>
                <p className="text-sm text-muted-foreground font-black uppercase tracking-widest mt-2">Menu customization protocols available in Phase 2.0.</p>
            </div>
        </div>
    );
}
