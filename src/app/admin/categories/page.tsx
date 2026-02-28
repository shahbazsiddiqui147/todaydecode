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
        icon: ""
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
            icon: formData.icon
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
                setFormData({ name: "", slug: "", description: "", order: "0", isVisible: true, icon: "" });
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
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Taxonomy <span className="text-slate-400 font-medium">Manager</span></h1>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Managing intelligence categories and navigational protocols.</p>
                </div>
                <Button onClick={() => { setEditingCategory(null); setFormData({ name: "", slug: "", description: "", order: "0", isVisible: true, icon: "" }); setIsModalOpen(true); }} className="h-11 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 font-black uppercase tracking-widest text-[11px] px-6">
                    <Plus className="mr-2 h-4 w-4" /> Initialize Node
                </Button>
            </header>

            <div className="bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm shadow-slate-100 dark:shadow-none">
                <Table className="border-collapse">
                    <TableHeader className="bg-slate-50 dark:bg-white/5">
                        <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
                            <TableHead className="w-16 text-center">Priority</TableHead>
                            <TableHead className="py-5 pl-8">Intelligence Node</TableHead>
                            <TableHead>Protocol Path (Slug)</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead className="text-right pr-8">Operations</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="h-8 w-8 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-slate-900 dark:border-t-white animate-spin"></div>
                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Loading Taxonomy...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center text-slate-400 font-bold uppercase tracking-widest text-[11px] italic">No categories found in system.</TableCell>
                            </TableRow>
                        ) : categories.map((cat) => (
                            <TableRow key={cat.id} className="group border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <TableCell className="text-center font-mono font-black text-xs text-slate-400 dark:text-slate-600">
                                    {cat.order}
                                </TableCell>
                                <TableCell className="pl-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                                            <Map className="h-5 w-5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{cat.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-[10px] text-slate-400">{cat.slug}</TableCell>
                                <TableCell>
                                    {cat.isVisible ? (
                                        <span className="flex items-center text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                            <Eye className="h-3 w-3 mr-1.5" /> Published
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-[10px] font-black uppercase text-slate-400 bg-slate-100/50 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                                            <EyeOff className="h-3 w-3 mr-1.5" /> Hidden
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="outline"
                                            className="h-8 rounded-lg border-slate-200 dark:border-slate-800 hover:bg-white"
                                            onClick={() => {
                                                setEditingCategory(cat);
                                                setFormData({
                                                    name: cat.name,
                                                    slug: cat.slug,
                                                    description: cat.description || "",
                                                    order: String(cat.order),
                                                    isVisible: cat.isVisible,
                                                    icon: cat.icon || ""
                                                });
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            <Settings2 className="h-3 w-3 mr-2" /> <span className="text-[10px] uppercase font-black">Edit</span>
                                        </Button>
                                        <Button variant="destructive" className="h-8 w-8 p-0 rounded-lg" onClick={() => handleDeleteClick(cat.id)}>
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
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white dark:bg-[#0D1425] w-full max-w-3xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-white/5">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                                    {editingCategory ? "Update" : "Initialize"} Taxon Node
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Structural Configuration Required</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-white transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto bg-white dark:bg-[#0D1425]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                                        <Box className="h-3 w-3 mr-2" /> Node Name
                                    </label>
                                    <Input
                                        required
                                        className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-sm font-bold"
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
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                                        <Globe className="h-3 w-3 mr-2" /> Protocol Slug
                                    </label>
                                    <Input
                                        required
                                        className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-sm font-bold font-mono"
                                        placeholder="geopolitics/"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                                        <Layers className="h-3 w-3 mr-2 rotate-180" /> Priority Weighting
                                    </label>
                                    <Input
                                        type="number"
                                        required
                                        className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-sm font-bold"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                                        <Settings2 className="h-3 w-3 mr-2" /> Lucide Icon ID
                                    </label>
                                    <Input
                                        className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-sm font-bold"
                                        placeholder="e.g. Map"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-slate-800 group transition-all cursor-pointer" onClick={() => setFormData({ ...formData, isVisible: !formData.isVisible })}>
                                <div className={cn(
                                    "h-5 w-5 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-all",
                                    formData.isVisible ? "bg-slate-900 border-slate-900 dark:bg-white dark:border-white shadow-lg" : "bg-transparent"
                                )}>
                                    {formData.isVisible && <div className="h-2 w-2 rounded-full bg-white dark:bg-slate-900 animate-in zoom-in-50 duration-200" />}
                                </div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 cursor-pointer">Published to Public Interface</label>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                                    <Plus className="h-3 w-3 mr-2" /> Directive Overview
                                </label>
                                <textarea
                                    className="w-full h-32 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 p-6 text-sm font-medium focus-visible:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all outline-none resize-none leading-relaxed"
                                    placeholder="Provide professional briefing for this intelligence sector..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="pt-10 flex justify-end space-x-4">
                                <Button type="button" variant="ghost" className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px]" onClick={() => setIsModalOpen(false)}>Abort Change</Button>
                                <Button type="submit" className="h-12 px-10 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 font-black uppercase tracking-widest text-[10px] shadow-xl">Commit Node</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
