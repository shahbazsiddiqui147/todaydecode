"use client";

import { CommandK } from "../search/command-k";
import { User, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header({ navigationItems = [] }: { navigationItems?: any[] }) {
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border-slate bg-background/80 backdrop-blur-md px-4 sm:px-6">
            <div className="flex flex-1 items-center gap-4 sm:gap-8 overflow-hidden">
                <CommandK />

                <nav className="hidden lg:flex items-center gap-6">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] hover:text-[#22D3EE] transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 ml-4">
                <ThemeToggle />

                {session ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center justify-center rounded-full w-9 h-9 border border-border-slate bg-transparent text-foreground hover:bg-secondary transition-colors relative overflow-hidden group">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="User" className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-5 w-5" />
                                )}
                                <div className="absolute inset-0 bg-accent-red/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 bg-[#0D1425] border-slate-800 rounded-2xl p-2 shadow-2xl">
                            <DropdownMenuLabel className="p-4">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-[11px] font-black text-white uppercase tracking-tighter italic">{session.user?.name || "Strategic Analyst"}</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{session.user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <Link href="/dashboard/">
                                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-white/5 group">
                                    <LayoutDashboard className="h-4 w-4 text-accent-red" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white">Research Desk</span>
                                </DropdownMenuItem>
                            </Link>
                            {(session.user as any).role === "ADMIN" && (
                                <Link href="/admin/">
                                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-white/5 group">
                                        <ShieldCheck className="h-4 w-4 text-accent-green" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white">Research Terminal</span>
                                    </DropdownMenuItem>
                                </Link>
                            )}
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem
                                onClick={() => signOut()}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-accent-red/10 group"
                            >
                                <LogOut className="h-4 w-4 text-slate-500 group-hover:text-accent-red" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-accent-red">Authorize Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex items-center gap-1 sm:gap-3">
                        <Link href="/auth/signin/">
                            <button className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white transition-colors px-2 sm:px-4 py-2">
                                <span className="hidden sm:inline">Sign In</span>
                                <User className="sm:hidden h-4 w-4" />
                            </button>
                        </Link>
                        <Link href="/auth/signup/">
                            <button className="bg-white text-[#0A0F1E] text-[10px] font-black uppercase tracking-widest px-3 sm:px-6 py-2 rounded-xl hover:bg-slate-200 transition-all shadow-lg whitespace-nowrap">
                                Join Archive
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
