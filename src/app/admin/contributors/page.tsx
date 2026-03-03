"use client";

import { useState, useEffect } from "react";
import {
    Users,
    CheckCircle2,
    ShieldAlert,
    Search,
    RefreshCw,
    UserCheck,
    Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { getPendingAnalysts, approveAnalyst } from "@/lib/actions/admin-actions";

export default function ContributorsAdminPage() {
    const [loading, setLoading] = useState(true);
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = async () => {
        try {
            const users = await getPendingAnalysts();
            setPendingUsers(users);
        } catch (err) {
            toast.error("Personnel interface failure.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: string) => {
        const promise = approveAnalyst(userId);
        toast.promise(promise, {
            loading: "Authorizing analyst...",
            success: (res) => {
                if (res.success) {
                    loadPending();
                    return "Analyst status authorized.";
                }
                throw new Error(res.error);
            },
            error: "Authorization failed."
        });
    };

    const filteredUsers = pendingUsers.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1E293B] dark:border-[#1E293B]">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-[#0891B2] dark:text-[#22D3EE] italic pb-1">Strategic <span className="text-[#0F172A] dark:text-[#F1F5F9] not-italic">Contributors</span></h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] dark:text-[#94A3B8]">Manage external analysts and guest researchers.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Recruitment Active</span>
                    </div>
                </div>
            </header>

            {/* Search Protocol */}
            <div className="flex items-center space-x-4 bg-white dark:bg-[#020617] p-3 rounded-2xl border border-[#1E293B] shadow-sm relative overflow-hidden group focus-within:ring-2 focus-within:ring-[#22D3EE] transition-all">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#1E293B] group-focus-within:bg-[#22D3EE] transition-all" />
                <div className="relative flex-1 flex items-center pl-6">
                    <Search className="h-4 w-4 text-[#64748B] mr-4" />
                    <input
                        placeholder="Scan for applicants by email or name..."
                        className="w-full bg-transparent border-none outline-none text-sm font-bold placeholder:text-[#64748B] text-[#0F172A] dark:text-[#F1F5F9]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Pending Table */}
            <div className="bg-card border border-[#1E293B] rounded-3xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-white/5">
                        <TableRow className="border-b border-[#1E293B] hover:bg-transparent">
                            <TableHead className="py-5 pl-8 text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Applicant Signature</TableHead>
                            <TableHead className="text-[#94A3B8] font-black uppercase text-[10px] tracking-widest text-center">Current Role</TableHead>
                            <TableHead className="text-[#94A3B8] font-black uppercase text-[10px] tracking-widest text-center">Verification</TableHead>
                            <TableHead className="text-right pr-8 text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Authorization</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-64 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-40">
                                        <Users className="h-10 w-10 mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest italic">Personnel register empty</p>
                                        <p className="text-[9px] uppercase">No guest analysts are currently authorized.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="group border-b border-[#1E293B]/50 hover:bg-slate-900/40 transition-colors">
                                    <TableCell className="py-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black text-[#0F172A] dark:text-white uppercase transition-transform group-hover:scale-110">
                                                {user.image ? <img src={user.image} className="h-full w-full object-cover rounded-xl" /> : (user.name || user.email || "?").charAt(0)}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-black uppercase tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">{user.name || "Unidentified Applicant"}</p>
                                                <p className="text-[10px] font-mono text-muted-foreground/60 flex items-center gap-1.5"><Mail className="h-3 w-3" /> {user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-slate-800 text-[#94A3B8] border border-[#1E293B] rounded-lg">GUEST_INGRESS</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <ShieldAlert className="h-4 w-4 text-amber-500 animate-pulse" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <Button
                                            onClick={() => handleApprove(user.id)}
                                            className="h-10 rounded-xl bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] font-black uppercase tracking-widest text-[9px] shadow-lg hover:bg-black dark:hover:bg-white/90"
                                        >
                                            <UserCheck className="h-3.5 w-3.5 mr-2" /> Authorize Analyst
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Visual Hardening / Status Indicator */}
            <div className="p-8 border border-dashed border-[#1E293B] rounded-3xl bg-muted/5 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-[#22D3EE]" /> Active Directory Monitoring
                    </p>
                    <p className="text-[9px] text-muted-foreground/40 uppercase font-mono pl-5 italic">All guest accounts are flagged for institutional review within 24 hours.</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#22D3EE]">Sovereign UI Standard</span>
                </div>
            </div>
        </div>
    );
}
