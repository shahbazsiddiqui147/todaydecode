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
    MoveUp,
    MoveDown,
    Layers
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

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    order: number;
    isVisible: boolean;
    icon: string;
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
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/admin/categories/");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingCategory ? `/api/admin/categories/${editingCategory.id}/` : "/api/admin/categories/";
        const method = editingCategory ? "PATCH" : "POST";

        const payload = {
            ...formData,
            slug: formData.slug.endsWith('/') ? formData.slug : formData.slug + '/'
        };

        try {
            const res = await fetch(url, {
                method,
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingCategory(null);
                setFormData({ name: "", slug: "", description: "", order: "0", isVisible: true, icon: "" });
                fetchCategories();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category node? This will affect all child articles.")) return;
        try {
            await fetch(`/api/admin/categories/${id}/`, { method: "DELETE" });
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Global <span className="text-accent-red">Directives</span></h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Configure intelligence categories and navigational taxonomy.</p>
                </div>
                <Button onClick={() => { setEditingCategory(null); setIsModalOpen(true); }} className="h-12 px-6">
                    <Layers className="mr-2 h-4 w-4" /> New Directive
                </Button>
            </header>

            <div className="bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">Order</TableHead>
                            <TableHead>Directive Name</TableHead>
                            <TableHead>Protocol Path (Slug)</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead className="text-right">Operations</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-slate-500 italic font-medium">Synchronizing intelligence nodes...</TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-slate-500 italic font-medium">No active categories found in database.</TableCell>
                            </TableRow>
                        ) : categories.map((cat) => (
                            <TableRow key={cat.id} className="group">
                                <TableCell>
                                    <div className="font-mono text-xs font-black text-accent-red bg-accent-red/5 w-8 h-8 rounded flex items-center justify-center border border-accent-red/20">
                                        {cat.order}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                            <Map className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{cat.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-[10px] text-slate-400">{cat.slug}</TableCell>
                                <TableCell>
                                    {cat.isVisible ? (
                                        <span className="flex items-center text-[9px] font-black uppercase text-accent-green">
                                            <Eye className="h-3 w-3 mr-1" /> Visible
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-[9px] font-black uppercase text-slate-500">
                                            <EyeOff className="h-3 w-3 mr-1" /> Hidden
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
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
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" className="h-8 w-8 p-0 text-accent-red hover:text-accent-red hover:bg-accent-red/5" onClick={() => handleDelete(cat.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal Integration */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white dark:bg-[#0A0F1E] w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                            <h2 className="text-xl font-black uppercase tracking-tight">
                                {editingCategory ? "Update" : "Initialize"} Intelligence Node
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Node Title</label>
                                    <Input
                                        required
                                        placeholder="e.g. Geopolitics"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                                slug: editingCategory ? formData.slug : e.target.value.toLowerCase().replace(/ /g, '-') + '/'
                                            });
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Protocol Slug</label>
                                    <Input
                                        required
                                        placeholder="e.g. geopolitics/"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Priority Order</label>
                                    <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Icon Identifier</label>
                                    <Input placeholder="lucide icon name" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <input
                                    type="checkbox"
                                    id="isVisible"
                                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-accent-red"
                                    checked={formData.isVisible}
                                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                />
                                <label htmlFor="isVisible" className="text-xs font-black uppercase tracking-widest text-slate-300 cursor-pointer">Make Node Publicly Visible</label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Strategic Description</label>
                                <textarea
                                    className="w-full h-24 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1425] p-4 text-sm focus-visible:outline-none outline-none"
                                    placeholder="Provide overview of this intelligence sector..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Abort</Button>
                                <Button type="submit">Commit Node</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
