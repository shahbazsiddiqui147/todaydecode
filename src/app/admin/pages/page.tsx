"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    FileText,
    Edit2,
    Trash2,
    Globe,
    Settings2,
    X,
    Layout,
    Eye,
    ChevronRight,
    Search,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    getAdminPages,
    upsertPage,
    deletePage
} from "@/lib/actions/admin-actions";

interface Page {
    id: string;
    title: string;
    slug: string;
    content: string;
    metaTitle: string | null;
    metaDescription: string | null;
    updatedAt: Date;
}

export default function PagesManager() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        metaTitle: "",
        metaDescription: ""
    });

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        try {
            setLoading(true);
            const data = await getAdminPages();
            setPages(data as any);
        } catch (err) {
            toast.error("Institutional uplink failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await upsertPage({
                id: editingPage?.id,
                ...formData
            });

            if (res.success) {
                toast.success(editingPage ? "Institutional document updated." : "New strategic page published.");
                setIsModalOpen(false);
                setEditingPage(null);
                setFormData({ title: "", slug: "", content: "", metaTitle: "", metaDescription: "" });
                loadPages();
            } else {
                toast.error(res.error || "Uplink synchronization failed.");
            }
        } catch (err) {
            toast.error("Network interface error.");
        }
    };

    const handleDeleteClick = async (id: string) => {
        if (!confirm("Decommission this institutional page? This action is permanent.")) return;
        try {
            const res = await deletePage(id);
            if (res.success) {
                toast.success("Institutional record purged.");
                loadPages();
            } else {
                toast.error(res.error || "Purge aborted.");
            }
        } catch (err) {
            toast.error("Internal connection error.");
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1E293B] dark:border-[#1E293B]">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-[#22D3EE] dark:text-[#22D3EE] italic">Institutional <span className="text-[#F1F5F9] dark:text-[#F1F5F9] not-italic">Pages</span></h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] dark:text-[#94A3B8]">Management of About Us, Privacy Policy, Terms, and Strategic Frameworks.</p>
                </div>
                <Button onClick={() => { setEditingPage(null); setFormData({ title: "", slug: "", content: "", metaTitle: "", metaDescription: "" }); setIsModalOpen(true); }} className="h-11 rounded-xl font-black uppercase tracking-widest text-[10px] px-8 shadow-xl bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] border-none hover:bg-black dark:hover:bg-white/90">
                    <Plus className="mr-2 h-4 w-4" /> Initialize New Page
                </Button>
            </header>

            <div className="bg-card border border-border rounded-3xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#020617]/50">
                        <TableRow className="border-b border-[#1E293B] hover:bg-transparent">
                            <TableHead className="py-5 pl-8 text-[#64748B] dark:text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Document Title</TableHead>
                            <TableHead className="text-[#64748B] dark:text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Access Path (Slug)</TableHead>
                            <TableHead className="text-[#64748B] dark:text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Last Modified</TableHead>
                            <TableHead className="text-right pr-8 text-[#64748B] dark:text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Operations</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-64 text-center">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="h-8 w-8 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">Scanning Archives...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : pages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-64 text-center text-[#64748B] font-bold uppercase tracking-widest text-[10px] italic">No institutional pages found in system matrix.</TableCell>
                            </TableRow>
                        ) : pages.map((page) => (
                            <TableRow key={page.id} className="group border-b border-[#1E293B] hover:bg-[#020617]/50 transition-colors cursor-default">
                                <TableCell className="pl-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-10 w-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center shrink-0">
                                            <FileText className="h-5 w-5 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                                        </div>
                                        <div className="text-sm font-black text-foreground uppercase tracking-tight">{page.title}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-[10px] text-[#64748B] dark:text-[#94A3B8]/60">{page.slug}</TableCell>
                                <TableCell>
                                    <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest gap-2">
                                        <Clock className="h-3 w-3" />
                                        {new Date(page.updatedAt).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="outline"
                                            className="h-8 rounded-lg border-border hover:bg-secondary"
                                            onClick={() => {
                                                setEditingPage(page);
                                                setFormData({
                                                    title: page.title,
                                                    slug: page.slug,
                                                    content: page.content,
                                                    metaTitle: page.metaTitle || "",
                                                    metaDescription: page.metaDescription || ""
                                                });
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            <Settings2 className="h-3 w-3 mr-2" /> <span className="text-[10px] uppercase font-black">Edit</span>
                                        </Button>
                                        <Button variant="destructive" className="h-8 w-8 p-0 rounded-lg shadow-lg shadow-destructive/20" onClick={() => handleDeleteClick(page.id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Institutional Page Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-[#020617] w-full max-w-5xl rounded-[2.5rem] border border-[#1E293B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 border-b border-[#1E293B] flex justify-between items-center bg-[#020617]/50">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-[#0F172A] dark:text-white">
                                    {editingPage ? "Refine Institutional Page" : "Initialize Strategic Document"}
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">Institutional Integrity Documentation Framework</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-white transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto bg-[#020617]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-medium uppercase tracking-widest text-[#1E293B] dark:text-[#94A3B8]">Document Title</label>
                                    <Input
                                        required
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                        placeholder="e.g. About Us"
                                        value={formData.title}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                                slug: editingPage ? formData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') + '/'
                                            });
                                        }}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-medium uppercase tracking-widest text-[#1E293B] dark:text-[#94A3B8]">Structural Slug</label>
                                    <Input
                                        required
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold font-mono placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                        placeholder="about-us/"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-medium uppercase tracking-widest text-[#1E293B] dark:text-[#94A3B8]">Institutional Content (HTML Supported)</label>
                                <textarea
                                    required
                                    className="w-full h-80 rounded-2xl border border-[#1E293B] bg-[#020617] p-8 text-sm font-bold text-[#F1F5F9] placeholder:text-[#475569] focus-visible:outline-none focus:ring-2 focus:ring-[#22D3EE] outline-none resize-none leading-relaxed"
                                    placeholder="Enter institutional analysis or document content here..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-[#020617]/50 rounded-[2rem] border border-[#1E293B]">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">SEO Headline</label>
                                    <Input
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                        placeholder="Institutional Meta Title"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">SEO Brief</label>
                                    <Input
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                        placeholder="Institutional Meta Description"
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-10 flex justify-end space-x-4">
                                <Button type="button" variant="ghost" className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:text-foreground" onClick={() => setIsModalOpen(false)}>Cancel Action</Button>
                                <Button type="submit" className="h-12 px-10 rounded-xl bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-black dark:hover:bg-white/90">Finalize Document</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
