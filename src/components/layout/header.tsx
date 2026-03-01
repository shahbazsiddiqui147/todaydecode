"use client";

import { CommandK } from "../search/command-k";
import { User } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border-slate bg-background/95 backdrop-blur-md px-6">
            <div className="flex flex-1 items-center">
                <CommandK />
            </div>

            <div className="flex items-center space-x-4">
                <button className="flex items-center justify-center rounded-full w-9 h-9 border border-border-slate bg-transparent text-foreground hover:bg-slate-800 transition-colors">
                    <User className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
