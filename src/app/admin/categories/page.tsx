"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Map,
    Eye,
    EyeOff,
    Layers,
    ChevronRight,
    Globe,
    Settings2,
    X,
    Box
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
    getAdminCategories,
    upsertCategory,
    deleteCategory
} from "@/lib/actions/admin-actions";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    order: number;
    isVisible: boolean;
    icon: string | null;
    leadAnalyst: string | null;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        order: "0",
        isVisible: true,
        icon: "",
        leadAnalyst: ""
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getAdminCategories();
            setCategories(data as any);
        } catch (err) {
            toast.error("Failed to connect to management node.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            order: parseInt(formData.order) || 0,
            isVisible: formData.isVisible,
            icon: formData.icon,
            leadAnalyst: formData.leadAnalyst
        };

        try {
            const res = await upsertCategory({
                id: editingCategory?.id,
                ...payload
            });

            if (res.success) {
                toast.success(editingCategory ? "Category node updated." : "New taxonomical node initialized.");
                setIsModalOpen(false);
                setEditingCategory(null);
                setFormData({ name: "", slug: "", description: "", order: "0", isVisible: true, icon: "", leadAnalyst: "" });
                loadCategories();
            } else {
                toast.error(res.error || "Database synchronization failed.");
            }
        } catch (err) {
            toast.error("Network interface error.");
        }
    };

    const handleDeleteClick = async (id: string) => {
        if (!confirm("Confirm Node Deletion? All child content will be disconnected.")) return;
        try {
            const res = await deleteCategory(id);
            if (res.success) {
                toast.success("Taxonomical node purged.");
                loadCategories();
            } else {
                toast.error(res.error || "Purge aborted.");
            }
        } catch (err) {
            toast.error("Internal connection error.");
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1E293B]">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-[#22D3EE] dark:text-[#22D3EE] italic">Strategic <span className="text-[#F1F5F9] dark:text-[#F1F5F9] not-italic">Silos</span></h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] dark:text-[#94A3B8]">Institutional parameters for global risk analysis and analysis desks.</p>
                </div>
                <Button onClick={() => { setEditingCategory(null); setFormData({ name: "", slug: "", description: "", order: "0", isVisible: true, icon: "", leadAnalyst: "" }); setIsModalOpen(true); }} className="h-11 rounded-xl font-black uppercase tracking-widest text-[10px] px-8 shadow-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-none hover:bg-black dark:hover:bg-white/90">
                    <Plus className="mr-2 h-4 w-4" /> Create Strategic Silo
                </Button>
            </header>

            <div className="bg-card border border-[#1E293B] rounded-3xl overflow-hidden shadow-sm shadow-black/5 dark:shadow-none transition-colors">
                <Table className="border-collapse">
                    <TableHeader className="bg-slate-50 dark:bg-white/5">
                        <TableRow className="border-b border-[#1E293B] hover:bg-transparent">
                            <TableHead className="w-16 text-center text-[#1E293B] dark:text-[#CBD5E1] font-black uppercase text-[10px] tracking-widest">Priority</TableHead>
                            <TableHead className="py-5 pl-8 text-[#1E293B] dark:text-[#CBD5E1] font-black uppercase text-[10px] tracking-widest">Strategic Silo</TableHead>
                            <TableHead className="text-[#1E293B] dark:text-[#CBD5E1] font-black uppercase text-[10px] tracking-widest">Structural Path (Slug)</TableHead>
                            <TableHead className="text-[#1E293B] dark:text-[#CBD5E1] font-black uppercase text-[10px] tracking-widest">State</TableHead>
                            <TableHead className="text-right pr-8 text-[#1E293B] dark:text-[#CBD5E1] font-black uppercase text-[10px] tracking-widest">Operations</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="h-8 w-8 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">Loading Strategic Silos...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center text-[#64748B] font-bold uppercase tracking-widest text-[10px] italic">No silos found in system interface.</TableCell>
                            </TableRow>
                        ) : categories.map((cat) => (
                            <TableRow key={cat.id} className="group border-b border-[#1E293B] hover:bg-muted/30 transition-colors">
                                <TableCell className="text-center font-mono font-black text-xs text-muted-foreground/60">
                                    {cat.order}
                                </TableCell>
                                <TableCell className="pl-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-10 w-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center shrink-0">
                                            <Map className="h-5 w-5 text-[#94A3B8] group-hover:text-[#22D3EE] transition-colors" />
                                        </div>
                                        <div className="text-sm font-black text-[#F1F5F9] dark:text-[#F1F5F9] uppercase tracking-tight font-medium">{cat.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-[10px] text-muted-foreground/60">{cat.slug}</TableCell>
                                <TableCell>
                                    {cat.isVisible ? (
                                        <span className="flex items-center text-[10px] font-black uppercase text-brand-stability bg-brand-stability/10 px-3 py-1 rounded-full border border-brand-stability/20">
                                            <Eye className="h-3 w-3 mr-1.5" /> Published
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-[10px] font-black uppercase text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border">
                                            <EyeOff className="h-3 w-3 mr-1.5" /> Hidden
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="outline"
                                            className="h-8 rounded-lg border-border hover:bg-secondary"
                                            onClick={() => {
                                                setEditingCategory(cat);
                                                setFormData({
                                                    name: cat.name,
                                                    slug: cat.slug,
                                                    description: cat.description || "",
                                                    order: String(cat.order),
                                                    isVisible: cat.isVisible,
                                                    icon: cat.icon || "",
                                                    leadAnalyst: cat.leadAnalyst || ""
                                                });
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            <Settings2 className="h-3 w-3 mr-2" /> <span className="text-[10px] uppercase font-black">Edit</span>
                                        </Button>
                                        <Button variant="destructive" className="h-8 w-8 p-0 rounded-lg shadow-lg shadow-destructive/20" onClick={() => handleDeleteClick(cat.id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Professional Multi-Column Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-[#020617] w-full max-w-3xl rounded-[2.5rem] border border-[#1E293B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 border-b border-[#1E293B] flex justify-between items-center bg-[#020617]/50">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-[#F1F5F9]">
                                    {editingCategory ? "Update Silo Parameters" : "Create Strategic Silo"}
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Institutional Authorization Required</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 border border-[#1E293B] rounded-xl hover:bg-[#111827] text-[#94A3B8] transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto bg-[#020617]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] flex items-center">
                                        <Box className="h-3 w-3 mr-2 text-cyan-500" /> Silo Identification
                                    </label>
                                    <Input
                                        required
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                        placeholder="e.g. Geopolitics"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                                slug: editingCategory ? formData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') + '/'
                                            });
                                        }}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] flex items-center">
                                        <Globe className="h-3 w-3 mr-2 text-cyan-500" /> Structural Slug
                                    </label>
                                    <Input
                                        required
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold font-mono placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                        placeholder="geopolitics/"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] flex items-center">
                                        <Layers className="h-3 w-3 mr-2 rotate-180 text-cyan-500" /> Priority Weighting
                                    </label>
                                    <Input
                                        type="number"
                                        required
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] flex items-center">
                                        <Settings2 className="h-3 w-3 mr-2 text-cyan-500" /> Lucide Icon ID
                                    </label>
                                    <Input
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                        placeholder="e.g. Map"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-5 bg-[#020617]/50 rounded-2xl border border-[#1E293B] group transition-all cursor-pointer" onClick={() => setFormData({ ...formData, isVisible: !formData.isVisible })}>
                                <div className={cn(
                                    "h-5 w-5 rounded border border-[#1E293B] flex items-center justify-center transition-all",
                                    formData.isVisible ? "bg-white border-white shadow-lg shadow-cyan-500/10" : "bg-[#020617]"
                                )}>
                                    {formData.isVisible && <div className="h-2 w-2 rounded-full bg-[#020617] animate-in zoom-in-50 duration-200" />}
                                </div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] cursor-pointer">Active in Global Feed</label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] flex items-center">
                                        <Plus className="h-3 w-3 mr-2 text-cyan-500" /> Sector Lead Analyst
                                    </label>
                                    <Input
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold placeholder:text-[#475569]"
                                        placeholder="e.g. Strategic Oversight Group"
                                        value={formData.leadAnalyst}
                                        onChange={(e) => setFormData({ ...formData, leadAnalyst: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] flex items-center">
                                        <Plus className="h-3 w-3 mr-2 text-cyan-500" /> Directive Overview
                                    </label>
                                    <textarea
                                        className="w-full h-12 rounded-xl border border-[#1E293B] bg-[#020617] px-4 py-3 text-sm font-bold text-[#F1F5F9] placeholder:text-[#475569] focus-visible:outline-none focus:ring-2 focus:ring-[#22D3EE] transition-all outline-none resize-none leading-relaxed shadow-sm"
                                        placeholder="Brief sector description..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-10 flex justify-end space-x-4">
                                <Button type="button" variant="ghost" className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5" onClick={() => setIsModalOpen(false)}>Cancel Action</Button>
                                <Button type="submit" className="h-12 px-10 rounded-xl bg-white text-[#020617] font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-white/90">Finalize Silo</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
