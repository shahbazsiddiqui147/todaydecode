"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { getAdminArticles } from "@/lib/actions/admin-actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Clock,
    Search,
    Edit2,
    Trash2,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";

export default function DraftsPage() {
    const { data: session, status } = useSession();
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (status === "authenticated" && (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR" && session.user.role !== "AUTHOR"))) {
            redirect("/admin/");
        }
    }, [session, status]);

    useEffect(() => {
        if (status === "authenticated") {
            loadDrafts();
        }
    }, [status]);

    if (status === "loading") return null;

    const loadDrafts = async () => {
        try {
            setLoading(true);
            const data = await getAdminArticles();
            setArticles(data.filter((a: any) => a.status === "DRAFT"));
        } catch (err) {
            toast.error("Failed to sync strategic drafts.");
        } finally {
            setLoading(false);
        }
    };

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B] dark:border-[#1E293B]">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#22D3EE] dark:text-[#22D3EE] uppercase italic pb-1">Strategic <span className="text-[#F1F5F9] dark:text-[#F1F5F9] not-italic">Drafts</span></h1>
                    <p className="text-[#64748B] dark:text-[#94A3B8] text-xs font-black uppercase tracking-widest">Manage unpublished strategic reports.</p>
                </div>
            </div>

            <div className="bg-[#020617] border border-[#1E293B] shadow-2xl overflow-hidden rounded-3xl transition-colors">
                <div className="p-4 border-b border-[#1E293B] flex items-center gap-4 bg-[#020617]/50">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
                        <Input
                            placeholder="SEARCH DRAFTS..."
                            className="pl-10 bg-[#020617] border-[#1E293B] rounded-xl h-10 text-[10px] uppercase font-black tracking-widest text-[#F1F5F9] placeholder:text-[#475569] focus-visible:ring-[#22D3EE]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-[#020617]/50">
                            <TableRow className="border-b border-[#1E293B] hover:bg-transparent">
                                <TableHead className="text-[10px] uppercase font-black text-[#64748B] dark:text-[#94A3B8] tracking-widest py-4">Status & Title</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-[#64748B] dark:text-[#94A3B8] tracking-widest">Sector</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-[#64748B] dark:text-[#94A3B8] tracking-widest text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-64 text-center">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="h-8 w-8 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
                                            <span className="text-[11px] font-black uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8]">SCANNING DRAFTS...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredArticles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-64 text-center text-[#64748B] dark:text-[#94A3B8] font-bold uppercase tracking-widest text-[11px] italic">
                                        NO DRAFTS FOUND.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredArticles.map((article) => (
                                    <TableRow key={article.id} className="group hover:bg-[#020617]/50 border-b border-[#1E293B] transition-colors">
                                        <TableCell className="py-4 pl-4">
                                            <div className="flex items-start gap-4">
                                                <Badge variant="outline" className="text-muted-foreground/60 gap-1"><Clock className="h-3 w-3" /> Draft</Badge>
                                                <h3 className="text-sm font-black text-foreground leading-none tracking-tight hover:text-primary transition-colors cursor-pointer uppercase">
                                                    <Link href={`/admin/articles/${article.id}/`}>{article.title}</Link>
                                                </h3>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-[10px] font-black text-[#F1F5F9] uppercase tracking-tight">
                                                {article.category.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2 pr-4">
                                                <Link href={`/admin/articles/${article.id}/`}>
                                                    <Button variant="outline" className="h-8 w-8 p-0 rounded-lg border-border hover:bg-secondary">
                                                        <Edit2 className="h-3 w-3" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
