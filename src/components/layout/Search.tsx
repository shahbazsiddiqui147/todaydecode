"use client";

import * as React from "react";
import { Command } from "cmdk";
import {
    Search as SearchIcon,
    FileText,
    User,
    Layers,
    ChevronRight,
    Loader2,
    ShieldAlert,
    TrendingUp,
    Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { globalSearch } from "@/lib/actions/public-actions";

export function Search() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<{
        articles: any[],
        categories: any[],
        authors: any[]
    }>({ articles: [], categories: [], authors: [] });
    const [isLoading, setIsLoading] = React.useState(false);
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

    // Perform search as query changes
    React.useEffect(() => {
        if (!query || query.length < 2) {
            setResults({ articles: [], categories: [], authors: [] });
            return;
        }

        const handler = setTimeout(async () => {
            setIsLoading(true);
            try {
                const data = await globalSearch(query);
                setResults(data);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [query]);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    const formatLabel = (format: string) => {
        return format.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center space-x-0 sm:space-x-3 rounded-lg border border-[#1E293B] bg-transparent px-2 sm:px-3 py-1.5 text-sm text-[#94A3B8] group hover:border-[#22D3EE]/50 transition-colors shadow-subtle-glow w-auto sm:w-full sm:max-w-md"
            >
                <SearchIcon className="h-4 w-4" />
                <span className="hidden sm:inline-flex flex-1 text-left">Search strategic assessments, silos, or analysts...</span>
                <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-[#1E293B] bg-[#0F172A] px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100 uppercase">
                    <span className="text-xs font-sans">⌘</span>K
                </kbd>
            </button>

            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                label="Global Strategic Search"
                className="fixed inset-0 z-50 flex items-start justify-center pt-24"
                overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-md"
            >
                <div className="w-full max-w-[640px] rounded-xl border border-[#1E293B] bg-[#111827] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center border-b border-[#1E293B] px-4 py-4">
                        <SearchIcon className="mr-3 h-5 w-5 text-slate-500" />
                        <Command.Input
                            value={query}
                            onValueChange={setQuery}
                            placeholder="Search strategic assessments, silos, or research fellows..."
                            className="flex-1 bg-transparent text-base outline-none placeholder:text-slate-600 text-slate-100"
                        />
                        {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin text-[#22D3EE]" />}
                    </div>

                    <Command.List className="max-h-[450px] overflow-y-auto p-2 scrollbar-none">
                        <Command.Empty className="py-12 text-center">
                            <Layers className="h-10 w-10 text-slate-800 mx-auto mb-4 opacity-20" />
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest leading-relaxed">
                                No records identified for<br />
                                <span className="text-[#22D3EE]">"{query}"</span>
                            </p>
                        </Command.Empty>

                        {/* STRATEGIC ASSESSMENTS */}
                        {results.articles.length > 0 && (
                            <Command.Group heading="Strategic Assessments" className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 py-3">
                                {results.articles.map((item) => (
                                    <Command.Item
                                        key={item.id}
                                        onSelect={() => runCommand(() => router.push(item.fullPath))}
                                        className="flex items-center justify-between px-3 py-3 text-sm rounded-md aria-selected:bg-[#1E293B] aria-selected:text-[#22D3EE] transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center min-w-0 flex-1">
                                            <div className="mr-3 h-8 w-8 rounded border border-white/5 bg-white/5 flex items-center justify-center shrink-0">
                                                <FileText className="h-4 w-4 text-slate-500 group-aria-selected:text-[#22D3EE]" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="truncate font-bold tracking-tight uppercase text-xs">{item.title}</span>
                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest group-aria-selected:text-[#22D3EE]/70">
                                                    {formatLabel(item.format)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center ml-4 shrink-0">
                                            <div className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-black tracking-tighter border",
                                                item.riskScore > 75
                                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                    : item.riskScore > 40
                                                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                            )}>
                                                {item.riskScore}% <span className="text-[8px] opacity-60">RISK</span>
                                            </div>
                                            <ChevronRight className="ml-2 h-3 w-3 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                                        </div>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {/* RESEARCH DESKS */}
                        {results.categories.length > 0 && (
                            <Command.Group heading="Research Desks" className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 py-3">
                                {results.categories.map((item) => (
                                    <Command.Item
                                        key={item.id}
                                        onSelect={() => runCommand(() => router.push(item.fullPath))}
                                        className="flex items-center px-3 py-3 text-sm rounded-md aria-selected:bg-[#1E293B] aria-selected:text-[#22D3EE] transition-all cursor-pointer group"
                                    >
                                        <div className="mr-3 h-8 w-8 rounded border border-white/5 bg-white/5 flex items-center justify-center shrink-0">
                                            <Layers className="h-4 w-4 text-slate-500 group-aria-selected:text-[#22D3EE]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs uppercase tracking-tight">{item.name}</span>
                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest group-aria-selected:text-[#22D3EE]/70">
                                                {item.isSilo ? "Strategic Silo" : "Analytical Desk"}
                                            </span>
                                        </div>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {/* ANALYST ROSTER */}
                        {results.authors.length > 0 && (
                            <Command.Group heading="Analyst Roster" className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 py-3">
                                {results.authors.map((item) => (
                                    <Command.Item
                                        key={item.id}
                                        onSelect={() => runCommand(() => router.push(item.fullPath))}
                                        className="flex items-center px-3 py-3 text-sm rounded-md aria-selected:bg-[#1E293B] aria-selected:text-[#22D3EE] transition-all cursor-pointer group"
                                    >
                                        <div className="mr-3 h-8 w-8 rounded-full border border-white/5 bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                            <User className="h-4 w-4 text-slate-500 group-aria-selected:text-[#22D3EE]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs uppercase tracking-tight">{item.name}</span>
                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest group-aria-selected:text-[#22D3EE]/70">
                                                {item.role}
                                            </span>
                                        </div>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}
                    </Command.List>

                    <div className="flex items-center justify-between border-t border-[#1E293B] px-4 py-3 bg-[#0D1425]">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] italic">
                            Today Decode // Analytical Retrieval v2.4
                        </p>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Esc to Close</span>
                            </div>
                            <div className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.4)] animate-pulse" />
                        </div>
                    </div>
                </div>
            </Command.Dialog>
        </>
    );
}
