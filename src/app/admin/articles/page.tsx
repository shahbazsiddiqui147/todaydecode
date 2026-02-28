"use client";

import { useEffect, useState } from "react";
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
    MoreVertical
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
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            setLoading(true);
            const data = await getAdminArticles();
            setArticles(data as any);
        } catch (err) {
            toast.error("Failed to sync intelligence manifests.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Confirm report purge? This action is irreversible.")) return;

        try {
            const res = await deleteArticle(id);
            if (res.success) {
                toast.success("Intelligence report purged.");
                loadArticles();
            } else {
                toast.error(res.error || "Purge failed.");
            }
        } catch (err) {
            toast.error("Network interface error.");
        }
    };

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.author.name.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Live</Badge>;
            case "DRAFT":
                return <Badge variant="outline" className="text-slate-400 gap-1"><Clock className="h-3 w-3" /> Draft</Badge>;
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Intelligence Hub</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage geopolitical reports and scenarios.</p>
                </div>
                <Link href="/admin/articles/new">
                    <Button className="bg-slate-900 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-none h-11 px-6 font-black uppercase italic tracking-tighter transition-all active:scale-95 shadow-lg">
                        <Plus className="h-4 w-4 mr-2" /> File New Report
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="SEARCH INTELLIGENCE..."
                            className="pl-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-none h-10 text-[10px] uppercase font-black tracking-widest focus-visible:ring-slate-900"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                <TableHead className="text-[10px] uppercase font-black text-slate-500 tracking-widest py-4">Status & Title</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Metadata</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-slate-500 tracking-widest text-right">Operational Scale</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-32 text-center text-slate-400 font-medium italic">
                                        SCANNING DATABASE...
                                    </TableCell>
                                </TableRow>
                            ) : filteredArticles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-32 text-center text-slate-400 font-medium italic">
                                        NO REPORTS FOUND IN CURRENT SECTOR.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredArticles.map((article) => (
                                    <TableRow key={article.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 border-b border-slate-100 dark:border-slate-800 transition-colors">
                                        <TableCell className="py-4">
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1">
                                                    {getStatusBadge(article.status)}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none tracking-tight underline-offset-4 hover:underline cursor-pointer">
                                                        {article.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-tighter">
                                                        <span className="flex items-center gap-1">
                                                            <FileText className="h-3 w-3" /> {article.category.name}
                                                        </span>
                                                        <span>/</span>
                                                        <span>{article.slug}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                                    <span className="w-1 h-3 bg-slate-900 dark:bg-white" />
                                                    {article.author.name}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-medium uppercase italic">
                                                    {new Date(article.publishedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                <div className="hidden sm:block">
                                                    {getRiskBadge(article.riskLevel)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Link href={`/admin/articles/edit/${article.id}`}>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                                            <Edit2 className="h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                        onClick={() => handleDelete(article.id)}
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
