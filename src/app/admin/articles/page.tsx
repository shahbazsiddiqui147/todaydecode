"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
    getAdminArticles,
    deleteArticle,
    getAdminCategories,
    getAdminAuthors
} from "@/lib/actions/admin-actions";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    FileText,
    Globe,
    AlertTriangle,
    CheckCircle2,
    Clock,
    MoreVertical,
    Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Article {
    id: string;
    title: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    publishedAt: Date;
    author: { name: string };
    category: { name: string; slug: string };
}

export default function ArticlesPage() {
    const { data: session, status } = useSession();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (status === "authenticated" && (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR" && session.user.role !== "AUTHOR"))) {
            redirect("/admin/");
        }
    }, [session, status]);

    useEffect(() => {
        if (status === "authenticated") {
            loadArticles();
        }
    }, [status]);

    if (status === "loading") return null;

    const loadArticles = async () => {
        try {
            setLoading(true);
            const data = await getAdminArticles();
            setArticles(data as any);
        } catch (err) {
            toast.error("Failed to load articles.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this article? This cannot be undone.")) return;

        try {
            const res = await deleteArticle(id);
            if (res.success) {
                toast.success("Article deleted.");
                loadArticles();
            } else {
                toast.error(res.error || "Delete failed.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
        }
    };

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.author.name.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Live</Badge>;
            case "DRAFT":
                return <Badge variant="outline" className="text-muted-foreground/60 gap-1"><Clock className="h-3 w-3" /> Draft</Badge>;
            case "ARCHIVED":
                return <Badge variant="secondary" className="gap-1">Archived</Badge>;
            default:
                return null;
        }
    };

    const getRiskBadge = (level: string) => {
        switch (level) {
            case "CRITICAL":
                return <Badge className="bg-red-500 text-white border-none">Critical</Badge>;
            case "HIGH":
                return <Badge className="bg-orange-500 text-white border-none">High</Badge>;
            case "MEDIUM":
                return <Badge className="bg-blue-500 text-white border-none">Medium</Badge>;
            case "LOW":
                return <Badge className="bg-slate-500 text-white border-none">Low</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic pb-1">
                        <span className="text-[#22D3EE]">Articles</span>
                    </h1>
                    <p className="text-[#64748B] dark:text-[#94A3B8] text-xs font-black uppercase tracking-widest">Manage and publish your articles.</p>
                </div>
                <Link href="/admin/articles/new/">
                    <Button className="h-11 rounded-xl font-black uppercase tracking-widest text-[11px] px-6 shadow-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-black dark:hover:bg-white/90">
                        <Plus className="h-4 w-4 mr-2" /> New Article
                    </Button>
                </Link>
            </div>

            <div className="bg-card border border-[#1E293B] shadow-sm overflow-hidden rounded-3xl transition-colors">
                <div className="p-4 border-b border-[#1E293B] flex items-center gap-4 bg-[#020617]/50">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]/40" />
                        <Input
                            placeholder="Search articles..."
                            className="pl-10 bg-[#020617] border-[#1E293B] rounded-xl h-10 text-[10px] uppercase font-black tracking-widest focus-visible:ring-[#22D3EE] text-[#F1F5F9] placeholder:text-[#475569]"
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
                                <TableHead className="text-[10px] uppercase font-black text-[#64748B] dark:text-[#94A3B8] tracking-widest">Metadata</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-[#64748B] dark:text-[#94A3B8] tracking-widest text-right">Risk Level</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-64 text-center">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="h-8 w-8 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
                                            <span className="text-[11px] font-black uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8]">Loading articles...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredArticles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-64 text-center text-[#64748B] dark:text-[#94A3B8] font-bold uppercase tracking-widest text-[11px] italic">
                                        No articles found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredArticles.map((article) => (
                                    <TableRow key={article.id} className="group hover:bg-[#020617]/50 border-b border-[#1E293B] transition-colors">
                                        <TableCell className="py-4 pl-4">
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1">
                                                    {getStatusBadge(article.status)}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-sm font-black text-[#F1F5F9] dark:text-[#F1F5F9] leading-none tracking-tight hover:text-primary transition-colors cursor-pointer uppercase font-medium">
                                                        <Link href={`/admin/articles/${article.id}/`}>{article.title}</Link>
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-[10px] text-[#64748B] dark:text-[#94A3B8]/60 font-black uppercase tracking-widest">
                                                        <span className="flex items-center gap-1">
                                                            <FileText className="h-3 w-3" /> {article.category.name}
                                                        </span>
                                                        <span>/</span>
                                                        <span className="font-mono lowercase">{article.slug}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[11px] font-black text-[#F1F5F9] dark:text-[#F1F5F9] uppercase tracking-tight font-medium">
                                                    <span className="w-1 h-3 bg-primary" />
                                                    {article.author.name}
                                                </div>
                                                <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]/60 font-black uppercase tracking-widest">
                                                    {new Date(article.publishedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                <div className="hidden sm:block">
                                                    {getRiskBadge(article.riskLevel)}
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {article.status === "PUBLISHED" && (
                                                        <Link href={`/${article.category.slug}${article.slug}`} target="_blank">
                                                            <Button variant="outline" className="h-8 w-8 p-0 rounded-lg border-border hover:bg-secondary" title="View Live">
                                                                <Eye className="h-3 w-3" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    <Link href={`/admin/articles/${article.id}/`}>
                                                        <Button variant="outline" className="h-8 w-8 p-0 rounded-lg border-border hover:bg-secondary" title="Edit">
                                                            <Edit2 className="h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        className="h-8 w-8 p-0 rounded-lg shadow-lg shadow-destructive/20"
                                                        onClick={() => handleDelete(article.id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
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
