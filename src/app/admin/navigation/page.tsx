"use client";

import { useState, useEffect } from "react";
import {
    Layers,
    Plus,
    Search,
    Edit2,
    Trash2,
    RefreshCw,
    Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    getNavigationItems,
    upsertNavigationItem,
    deleteNavigationItem,
    getAdminCategories,
    getAdminPages
} from "@/lib/actions/admin-actions";

export default function NavigationAdminPage() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [pages, setPages] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const [formData, setFormData] = useState({
        label: "",
        href: "",
        order: 0,
        type: "HEADER" as "HEADER" | "SIDEBAR" | "FOOTER"
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [navItems, cats, pgs] = await Promise.all([
                getNavigationItems(),
                getAdminCategories(),
                getAdminPages()
            ]);
            setItems(navItems);
            setCategories(cats);
            setPages(pgs);
        } catch (err) {
            toast.error("Architecture link failure.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await upsertNavigationItem({
                id: editingItem?.id,
                ...formData
            });
            if (res.success) {
                toast.success("Navigation protocol updated.");
                setIsModalOpen(false);
                setEditingItem(null);
                setFormData({ label: "", href: "", order: 0, type: "HEADER" });
                loadData();
            } else {
                toast.error(res.error || "Uplink rejected.");
            }
        } catch (err) {
            toast.error("Interface sync error.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Decommission this strategic link?")) return;
        try {
            const res = await deleteNavigationItem(id);
            if (res.success) {
                toast.success("Link purged from interface.");
                loadData();
            }
        } catch (err) {
            toast.error("Purge aborted.");
        }
    };

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
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-[#22D3EE] dark:text-[#22D3EE] italic pb-1">Site <span className="text-[#F1F5F9] dark:text-[#F1F5F9] not-italic">Architecture</span></h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] dark:text-[#94A3B8]">Manage menus and navigational silos.</p>
                </div>
                <Button
                    onClick={() => { setEditingItem(null); setFormData({ label: "", href: "", order: 0, type: "HEADER" }); setIsModalOpen(true); }}
                    className="h-11 rounded-xl font-black uppercase tracking-widest text-[10px] px-8 shadow-xl bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] border-none hover:bg-black dark:hover:bg-white/90"
                >
                    <Plus className="mr-2 h-4 w-4" /> New Menu Item
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* List Manager */}
                <div className="lg:col-span-8">
                    <div className="bg-card border border-[#1E293B] rounded-3xl overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-white/5">
                                <TableRow className="border-b border-[#1E293B] hover:bg-transparent">
                                    <TableHead className="py-5 pl-8 text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Protocol Label</TableHead>
                                    <TableHead className="text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Target Path</TableHead>
                                    <TableHead className="text-[#94A3B8] font-black uppercase text-[10px] tracking-widest text-center">Weight</TableHead>
                                    <TableHead className="text-right pr-8 text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Operations</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-64 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <Layers className="h-10 w-10 mb-2" />
                                                <p className="text-[10px] font-black uppercase tracking-widest italic">Navigation engine standby</p>
                                                <p className="text-[9px] uppercase">No curated links detected.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item) => (
                                        <TableRow key={item.id} className="group border-b border-[#1E293B]/50 hover:bg-slate-900/40 transition-colors">
                                            <TableCell className="py-5 pl-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-[#22D3EE]" />
                                                    <span className="text-sm font-black uppercase tracking-tight text-[#0F172A] dark:text-[#F1F5F9] font-medium">{item.label}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-[10px] font-mono text-muted-foreground/60 bg-muted/30 px-2 py-1 rounded">
                                                    {item.href}
                                                </code>
                                            </TableCell>
                                            <TableCell className="text-center font-mono font-black text-xs text-muted-foreground/40">
                                                {item.order}
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl border border-[#1E293B]" onClick={() => {
                                                        setEditingItem(item);
                                                        setFormData({ label: item.label, href: item.href, order: item.order, type: item.type as any });
                                                        setIsModalOpen(true);
                                                    }}>
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" className="h-8 w-8 rounded-xl shadow-lg shadow-destructive/20" onClick={() => handleDelete(item.id)}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Quick Add Silos */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#111827] border border-[#1E293B] p-8 rounded-[2rem] shadow-sm space-y-8 text-white">
                        <div className="flex items-center gap-3 border-b border-[#1E293B] pb-6">
                            <Globe className="h-4 w-4 text-[#22D3EE]" />
                            <h2 className="text-xs font-black uppercase tracking-widest italic">Silo Ingress</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Strategic Categories</p>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setFormData({ ...formData, label: cat.name.toUpperCase(), href: `/${cat.slug}` })}
                                            className="w-full flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-slate-900/50 hover:bg-slate-900 transition-all text-left"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-tight">{cat.name}</span>
                                            <Plus className="h-3.5 w-3.5 text-[#22D3EE]" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Institutional Pages</p>
                                <div className="space-y-2">
                                    {pages.map(page => (
                                        <button
                                            key={page.id}
                                            onClick={() => setFormData({ ...formData, label: page.title.toUpperCase(), href: `/${page.slug}` })}
                                            className="w-full flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-slate-900/50 hover:bg-slate-900 transition-all text-left"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-tight">{page.title}</span>
                                            <Plus className="h-3.5 w-3.5 text-[#22D3EE]" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Logic */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-[#0D1425] w-full max-w-lg rounded-[2.5rem] border border-[#1E293B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-[#1E293B] bg-slate-50 dark:bg-white/5 flex justify-between items-center">
                            <div className="space-y-1">
                                <h2 className="text-xl font-black uppercase tracking-tighter text-foreground italic">
                                    {editingItem ? "Finalize Protocol" : "Authorize Link"}
                                </h2>
                                <p className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">Terminal Access Required</p>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl border border-[#1E293B]" onClick={() => setIsModalOpen(false)}>
                                <Plus className="h-4 w-4 rotate-45" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Display Label</label>
                                <Input
                                    required
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="h-14 font-black uppercase italic tracking-tight bg-white dark:bg-[#020617] border-[#1E293B] rounded-2xl"
                                    placeholder="e.g. GEOPOLITICS"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Protocol Path (Slug/URL)</label>
                                <Input
                                    required
                                    value={formData.href}
                                    onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                                    className="h-14 font-mono text-xs bg-white dark:bg-[#020617] border-[#1E293B] rounded-2xl"
                                    placeholder="geopolitics/"
                                />
                                <p className="text-[9px] text-[#22D3EE] font-mono italic">// Trailing slash enforced automatically.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Order Index</label>
                                    <Input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        className="h-14 font-black bg-white dark:bg-[#020617] border-[#1E293B] rounded-2xl"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Strategic Silo</label>
                                    <select
                                        className="w-full h-14 bg-white dark:bg-[#020617] border border-[#1E293B] rounded-2xl px-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-[#22D3EE] outline-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    >
                                        <option value="HEADER">HEADER_MENU</option>
                                        <option value="SIDEBAR">SIDEBAR_SILO</option>
                                        <option value="FOOTER">FOOTER_INDEX</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-4">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px]">Abort</Button>
                                <Button type="submit" className="h-12 px-10 rounded-xl bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] font-black uppercase tracking-widest text-[10px] shadow-xl">Finalize</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
