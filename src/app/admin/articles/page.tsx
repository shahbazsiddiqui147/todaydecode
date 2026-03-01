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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic pb-1">Intelligence <span className="text-muted-foreground/60 not-italic">Hub</span></h1>
                    <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">Manage geopolitical reports and scenarios.</p>
                </div>
                <Link href="/admin/articles/new">
                    <Button className="h-11 rounded-xl font-black uppercase tracking-widest text-[11px] px-6 shadow-xl">
                        <Plus className="h-4 w-4 mr-2" /> File New Report
                    </Button>
                </Link>
            </div>

            <div className="bg-card border border-border shadow-sm overflow-hidden rounded-3xl transition-colors">
                <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/30">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                        <Input
                            placeholder="SEARCH INTELLIGENCE..."
                            className="pl-10 bg-background border-border rounded-xl h-10 text-[10px] uppercase font-black tracking-widest focus-visible:ring-primary"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="border-b border-border hover:bg-transparent">
                                <TableHead className="text-[10px] uppercase font-black text-muted-foreground tracking-widest py-4">Status & Title</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Metadata</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-muted-foreground tracking-widest text-right">Operational Scale</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-64 text-center">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="h-8 w-8 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
                                            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">SCANNING DATABASE...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredArticles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-64 text-center text-muted-foreground font-bold uppercase tracking-widest text-[11px] italic">
                                        NO REPORTS FOUND IN CURRENT SECTOR.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredArticles.map((article) => (
                                    <TableRow key={article.id} className="group hover:bg-muted/30 border-b border-border/50 transition-colors">
                                        <TableCell className="py-4 pl-4">
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1">
                                                    {getStatusBadge(article.status)}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-sm font-black text-foreground leading-none tracking-tight hover:text-primary transition-colors cursor-pointer uppercase">
                                                        {article.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">
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
                                                <div className="flex items-center gap-2 text-[11px] font-black text-foreground uppercase tracking-tight">
                                                    <span className="w-1 h-3 bg-primary" />
                                                    {article.author.name}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">
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
                                                    <Link href={`/admin/articles/edit/${article.id}`}>
                                                        <Button variant="outline" className="h-8 w-8 p-0 rounded-lg border-border hover:bg-secondary">
                                                            <Edit2 className="h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        className="h-8 w-8 p-0 rounded-lg shadow-lg shadow-destructive/20"
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
