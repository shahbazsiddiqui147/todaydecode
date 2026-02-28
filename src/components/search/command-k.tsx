"use client";

import * as React from "react";
import { Command } from "cmdk";
import {
    Globe,
    TrendingUp,
    ShieldAlert,
    Cpu,
    Zap,
    Search,
    FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function CommandK() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    // Toggle the menu when ⌘K is pressed
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex w-full max-w-md items-center space-x-3 rounded-md border border-border-slate bg-transparent px-3 py-1.5 text-sm text-slate-400 group hover:border-slate-400 transition-colors"
            >
                <Search className="h-4 w-4" />
                <span className="flex-1 text-left">Search intelligence metrics or articles...</span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border-slate bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                label="Global Search"
                className="fixed inset-0 z-50 flex items-start justify-center pt-24"
                overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm"
            >
                <div className="w-full max-w-[640px] rounded-xl border border-border-slate bg-background shadow-2xl overflow-hidden">
                    <div className="flex items-center border-b border-border-slate px-4 py-3">
                        <Search className="mr-2 h-4 w-4 text-slate-500" />
                        <Command.Input
                            placeholder="Search intelligence, regions, or risk indices..."
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
                        />
                    </div>

                    <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-none">
                        <Command.Empty className="py-6 text-center text-sm text-slate-500">
                            No results found for your query.
                        </Command.Empty>

                        <Command.Group heading="Categories" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1.5">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/geopolitics/"))}
                                className="flex items-center px-2 py-2 text-sm rounded-md aria-selected:bg-slate-800 aria-selected:text-white transition-colors cursor-pointer"
                            >
                                <Globe className="mr-3 h-4 w-4" />
                                Geopolitics
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/economy/"))}
                                className="flex items-center px-2 py-2 text-sm rounded-md aria-selected:bg-slate-800 aria-selected:text-white transition-colors cursor-pointer"
                            >
                                <TrendingUp className="mr-3 h-4 w-4" />
                                Global Economy
                            </Command.Item>
                        </Command.Group>

                        <Command.Group heading="Recent Intelligence" className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1.5">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/security/barents-gap-nato-silent-conflict/"))}
                                className="flex items-center px-2 py-2 text-sm rounded-md aria-selected:bg-slate-800 aria-selected:text-white transition-colors cursor-pointer"
                            >
                                <FileText className="mr-3 h-4 w-4" />
                                The Barents Gap Strategy
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/energy/strait-of-hormuz-energy-security/"))}
                                className="flex items-center px-2 py-2 text-sm rounded-md aria-selected:bg-slate-800 aria-selected:text-white transition-colors cursor-pointer"
                            >
                                <ShieldAlert className="mr-3 h-4 w-4" />
                                Strait of Hormuz Risk Assessment
                            </Command.Item>
                        </Command.Group>
                    </Command.List>

                    <div className="flex items-center justify-between border-t border-border-slate px-4 py-3 bg-slate-900/50">
                        <p className="text-[10px] text-slate-500 font-medium">SHIFTS: 12 NEW METRICS LOGGED SINCE 04:00 UTC</p>
                        <div className="flex items-center space-x-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                            <span className="text-[10px] text-slate-500 uppercase">System Ready</span>
                        </div>
                    </div>
                </div>
            </Command.Dialog>
        </>
    );
}
