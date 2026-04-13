"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { upsertArticle } from "@/lib/actions/admin-actions";
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
    Unlock,
    UploadCloud
} from "lucide-react";
import { slugify } from "@/lib/slugify";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { PromptLibrary } from "@/components/admin/prompt-library";
import { ProtocolSelectionPortal, PublicationFormat } from "@/components/admin/protocol-selection-portal";

interface ArticleEditorProps {
    article?: any;
    initialCategories: any[];
    initialAuthors: any[];
}

export default function ArticleEditor({ article, initialCategories, initialAuthors }: ArticleEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSlugLocked, setIsSlugLocked] = useState(true);
    const [isFoundryOpen, setIsFoundryOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"content" | "aeo" | "meta">("content");
    const [isProtocolPortalOpen, setIsProtocolPortalOpen] = useState(!article);

    const [formData, setFormData] = useState({
        title: article?.title || "",
        slug: article?.slug || "",
        onPageLead: article?.onPageLead || "",
        summary: article?.summary || "",
        content: article?.content || "",
        status: article?.status || "DRAFT",
        format: article?.format || "STRATEGIC_REPORT",
        isFeatured: article?.isFeatured || false,
        isFeaturedScenario: article?.isFeaturedScenario || false,
        isPremium: article?.isPremium || false,
        region: article?.region || "GLOBAL",
        riskLevel: article?.riskLevel || "MEDIUM",
        riskScore: article?.riskScore || 50,
        impactScore: article?.impactScore || 50,
        categoryId: article?.categoryId || "",
        authorId: article?.authorId || "",
        metaTitle: article?.metaTitle || "",
        metaDescription: article?.metaDescription || "",
        featuredImage: article?.featuredImage || "",
        scenarios: article?.scenarios || {
            best: { title: "Strategic Convergence", description: "", impact: 10 },
            likely: { title: "Linear Tension", description: "", impact: 50 },
            worst: { title: "Systemic Fragmentation", description: "", impact: 90 },
        },
        faqData: Array.isArray(article?.faqData) ? article.faqData : [
            { question: "What is the primary driver of this conflict?", answer: "" },
        ],
        auditNodes: article?.auditNodes || "",
        researchArchive: article?.researchArchive || "",
        directAnswer: article?.directAnswer || "",
        structuredData: article?.structuredData || {},
    });

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

    const handleScenarioChange = (type: "best" | "likely" | "worst", field: "title" | "description" | "impact", value: string | number) => {
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

    const handleProtocolSelect = (format: PublicationFormat) => {
        setFormData(prev => ({
            ...prev,
            format,
            structuredData: {} // Reset structured data when protocol changes
        }));
        setIsProtocolPortalOpen(false);
        toast.success(`Format set to ${format.replace(/_/g, ' ')}.`);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const toastId = toast.loading("Uploading image...");

        try {
            const response = await fetch(
                `/api/upload?filename=${encodeURIComponent(file.name)}`,
                {
                    method: 'POST',
                    body: file,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const blob = await response.json();
            setFormData(prev => ({ ...prev, featuredImage: blob.url }));
            toast.success("Image uploaded.", { id: toastId });
        } catch (error: any) {
            console.error('[Institutional Upload Failure]:', error);
            toast.error(error.message || "Upload failed.", { id: toastId });
        } finally {
            setLoading(false);
        }
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
            loading: "Saving...",
            success: (res) => {
                if (res.success) {
                    router.push("/admin/articles/");
                    router.refresh();
                    return article ? "Article saved." : "Article created.";
                }
                throw new Error(res.error || "Save failed.");
            },
            error: (err) => err.message || "Something went wrong.",
        });

        try {
            await promise;
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                    <Link href="/admin/articles/">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-[#1E293B] bg-[#020617] hover:bg-[#1E293B] text-[#F1F5F9]">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-cyan-500/10 text-[#0891B2] dark:text-[#22D3EE] border-cyan-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0">
                                {article ? "Editing" : "New Article"}
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-[#0F172A] dark:text-[#F1F5F9] leading-none">
                            {formData.title || "Untitled Article"}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={formData.status} onValueChange={(v: string) => handleSelectChange("status", v)}>
                        <SelectTrigger className="w-[140px] h-10 rounded-xl bg-[#020617] border-[#1E293B] text-[10px] font-black uppercase tracking-widest focus:ring-[#22D3EE] text-[#F1F5F9]">
                            <SelectValue placeholder="STATUS" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#1E293B] bg-[#020617] text-[#F1F5F9] text-[10px] font-black uppercase">
                            <SelectItem value="DRAFT">DRAFT</SelectItem>
                            <SelectItem value="PUBLISHED">PUBLISH</SelectItem>
                            <SelectItem value="ARCHIVED">ARCHIVE</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        type="button"
                        onClick={() => setIsFoundryOpen(true)}
                        variant="outline"
                        className="h-10 px-4 rounded-xl border-accent-red/20 text-accent-red bg-accent-red/5 hover:bg-accent-red/10 font-black uppercase text-[10px] tracking-widest gap-2"
                    >
                        <Zap className="h-4 w-4" />
                        AI Assist
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-10 px-8 rounded-xl font-black uppercase italic tracking-tighter shadow-lg shadow-primary/20 active:scale-95 transition-all text-[11px] bg-[#0F172A] text-white hover:bg-black dark:bg-white dark:text-[#0F172A] dark:hover:bg-white/90"
                    >
                        {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        {article ? "Save Changes" : "Publish Article"}
                    </Button>
                </div>
            </div>

            <PromptLibrary isOpen={isFoundryOpen} onClose={() => setIsFoundryOpen(false)} />
            <ProtocolSelectionPortal
                isOpen={isProtocolPortalOpen}
                onSelect={handleProtocolSelect}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-2xl border border-border/50">
                        {[
                            { id: "content", label: "Content", icon: FileText },
                            { id: "aeo", label: "SEO & AI", icon: Zap },
                            { id: "meta", label: "Meta (SEO)", icon: Globe },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-b-2",
                                    activeTab === tab.id
                                        ? "bg-[#020617] text-[#22D3EE] border-[#22D3EE] shadow-sm"
                                        : "text-[#64748B] dark:text-[#94A3B8] border-transparent hover:text-foreground hover:bg-[#020617]/50"
                                )}
                            >
                                <tab.icon className="h-3.5 w-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {activeTab === "content" && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Featured Image Asset</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            name="featuredImage"
                                            value={formData.featuredImage}
                                            onChange={handleChange}
                                            placeholder="https://images.unsplash.com/..."
                                            className="flex-1 h-12 bg-[#020617] border-[#1E293B] text-[#F1F5F9] placeholder:text-[#475569] rounded-xl focus-visible:ring-[#22D3EE] shadow-sm transition-all font-bold"
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                id="featured-upload"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-12 w-12 rounded-xl border-dashed border-[#CBD5E1] dark:border-[#1E293B] hover:bg-muted/50 transition-all active:scale-95"
                                            >
                                                <UploadCloud className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                                            </Button>
                                        </div>
                                    </div>
                                    {formData.featuredImage && (
                                        <div className="mt-2 relative group w-full max-w-sm aspect-video rounded-2xl overflow-hidden border border-border">
                                            <img
                                                src={formData.featuredImage}
                                                alt="Preview"
                                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, featuredImage: "" }))}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Title</Label>
                                    <Input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter article title..."
                                        className="text-2xl font-black h-16 bg-[#020617] border-[#1E293B] text-[#F1F5F9] placeholder:text-[#475569] rounded-2xl focus-visible:ring-[#22D3EE] px-6 uppercase tracking-tight italic shadow-sm transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1 flex justify-between">
                                        <span>Lead Summary</span>
                                        <span className="opacity-40 lowercase italic font-normal text-[#94A3B8]">Shown at top of article</span>
                                    </Label>
                                    <Textarea
                                        name="onPageLead"
                                        value={formData.onPageLead}
                                        onChange={handleChange}
                                        placeholder="A high-end strategic hook for the live analysis..."
                                        className="min-h-[100px] text-sm font-bold bg-[#020617] border-[#1E293B] text-[#F1F5F9] placeholder:text-[#475569] rounded-2xl resize-none px-6 py-4 focus-visible:ring-[#22D3EE] shadow-sm transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Summary</Label>
                                    <Textarea
                                        name="summary"
                                        value={formData.summary}
                                        onChange={handleChange}
                                        placeholder="Brief summary for article listings..."
                                        className="min-h-[120px] text-sm font-bold bg-[#020617] border-[#1E293B] text-[#F1F5F9] placeholder:text-[#475569] rounded-2xl resize-none px-6 py-4 focus-visible:ring-[#22D3EE] shadow-sm transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between pl-1 mb-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Article Content</Label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest italic animate-pulse">Mermaid.js Enabled</span>
                                            <button
                                                type="button"
                                                onClick={() => toast.info("To add a graph: Use Shift+Enter for new lines between nodes (e.g., graph TD [Shift+Enter] A-->B).")}
                                                className="text-[9px] font-bold text-slate-500 hover:text-white underline underline-offset-2"
                                            >
                                                Graph Guide
                                            </button>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl border border-[#1E293B] bg-[#020617] text-[#F1F5F9]">
                                        <RichTextEditor
                                            value={formData.content}
                                            onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                                            placeholder="Write your article content here..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-8 pt-12 border-t border-border/50">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-3">
                                            <Shield className="h-5 w-5 text-cyan-500" />
                                            <h2 className="text-sm font-black uppercase italic tracking-widest text-[#F1F5F9]">
                                                {formData.format.replace(/_/g, ' ')} Format Fields
                                            </h2>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsProtocolPortalOpen(true)}
                                            className="h-8 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-cyan-500 border border-white/5 hover:border-cyan-500/20 rounded-xl"
                                        >
                                            Switch Protocol
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 bg-[#020617]/50 p-6 rounded-3xl border border-[#1E293B]">
                                        {formData.format === "POLICY_BRIEF" && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] pl-1">Problem Definition</Label>
                                                    <Textarea
                                                        value={formData.structuredData?.problemDefinition || ""}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            structuredData: { ...prev.structuredData, problemDefinition: e.target.value }
                                                        }))}
                                                        placeholder="Define the primary strategic challenge..."
                                                        className="min-h-[100px] bg-[#020617] border-[#1E293B] text-[#F1F5F9] placeholder:text-[#475569] rounded-xl resize-none px-4 py-3 focus-visible:ring-cyan-500 transition-all font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] pl-1">Recommendations</Label>
                                                    {(formData.structuredData?.recommendations || [""]).map((rec: string, i: number) => (
                                                        <div key={i} className="flex gap-2 group/rec animate-in fade-in slide-in-from-left-2 duration-300">
                                                            <Input
                                                                value={rec}
                                                                onChange={(e) => {
                                                                    const newRecs = [...(formData.structuredData?.recommendations || [""])];
                                                                    newRecs[i] = e.target.value;
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        structuredData: { ...prev.structuredData, recommendations: newRecs }
                                                                    }));
                                                                }}
                                                                placeholder={`Recommendation #${i + 1}...`}
                                                                className="h-11 bg-[#020617] border-[#1E293B] text-[#F1F5F9] placeholder:text-[#475569] rounded-xl focus-visible:ring-cyan-500"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    const newRecs = (formData.structuredData?.recommendations || [""]).filter((_: any, idx: number) => idx !== i);
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        structuredData: { ...prev.structuredData, recommendations: newRecs.length ? newRecs : [""] }
                                                                    }));
                                                                }}
                                                                className="h-11 w-11 rounded-xl hover:bg-red-500/10 hover:text-red-500"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-10 text-[9px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5 text-white rounded-xl"
                                                        onClick={() => {
                                                            const newRecs = [...(formData.structuredData?.recommendations || [""]), ""];
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                structuredData: { ...prev.structuredData, recommendations: newRecs }
                                                            }));
                                                        }}
                                                    >
                                                        <Plus className="h-3.5 w-3.5 mr-2 text-cyan-500" /> Add Recommendation
                                                    </Button>
                                                </div>
                                            </>
                                        )}

                                        {formData.format === "STRATEGIC_REPORT" && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] pl-1">Research Methodology</Label>
                                                    <Textarea
                                                        value={formData.structuredData?.methodology || ""}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            structuredData: { ...prev.structuredData, methodology: e.target.value }
                                                        }))}
                                                        placeholder="Research methodology..."
                                                        className="min-h-[150px] bg-slate-950 border-[#1E293B] text-[#F1F5F9] rounded-xl text-xs font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] pl-1">Key Evidence</Label>
                                                    <Textarea
                                                        value={formData.structuredData?.evidence || ""}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            structuredData: { ...prev.structuredData, evidence: e.target.value }
                                                        }))}
                                                        placeholder="Key evidence and data..."
                                                        className="min-h-[150px] bg-slate-950 border-[#1E293B] text-[#F1F5F9] rounded-xl text-xs font-mono"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {formData.format === "SCENARIO_ANALYSIS" && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] pl-1">Primary Signals to Watch</Label>
                                                    <Textarea
                                                        value={formData.structuredData?.signals || ""}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            structuredData: { ...prev.structuredData, signals: e.target.value }
                                                        }))}
                                                        placeholder="List critical indicators (one per line)..."
                                                        className="min-h-[150px] bg-slate-950 border-[#1E293B] text-[#F1F5F9] rounded-xl text-xs font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] pl-1">Outcome Divergence Logic</Label>
                                                    <Textarea
                                                        value={formData.structuredData?.divergence || ""}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            structuredData: { ...prev.structuredData, divergence: e.target.value }
                                                        }))}
                                                        placeholder="Explain the pivot points..."
                                                        className="min-h-[150px] bg-slate-950 border-[#1E293B] text-[#F1F5F9] rounded-xl text-xs font-mono"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {formData.format === "RISK_ASSESSMENT" && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] pl-1">Core Volatility Drivers</Label>
                                                    <Textarea
                                                        value={formData.structuredData?.drivers || ""}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            structuredData: { ...prev.structuredData, drivers: e.target.value }
                                                        }))}
                                                        placeholder="Primary sources of risk..."
                                                        className="min-h-[150px] bg-slate-950 border-[#1E293B] text-[#F1F5F9] rounded-xl text-xs font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] pl-1">Primary Affected Sectors</Label>
                                                    <Textarea
                                                        value={formData.structuredData?.sectors || ""}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            structuredData: { ...prev.structuredData, sectors: e.target.value }
                                                        }))}
                                                        placeholder="Sectors under high-impact weight..."
                                                        className="min-h-[150px] bg-slate-950 border-[#1E293B] text-[#F1F5F9] rounded-xl text-xs font-mono"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {!["POLICY_BRIEF", "STRATEGIC_REPORT", "SCENARIO_ANALYSIS", "RISK_ASSESSMENT"].includes(formData.format) && (
                                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                                <Database className="h-10 w-10 text-slate-800 animate-pulse" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic max-w-xs">
                                                    Standard institutional metadata active. Protocol-specific specialized fields for {formData.format} are coming in the next Foundry update.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 px-1 pt-6">
                                        <TrendingUp className="h-5 w-5 text-cyan-500" />
                                        <h2 className="text-sm font-black uppercase italic tracking-widest text-[#F1F5F9]">Scenario Projections</h2>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        {/* Best Case */}
                                        <div className="p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 space-y-4 relative group transition-all hover:bg-emerald-500/10 hover:border-emerald-500/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">CONVERGENCE (BEST CASE)</h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Impact: {formData.scenarios.best?.impact || 10}%</span>
                                                    <span className="text-[9px] font-mono text-emerald-500/40 uppercase tracking-tighter">outcome_fidelity: high</span>
                                                </div>
                                            </div>
                                            <Input
                                                value={formData.scenarios.best.title}
                                                onChange={(e) => handleScenarioChange("best", "title", e.target.value)}
                                                placeholder="SCENARIO HEADLINE..."
                                                className="h-10 text-xs font-black uppercase tracking-wider bg-slate-950/50 border-emerald-500/20 text-[#F1F5F9] placeholder:text-slate-700 rounded-xl focus-visible:ring-emerald-500 transition-all"
                                            />
                                            <div className="space-y-3 pb-2">
                                                <div className="flex justify-between items-center px-1">
                                                    <Label className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60">Outcome Weight</Label>
                                                    <span className="text-[10px] font-mono text-emerald-500 font-bold">{formData.scenarios.best?.impact || 10}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0" max="100"
                                                    value={formData.scenarios.best?.impact || 10}
                                                    onChange={(e) => handleScenarioChange("best", "impact", parseInt(e.target.value))}
                                                    className="w-full h-1 bg-emerald-500/10 rounded-full accent-emerald-500 cursor-pointer"
                                                />
                                            </div>
                                            <Textarea
                                                value={formData.scenarios.best.description}
                                                onChange={(e) => handleScenarioChange("best", "description", e.target.value)}
                                                placeholder="ESTABLISH BEST-CASE PARAMETERS..."
                                                className="min-h-[100px] text-xs font-mono bg-slate-950/50 border-emerald-500/20 text-[#F1F5F9] placeholder:text-slate-700 rounded-xl resize-none px-4 py-3 focus-visible:ring-emerald-500 transition-all"
                                            />
                                        </div>

                                        {/* Likely Case */}
                                        <div className="p-6 rounded-2xl border border-blue-500/10 bg-blue-500/5 space-y-4 relative group transition-all hover:bg-blue-500/10 hover:border-blue-500/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4 text-blue-500" />
                                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500">CONTINUITY (MOST LIKELY)</h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Impact: {formData.scenarios.likely?.impact || 50}%</span>
                                                    <span className="text-[9px] font-mono text-blue-500/40 uppercase tracking-tighter">outcome_fidelity: medium</span>
                                                </div>
                                            </div>
                                            <Input
                                                value={formData.scenarios.likely.title}
                                                onChange={(e) => handleScenarioChange("likely", "title", e.target.value)}
                                                placeholder="SCENARIO HEADLINE..."
                                                className="h-10 text-xs font-black uppercase tracking-wider bg-slate-950/50 border-blue-500/20 text-[#F1F5F9] placeholder:text-slate-700 rounded-xl focus-visible:ring-blue-500 transition-all"
                                            />
                                            <div className="space-y-3 pb-2">
                                                <div className="flex justify-between items-center px-1">
                                                    <Label className="text-[9px] font-black uppercase tracking-widest text-blue-500/60">Outcome Weight</Label>
                                                    <span className="text-[10px] font-mono text-blue-500 font-bold">{formData.scenarios.likely?.impact || 50}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0" max="100"
                                                    value={formData.scenarios.likely?.impact || 50}
                                                    onChange={(e) => handleScenarioChange("likely", "impact", parseInt(e.target.value))}
                                                    className="w-full h-1 bg-blue-500/10 rounded-full accent-blue-500 cursor-pointer"
                                                />
                                            </div>
                                            <Textarea
                                                value={formData.scenarios.likely.description}
                                                onChange={(e) => handleScenarioChange("likely", "description", e.target.value)}
                                                placeholder="ESTABLISH MOST-LIKELY PARAMETERS..."
                                                className="min-h-[100px] text-xs font-mono bg-slate-950/50 border-blue-500/20 text-[#F1F5F9] placeholder:text-slate-700 rounded-xl resize-none px-4 py-3 focus-visible:ring-blue-500 transition-all"
                                            />
                                        </div>

                                        {/* Worst Case */}
                                        <div className="p-6 rounded-2xl border border-red-500/10 bg-red-500/5 space-y-4 relative group transition-all hover:bg-red-500/10 hover:border-red-500/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-red-500">FRAGMENTATION (WORST CASE)</h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Impact: {formData.scenarios.worst?.impact || 90}%</span>
                                                    <span className="text-[9px] font-mono text-red-500/40 uppercase tracking-tighter">outcome_fidelity: critical</span>
                                                </div>
                                            </div>
                                            <Input
                                                value={formData.scenarios.worst.title}
                                                onChange={(e) => handleScenarioChange("worst", "title", e.target.value)}
                                                placeholder="SCENARIO HEADLINE..."
                                                className="h-10 text-xs font-black uppercase tracking-wider bg-slate-950/50 border-red-500/20 text-[#F1F5F9] placeholder:text-slate-700 rounded-xl focus-visible:ring-red-500 transition-all"
                                            />
                                            <div className="space-y-3 pb-2">
                                                <div className="flex justify-between items-center px-1">
                                                    <Label className="text-[9px] font-black uppercase tracking-widest text-red-500/60">Outcome Weight</Label>
                                                    <span className="text-[10px] font-mono text-red-500 font-bold">{formData.scenarios.worst?.impact || 90}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0" max="100"
                                                    value={formData.scenarios.worst?.impact || 90}
                                                    onChange={(e) => handleScenarioChange("worst", "impact", parseInt(e.target.value))}
                                                    className="w-full h-1 bg-red-500/10 rounded-full accent-red-500 cursor-pointer"
                                                />
                                            </div>
                                            <Textarea
                                                value={formData.scenarios.worst.description}
                                                onChange={(e) => handleScenarioChange("worst", "description", e.target.value)}
                                                placeholder="ESTABLISH WORST-CASE PARAMETERS..."
                                                className="min-h-[100px] text-xs font-mono bg-slate-950/50 border-red-500/20 text-[#F1F5F9] placeholder:text-slate-700 rounded-xl resize-none px-4 py-3 focus-visible:ring-red-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-8 pt-12 border-t border-border/50">
                                        <div className="flex items-center gap-3 px-1">
                                            <Database className="h-5 w-5 text-[#22D3EE]" />
                                            <h2 className="text-sm font-black uppercase italic tracking-widest text-[#F1F5F9]">Research & References</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4 p-6 rounded-2xl border border-[#1E293B] bg-slate-950/30">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] pl-1 flex items-center gap-2">
                                                    <Database className="h-3.5 w-3.5 text-cyan-500" />
                                                    References
                                                </Label>
                                                <Textarea
                                                    name="auditNodes"
                                                    value={formData.auditNodes || ""}
                                                    onChange={handleChange}
                                                    placeholder="Sources and references..."
                                                    className="min-h-[150px] text-xs font-mono bg-slate-950 border-[#1E293B] text-[#F1F5F9] placeholder:text-slate-600 rounded-xl resize-none px-4 py-3 focus-visible:ring-[#22D3EE] shadow-sm transition-all"
                                                />
                                            </div>
                                            <div className="space-y-4 p-6 rounded-2xl border border-[#1E293B] bg-slate-950/30">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] pl-1 flex items-center gap-2">
                                                    <Shield className="h-3.5 w-3.5 text-red-500" />
                                                    Source URLs
                                                </Label>
                                                <Textarea
                                                    name="researchArchive"
                                                    value={formData.researchArchive || ""}
                                                    onChange={handleChange}
                                                    placeholder="Add source URLs..."
                                                    className="min-h-[150px] text-xs font-mono bg-slate-950 border-[#1E293B] text-[#F1F5F9] placeholder:text-slate-600 rounded-xl resize-none px-4 py-3 focus-visible:ring-[#22D3EE] shadow-sm transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "aeo" && (
                            <div className="space-y-6">
                                <div className="p-8 rounded-3xl bg-slate-950 text-white space-y-8 shadow-2xl border border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px]" />
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-5 w-5 text-[#22D3EE]" />
                                            <h2 className="text-md font-black uppercase italic tracking-tighter">
                                                <span className="text-[#22D3EE]">SEARCH & AI</span> <span className="text-[#F1F5F9]">AUTHORITY HUB</span>
                                            </h2>
                                        </div>
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase">OPTIMIZATION_READY</Badge>
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500">DIRECT ANSWER SNIPPET (Decision-Maker Focus)</h3>
                                            <Textarea
                                                name="directAnswer"
                                                value={formData.directAnswer}
                                                onChange={handleChange}
                                                placeholder="What does this mean for decision-makers? (Concise, citation-ready forensic answer)"
                                                className="min-h-[120px] bg-slate-900 border-white/10 text-slate-200 resize-none text-[13px] rounded-2xl focus-visible:ring-cyan-500 leading-relaxed px-6 py-4"
                                            />
                                            <p className="text-[9px] font-bold text-slate-500 italic uppercase tracking-widest pl-1">Target: Google SGE / Perplexity / Decision Briefs</p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F1F5F9]">FAQ Section</h3>
                                            <Button type="button" variant="outline" size="sm" onClick={addFaq} className="h-8 text-[9px] border-white/10 hover:bg-white/10 text-white rounded-xl font-black uppercase tracking-widest">
                                                <Plus className="h-3.5 w-3.5 mr-1" /> Add FAQ
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
                                                        placeholder="Question..."
                                                        className="bg-slate-900 border-white/10 text-white font-semibold h-10 rounded-xl focus-visible:ring-[#22D3EE]"
                                                    />
                                                    <Textarea
                                                        value={faq.answer}
                                                        onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                                                        placeholder="Answer..."
                                                        className="bg-slate-900 border-white/10 text-slate-200 h-24 resize-none text-[13px] rounded-xl focus-visible:ring-[#22D3EE] leading-relaxed"
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
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9]">URL Slug</Label>
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
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-100 pl-1">Meta Title</Label>
                                        <Input
                                            name="metaTitle"
                                            value={formData.metaTitle}
                                            onChange={handleChange}
                                            placeholder="SEO Headline..."
                                            className="h-12 bg-white dark:bg-card border-border rounded-xl font-bold text-xs text-slate-900 dark:text-slate-100"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-100 pl-1">Meta Description</Label>
                                    <Textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        placeholder="Description for search engines..."
                                        className="min-h-[120px] bg-white dark:bg-card border-border rounded-xl resize-none font-medium text-xs px-6 py-4 text-slate-900 dark:text-slate-100"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Right Column) */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                    <div className="bg-[#111827] dark:bg-[#111827] border border-[#1E293B] dark:border-[#1E293B] rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b border-[#1E293B] pb-4 text-[#F1F5F9]">
                            <Shield className="h-4 w-4 text-[#22D3EE]" />
                            <h2 className="text-[11px] font-black uppercase tracking-widest italic text-[#22D3EE]">Article Details</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] pl-1">Author</Label>
                                <Select value={formData.authorId} onValueChange={(v) => handleSelectChange("authorId", v)}>
                                    <SelectTrigger className="w-full rounded-xl bg-[#020617] border-[#1E293B] h-11 text-[11px] font-black uppercase text-[#F1F5F9] focus:ring-[#22D3EE] transition-all">
                                        <SelectValue placeholder="Select author" />
                                    </SelectTrigger>
                                    <SelectContent className="w-[var(--radix-select-trigger-width)] rounded-xl bg-[#020617] border-[#1E293B] text-[11px] font-black uppercase text-[#F1F5F9] p-1">
                                        {initialAuthors.map(a => <SelectItem key={a.id} value={a.id} className="rounded-lg hover:bg-white/5 cursor-pointer">{a.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] pl-1">Category</Label>
                                <Select value={formData.categoryId} onValueChange={(v) => handleSelectChange("categoryId", v)}>
                                    <SelectTrigger className="w-full rounded-xl bg-[#020617] border-[#1E293B] h-11 text-[11px] font-black uppercase text-[#F1F5F9] focus:ring-[#22D3EE] transition-all">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="w-[var(--radix-select-trigger-width)] rounded-xl bg-[#020617] border-[#1E293B] text-[11px] font-black uppercase text-[#F1F5F9] p-1">
                                        {initialCategories.map(c => <SelectItem key={c.id} value={c.id} className="rounded-lg hover:bg-white/5 cursor-pointer">{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-2xl border border-border/50">
                                <div className="space-y-0.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">Premium Status</Label>
                                    <p className="text-[8px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter italic">Subscribers only</p>
                                </div>
                                <Switch checked={formData.isPremium} onCheckedChange={(c) => handleSwitchChange("isPremium", c)} />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-2xl border border-border/50">
                                <div className="space-y-0.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">Featured</Label>
                                    <p className="text-[8px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter italic">Show on homepage</p>
                                </div>
                                <Switch checked={formData.isFeatured} onCheckedChange={(c) => handleSwitchChange("isFeatured", c)} className="data-[state=checked]:bg-[#22D3EE] focus-visible:ring-[#22D3EE]/50" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                                <div className="space-y-0.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9]">Scenario Feature</Label>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter italic">Show in scenario section</p>
                                </div>
                                <Switch checked={formData.isFeaturedScenario} onCheckedChange={(c) => handleSwitchChange("isFeaturedScenario", c)} className="data-[state=checked]:bg-[#22D3EE] focus-visible:ring-[#22D3EE]/50" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-white/5 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-orange-500 to-red-500 opacity-50" />
                        <div className="flex items-center gap-2 border-b border-white/10 pb-4 text-[#F1F5F9]">
                            <Activity className="h-4 w-4 text-[#22D3EE]" />
                            <h2 className="text-[11px] font-black uppercase tracking-widest italic text-[#22D3EE]">Risk & Region</h2>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-100">Region</Label>
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
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-100">Calculated Risk Index</Label>
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
                                        <span className="text-white font-black tracking-widest uppercase">Risk Intensity</span>
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
                                        <span className="text-white font-black tracking-widest uppercase">Strategic Impact</span>
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

                    <div className="p-6 border-2 border-dashed border-border rounded-3xl bg-muted/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Database className="h-3.5 w-3.5 opacity-40 text-cyan-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] italic">Article Metadata</span>
                        </div>
                        <div className="space-y-2 font-mono text-[9px] text-slate-500 dark:text-slate-400 leading-tight">
                            <p>ID: <span className="text-slate-800 dark:text-slate-100">{article?.id || "Not saved yet"}</span></p>
                            <p>Slug: <span className="text-slate-800 dark:text-slate-100">{formData.slug || "Auto-generated"}</span></p>
                            <p>Published: <span className="text-slate-800 dark:text-slate-100">{article?.publishedAt ? new Date(article.publishedAt).toLocaleString() : "Not published"}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
