"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    upsertArticle,
} from "@/lib/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Save,
    ChevronLeft,
    Shield,
    Globe,
    Database,
    FileText,
    Zap,
    TrendingUp,
    MessageSquare,
    Link2,
    Plus,
    Trash2,
    RefreshCw,
    Activity,
    AlertCircle,
    Lock,
    Unlock
} from "lucide-react";
import { slugify } from "@/lib/slugify";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface ArticleEditorProps {
    article?: any;
    initialCategories: any[];
    initialAuthors: any[];
}

export default function ArticleEditor({ article, initialCategories, initialAuthors }: ArticleEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSlugLocked, setIsSlugLocked] = useState(true);
    const [activeTab, setActiveTab] = useState<"content" | "forecast" | "aeo" | "meta">("content");

    const [formData, setFormData] = useState({
        title: article?.title || "",
        slug: article?.slug || "",
        onPageLead: article?.onPageLead || "",
        summary: article?.summary || "",
        content: article?.content || "",
        status: article?.status || "DRAFT",
        isFeatured: article?.isFeatured || false,
        isPremium: article?.isPremium || false,
        region: article?.region || "GLOBAL",
        riskLevel: article?.riskLevel || "MEDIUM",
        riskScore: article?.riskScore || 50,
        impactScore: article?.impactScore || 50,
        categoryId: article?.categoryId || "",
        authorId: article?.authorId || "",
        metaTitle: article?.metaTitle || "",
        metaDescription: article?.metaDescription || "",
        scenarios: article?.scenarios || {
            best: { title: "Strategic Convergence", description: "" },
            likely: { title: "Linear Tension", description: "" },
            worst: { title: "Systemic Fragmentation", description: "" },
        },
        faqData: Array.isArray(article?.faqData) ? article.faqData : [
            { question: "What is the primary driver of this conflict?", answer: "" },
        ],
    });

    // Real-time Slug Sync logic
    useEffect(() => {
        if (isSlugLocked && formData.title) {
            setFormData(prev => ({ ...prev, slug: slugify(prev.title) }));
        }
    }, [formData.title, isSlugLocked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleScenarioChange = (type: "best" | "likely" | "worst", field: "title" | "description", value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            scenarios: {
                ...prev.scenarios,
                [type]: { ...prev.scenarios[type], [field]: value }
            }
        }));
    };

    const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
        const newFaq = [...formData.faqData];
        newFaq[index] = { ...newFaq[index], [field]: value };
        setFormData((prev: any) => ({ ...prev, faqData: newFaq }));
    };

    const addFaq = () => {
        setFormData((prev: any) => ({
            ...prev,
            faqData: [...prev.faqData, { question: "", answer: "" }]
        }));
    };

    const removeFaq = (index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            faqData: prev.faqData.filter((_: any, i: number) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const promise = upsertArticle({
            id: article?.id,
            ...formData,
            riskScore: Number(formData.riskScore),
            impactScore: Number(formData.impactScore),
        });

        toast.promise(promise, {
            loading: "Syncing institutional report...",
            success: (res) => {
                if (res.success) {
                    router.push("/admin/articles/");
                    router.refresh();
                    return article ? "Strategic report finalized." : "New analysis published.";
                }
                throw new Error(res.error || "Sync failed.");
            },
            error: (err) => err.message || "Network interface error.",
        });

        try {
            await promise;
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                    <Link href="/admin/articles/">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border hover:bg-muted/50">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest px-2 py-0">
                                {article ? "Operational Update" : "Nodal Initialization"}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40 italic">#WarRoomProtocol</span>
                        </div>
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-[#0F172A] dark:text-[#F1F5F9] leading-none">
                            {formData.title || "PROPOSED_STRATEGIC_ANALYSIS"}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={formData.status} onValueChange={(v: string) => handleSelectChange("status", v)}>
                        <SelectTrigger className="w-[140px] h-10 rounded-xl bg-white dark:bg-[#020617] border-[#CBD5E1] dark:border-[#1E293B] text-[10px] font-black uppercase tracking-widest focus:ring-[#0F172A] dark:focus:ring-[#22D3EE] text-[#0F172A] dark:text-[#F1F5F9]">
                            <SelectValue placeholder="STATUS" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border text-[10px] font-black uppercase">
                            <SelectItem value="DRAFT">DRAFT</SelectItem>
                            <SelectItem value="PUBLISHED">PUBLISH</SelectItem>
                            <SelectItem value="ARCHIVED">ARCHIVE</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-10 px-8 rounded-xl font-black uppercase italic tracking-tighter shadow-lg shadow-primary/20 active:scale-95 transition-all text-[11px] bg-[#0F172A] text-white hover:bg-black dark:bg-white dark:text-[#0F172A] dark:hover:bg-white/90"
                    >
                        {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        {article ? "Finalize Report" : "Create Report"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Analysis Cockpit */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Navigation Tabs (Strategic Selection) */}
                    <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-2xl border border-border/50">
                        {[
                            { id: "content", label: "Analysis Content", icon: FileText },
                            { id: "forecast", label: "Scenarios", icon: TrendingUp },
                            { id: "aeo", label: "AEO/GEO", icon: Zap },
                            { id: "meta", label: "Strategic Meta (SEO)", icon: Globe },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-b-2",
                                    activeTab === tab.id
                                        ? "bg-background text-cyan-400 border-cyan-400 shadow-sm"
                                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <tab.icon className="h-3.5 w-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Panes */}
                    <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {activeTab === "content" && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-medium uppercase tracking-widest text-[#1E293B] dark:text-[#94A3B8] pl-1">Primary Intelligence Headline</Label>
                                    <Input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="ENTER HEADLINE..."
                                        className="text-2xl font-black h-16 bg-white dark:bg-[#020617] border-[#CBD5E1] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] rounded-2xl focus-visible:ring-[#0F172A] dark:focus-visible:ring-[#22D3EE] px-6 uppercase tracking-tight italic shadow-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-medium uppercase tracking-widest text-[#1E293B] dark:text-[#94A3B8] pl-1 flex justify-between">
                                        <span>On-Page Executive Summary</span>
                                        <span className="opacity-40 lowercase italic font-normal">Institutional Intro</span>
                                    </Label>
                                    <Textarea
                                        name="onPageLead"
                                        value={formData.onPageLead}
                                        onChange={handleChange}
                                        placeholder="A high-end tactical hook for the live analysis..."
                                        className="min-h-[100px] text-sm font-medium bg-white dark:bg-[#020617] border-[#CBD5E1] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] rounded-2xl resize-none px-6 py-4 focus-visible:ring-[#0F172A] dark:focus-visible:ring-[#22D3EE] shadow-sm transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-medium uppercase tracking-widest text-[#1E293B] dark:text-[#94A3B8] pl-1">Institutional Brief (Global Feed)</Label>
                                    <Textarea
                                        name="summary"
                                        value={formData.summary}
                                        onChange={handleChange}
                                        placeholder="Institutional brief for the intelligence silos..."
                                        className="min-h-[120px] text-sm font-medium bg-white dark:bg-[#020617] border-[#CBD5E1] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] rounded-2xl resize-none px-6 py-4 focus-visible:ring-[#0F172A] dark:focus-visible:ring-[#22D3EE] shadow-sm transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#1E293B] dark:text-[#94A3B8] pl-1 mb-2 block">Full Strategic Analysis</Label>
                                    <div className="rounded-2xl border border-border overflow-hidden bg-background">
                                        <RichTextEditor
                                            value={formData.content}
                                            onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                                            placeholder="The full breakdown of strategic intelligence..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "forecast" && (
                            <div className="space-y-6">
                                <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                        <h3 className="text-xs font-black uppercase italic tracking-tighter text-emerald-600 dark:text-emerald-400">Strategic Convergence (Best Case)</h3>
                                    </div>
                                    <Input
                                        value={formData.scenarios.best.title}
                                        onChange={(e) => handleScenarioChange("best", "title", e.target.value)}
                                        placeholder="SCENARIO TITLE..."
                                        className="bg-white dark:bg-[#020617] border-[#CBD5E1] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] rounded-xl font-black uppercase text-[11px] focus-visible:ring-[#0F172A] dark:focus-visible:ring-[#22D3EE]"
                                    />
                                    <Textarea
                                        value={formData.scenarios.best.description}
                                        onChange={(e) => handleScenarioChange("best", "description", e.target.value)}
                                        placeholder="ESTABLISH THE PARAMETERS..."
                                        className="bg-white dark:bg-[#020617] border-[#CBD5E1] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] rounded-xl min-h-[100px] text-sm focus-visible:ring-[#0F172A] dark:focus-visible:ring-[#22D3EE]"
                                    />
                                </div>

                                <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-blue-500" />
                                        <h3 className="text-xs font-black uppercase italic tracking-tighter text-blue-600 dark:text-blue-400">Linear Tension (Most Likely)</h3>
                                    </div>
                                    <Input
                                        value={formData.scenarios.likely.title}
                                        onChange={(e) => handleScenarioChange("likely", "title", e.target.value)}
                                        placeholder="SCENARIO TITLE..."
                                        className="bg-[#020617] dark:bg-[#020617] border-[#1E293B] dark:border-[#1E293B] text-[#F1F5F9] placeholder:text-[#64748B] rounded-xl font-black uppercase text-[11px]"
                                    />
                                    <Textarea
                                        value={formData.scenarios.likely.description}
                                        onChange={(e) => handleScenarioChange("likely", "description", e.target.value)}
                                        placeholder="ESTABLISH THE PARAMETERS..."
                                        className="bg-[#020617] dark:bg-[#020617] border-[#1E293B] dark:border-[#1E293B] text-[#F1F5F9] placeholder:text-[#64748B] rounded-xl min-h-[100px] text-sm"
                                    />
                                </div>

                                <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        <h3 className="text-xs font-black uppercase italic tracking-tighter text-red-600 dark:text-red-400">Systemic Fragmentation (Worst Case)</h3>
                                    </div>
                                    <Input
                                        value={formData.scenarios.worst.title}
                                        onChange={(e) => handleScenarioChange("worst", "title", e.target.value)}
                                        placeholder="SCENARIO TITLE..."
                                        className="bg-[#020617] dark:bg-[#020617] border-[#1E293B] dark:border-[#1E293B] text-[#F1F5F9] placeholder:text-[#64748B] rounded-xl font-black uppercase text-[11px]"
                                    />
                                    <Textarea
                                        value={formData.scenarios.worst.description}
                                        onChange={(e) => handleScenarioChange("worst", "description", e.target.value)}
                                        placeholder="ESTABLISH THE PARAMETERS..."
                                        className="bg-[#020617] dark:bg-[#020617] border-[#1E293B] dark:border-[#1E293B] text-[#F1F5F9] placeholder:text-[#64748B] rounded-xl min-h-[100px] text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "aeo" && (
                            <div className="space-y-6">
                                <div className="p-8 rounded-3xl bg-slate-950 text-white space-y-8 shadow-2xl border border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px]" />
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-5 w-5 text-emerald-400" />
                                            <h2 className="text-md font-black uppercase italic">Strategic Visibility Center</h2>
                                        </div>
                                        <Badge className="bg-emerald-500 text-white border-none py-0.5">PROTOCOL_READY</Badge>
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Strategic Intelligence Nodes (FAQ)</h3>
                                            <Button type="button" variant="outline" size="sm" onClick={addFaq} className="h-8 text-[9px] border-white/10 hover:bg-white/10 text-white rounded-xl">
                                                <Plus className="h-3.5 w-3.5 mr-1" /> Initialize Node
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {formData.faqData.map((faq: any, idx: number) => (
                                                <div key={idx} className="group relative bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4 transition-all hover:bg-white/[0.08]">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeFaq(idx)}
                                                        className="absolute top-3 right-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-red-400"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Input
                                                        value={faq.question}
                                                        onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                                                        placeholder="Strategic Question Factor..."
                                                        className="bg-transparent border-white/20 text-white font-bold h-10 rounded-xl focus-visible:ring-emerald-500"
                                                    />
                                                    <Textarea
                                                        value={faq.answer}
                                                        onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                                                        placeholder="Institutional Solution Snippet..."
                                                        className="bg-transparent border-white/10 text-slate-400 h-24 resize-none text-[13px] rounded-xl focus-visible:ring-emerald-500 leading-relaxed"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "meta" && (
                            <div className="space-y-6 bg-muted/20 p-8 rounded-3xl border border-border">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between pl-1">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Protocol Path (Slug Override)</Label>
                                            <button
                                                type="button"
                                                onClick={() => setIsSlugLocked(!isSlugLocked)}
                                                className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-cyan-400 transition-colors"
                                            >
                                                {isSlugLocked ? (
                                                    <><Lock className="h-3 w-3" /> Locked</>
                                                ) : (
                                                    <><Unlock className="h-3 w-3" /> Unlocked</>
                                                )}
                                            </button>
                                        </div>
                                        <Input
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            disabled={isSlugLocked}
                                            placeholder="manual-hard-path/"
                                            className={cn(
                                                "h-12 bg-card border-border rounded-xl font-mono text-xs lowercase",
                                                isSlugLocked && "opacity-60 cursor-not-allowed"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Sovereign Meta Title</Label>
                                        <Input
                                            name="metaTitle"
                                            value={formData.metaTitle}
                                            onChange={handleChange}
                                            placeholder="SEO Headline..."
                                            className="h-12 bg-card border-border rounded-xl font-bold text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Intelligence Meta Description</Label>
                                    <Textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        placeholder="Silo summary for outside indexers..."
                                        className="min-h-[120px] bg-card border-border rounded-xl resize-none font-medium text-xs px-6 py-4"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Tactical Sidebar */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                    {/* Identity Nexus */}
                    <div className="bg-[#111827] dark:bg-[#111827] border border-[#1E293B] dark:border-[#1E293B] rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b border-[#1E293B] pb-4 text-[#CBD5E1]">
                            <Shield className="h-4 w-4 text-cyan-400" />
                            <h2 className="text-[11px] font-black uppercase tracking-widest italic">Institutional Attribution</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Strategic Analyst</Label>
                                <Select value={formData.authorId} onValueChange={(v) => handleSelectChange("authorId", v)}>
                                    <SelectTrigger className="w-full rounded-xl bg-[#020617] border-[#1E293B] h-11 text-[11px] font-black uppercase text-[#F1F5F9]">
                                        <SelectValue placeholder="FETCH ANALYST" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full rounded-xl bg-[#020617] border-[#1E293B] text-[11px] font-black uppercase text-[#F1F5F9]">
                                        {initialAuthors.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Intelligence Sector</Label>
                                <Select value={formData.categoryId} onValueChange={(v) => handleSelectChange("categoryId", v)}>
                                    <SelectTrigger className="w-full rounded-xl bg-[#020617] border-[#1E293B] h-11 text-[11px] font-black uppercase text-[#F1F5F9]">
                                        <SelectValue placeholder="SELECT SECTOR" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full rounded-xl bg-[#020617] border-[#1E293B] text-[11px] font-black uppercase text-[#F1F5F9]">
                                        {initialCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-2xl border border-border/50">
                                <div className="space-y-0.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest">Premium Status</Label>
                                    <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter italic">Institutional Restricted</p>
                                </div>
                                <Switch checked={formData.isPremium} onCheckedChange={(c) => handleSwitchChange("isPremium", c)} />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-2xl border border-border/50">
                                <div className="space-y-0.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest">Featured Node</Label>
                                    <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter italic">War Room Spotlight</p>
                                </div>
                                <Switch checked={formData.isFeatured} onCheckedChange={(c) => handleSwitchChange("isFeatured", c)} />
                            </div>
                        </div>
                    </div>

                    {/* Tactical Volatility (Sliders) */}
                    <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-white/5 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-orange-500 to-red-500 opacity-50" />
                        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                            <Activity className="h-4 w-4 text-emerald-400" />
                            <h2 className="text-[11px] font-black uppercase tracking-widest italic">Operational Metrics</h2>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Operation Region</Label>
                                    <Globe className="h-3.5 w-3.5 opacity-40" />
                                </div>
                                <Select value={formData.region} onValueChange={(v) => handleSelectChange("region", v)}>
                                    <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-10 text-[10px] font-black uppercase tracking-widest">
                                        <SelectValue placeholder="GLOBAL" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-[10px] font-black uppercase text-white rounded-xl">
                                        {["GLOBAL", "MENA", "APAC", "EUROPE", "AMERICAS", "AFRICA"].map(r => (
                                            <SelectItem key={r} value={r}>{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Calculated Risk Index</Label>
                                    <span className={cn(
                                        "text-[10px] font-black px-2 py-0.5 rounded-full border",
                                        formData.riskLevel === "CRITICAL" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                                            formData.riskLevel === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                                                "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                    )}>
                                        {formData.riskLevel}
                                    </span>
                                </div>
                                <Select value={formData.riskLevel} onValueChange={(v) => handleSelectChange("riskLevel", v)}>
                                    <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-10 text-[10px] font-black uppercase tracking-widest">
                                        <SelectValue placeholder="RISK LEVEL" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-[10px] font-black uppercase text-white rounded-xl">
                                        {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(l => (
                                            <SelectItem key={l} value={l}>{l}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">Risk Intensity</span>
                                        <span className="text-emerald-500">{formData.riskScore}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={formData.riskScore}
                                        onChange={(e) => handleSelectChange("riskScore", e.target.value)}
                                        className="w-full accent-emerald-500 h-1 bg-white/10 rounded-full cursor-pointer"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">Strategic Impact</span>
                                        <span className="text-blue-500">{formData.impactScore}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={formData.impactScore}
                                        onChange={(e) => handleSelectChange("impactScore", e.target.value)}
                                        className="w-full accent-blue-500 h-1 bg-white/10 rounded-full cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Integrity */}
                    <div className="p-6 border-2 border-dashed border-border rounded-3xl bg-muted/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Database className="h-3.5 w-3.5 opacity-40" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">System Integrity Map</span>
                        </div>
                        <div className="space-y-2 font-mono text-[9px] text-muted-foreground/60 leading-tight">
                            <p>Node_ID: <span className="text-foreground">{article?.id || "INITIALIZING..."}</span></p>
                            <p>Vector: <span className="text-foreground">{formData.slug || "AUTO_GEN"}</span></p>
                            <p>Clock: <span className="text-foreground">{article?.publishedAt ? new Date(article.publishedAt).toLocaleString() : "NEW_CYCLE"}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
