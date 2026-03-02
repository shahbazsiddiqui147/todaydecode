"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    ChevronLeft,
    Eye,
    Globe,
    ShieldAlert,
    Layout,
    FileText,
    Settings,
    Clock,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { upsertPage, getAdminPages } from "@/lib/actions/admin-actions";
import { cn } from "@/lib/utils";

interface PageEditorProps {
    params: Promise<{ id: string }>;
}

export default function InstitutionalEditor({ params }: PageEditorProps) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === "new";

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"content" | "seo">("content");

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        metaTitle: "",
        metaDescription: ""
    });

    useEffect(() => {
        if (!isNew) {
            loadPageData();
        }
    }, [id]);

    const loadPageData = async () => {
        try {
            setLoading(true);
            const pages = await getAdminPages();
            const page = (pages as any).find((p: any) => p.id === id);

            if (page) {
                setFormData({
                    title: page.title,
                    slug: page.slug,
                    content: page.content,
                    metaTitle: page.metaTitle || "",
                    metaDescription: page.metaDescription || ""
                });
            } else {
                toast.error("Document not found in system matrix.");
                router.push("/admin/pages/");
            }
        } catch (err) {
            toast.error("Institutional uplink failure.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await upsertPage({
                id: isNew ? undefined : id,
                ...formData
            });

            if (res.success) {
                toast.success("Institutional document finalized & synced.");
                if (isNew && res.data?.id) {
                    router.push(`/admin/pages/${res.data.id}/`);
                }
            } else {
                toast.error(res.error || "Uplink synchronization failed.");
            }
        } catch (err) {
            toast.error("Network interface error.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center space-y-4">
                <div className="h-10 w-10 border-4 border-slate-800 border-t-accent-red rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Decrypting Strategic Archive...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0F1E] flex flex-col text-slate-200">
            {/* Command Header */}
            <header className="h-20 border-b border-slate-800 bg-[#0A0F1E]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-8">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white"
                        onClick={() => router.push("/admin/pages/")}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Manifest</span>
                    </Button>
                    <div className="h-8 w-px bg-slate-800" />
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 text-accent-red" />
                            <h1 className="text-sm font-black uppercase tracking-widest text-white truncate max-w-[300px]">
                                {formData.title || "Initialize New Strategic Document"}
                            </h1>
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                            INSTITUTIONAL CORE // {id.slice(0, 8).toUpperCase()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[9px] font-black text-accent-green uppercase tracking-widest">Secure Handshake</span>
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Uplink Stable</span>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-10 px-8 rounded-xl bg-white text-[#0A0F1E] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-slate-200"
                    >
                        {saving ? "Syncing..." : <><Save className="mr-2 h-3.5 w-3.5" /> Finalize Document</>}
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Tactical Sidebar */}
                <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab("content")}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
                            activeTab === "content"
                                ? "bg-accent-red/10 border border-accent-red/20 text-white shadow-lg shadow-accent-red/5"
                                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        )}
                    >
                        <Layout className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Document Core</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("seo")}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
                            activeTab === "seo"
                                ? "bg-accent-red/10 border border-accent-red/20 text-white shadow-lg shadow-accent-red/5"
                                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        )}
                    >
                        <Globe className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Strategic SEO</span>
                    </button>

                    <div className="mt-10 pt-10 border-t border-slate-800 space-y-6 px-4">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Document Status</span>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter italic">Live Routing</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Trailing Slash</span>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Enforced</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Editorial Surface */}
                <section className="flex-1 overflow-y-auto p-12 bg-[#020617]/50">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {activeTab === "content" ? (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-8 p-10 bg-[#111827] border border-slate-800 rounded-[2.5rem] shadow-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Aesthetic Title</label>
                                            <Input
                                                value={formData.title}
                                                onChange={(e) => {
                                                    const title = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        title,
                                                        slug: isNew ? title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '/' : formData.slug
                                                    });
                                                }}
                                                placeholder="e.g. Research Methodology"
                                                className="h-14 bg-[#0A0F1E] border-slate-800 rounded-2xl text-lg font-black italic uppercase tracking-tighter text-white focus:ring-accent-red"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Sovereign Path (Slug)</label>
                                            <Input
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                placeholder="methodology/"
                                                className="h-14 bg-[#0A0F1E] border-slate-800 rounded-2xl text-sm font-mono tracking-widest text-[#94A3B8] focus:ring-accent-red"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4">
                                        <div className="flex items-center justify-between pl-1">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Institutional Content</label>
                                            <span className="text-[9px] font-bold text-slate-600 uppercase italic">Supports HTML & Strategic Whitespace</span>
                                        </div>
                                        <textarea
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full h-[600px] bg-[#0A0F1E] border border-slate-800 rounded-3xl p-10 text-lg font-medium tracking-tight leading-relaxed text-slate-200 outline-none focus:border-accent-red/50 transition-colors resize-none shadow-inner"
                                            placeholder="Introduce the institutional framework..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="p-10 bg-[#111827] border border-slate-800 rounded-[2.5rem] shadow-2xl space-y-10">
                                    <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
                                        <Globe className="h-6 w-6 text-accent-red" />
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">Search Engine Optimization</h3>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform Authority Metadata</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Institutional Meta Title</label>
                                            <Input
                                                value={formData.metaTitle}
                                                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                                placeholder="Institutional Analysis | Methodology"
                                                className="h-14 bg-[#0A0F1E] border-slate-800 rounded-2xl text-sm font-bold text-[#F1F5F9]"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Institutional Meta Brief</label>
                                            <textarea
                                                value={formData.metaDescription}
                                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                                placeholder="A strategic overview of the institutional frameworks and tactical methodologies utilized by Today Decode."
                                                className="w-full h-32 bg-[#0A0F1E] border border-slate-800 rounded-2xl p-6 text-sm font-medium text-[#94A3B8] outline-none focus:border-accent-red/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 bg-[#0A0F1E] border border-slate-800 rounded-2xl flex items-start gap-4">
                                        <ShieldAlert className="h-5 w-5 text-accent-red mt-1" />
                                        <div className="space-y-1">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Authority Notice</h4>
                                            <p className="text-[10px] font-medium text-slate-500 leading-relaxed">Ensure these documents are written with 100% fidelity. They are utilized by algorithmic aggregators to verify the E-E-A-T credentials of the Strategic Archive.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
