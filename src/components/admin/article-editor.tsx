"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    upsertArticle,
    getAdminCategories,
    getAdminAuthors
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
    Eye,
    Layout,
    Settings,
    FileText,
    Zap,
    TrendingUp,
    MessageSquare,
    Link2,
    Plus,
    Trash2
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ArticleEditorProps {
    article?: any;
}

export default function ArticleEditor({ article }: ArticleEditorProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"content" | "metadata" | "forecast" | "aeo">("content");

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
            { question: "How does this impact global markets?", answer: "" }
        ],
    });

    useEffect(() => {
        const loadData = async () => {
            const [cats, auths] = await Promise.all([
                getAdminCategories(),
                getAdminAuthors()
            ]);
            setCategories(cats);
            setAuthors(auths);
        };
        loadData();
    }, []);

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

    const generateSlug = () => {
        const s = formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        setFormData(prev => ({ ...prev, slug: s + '/' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await upsertArticle({
                id: article?.id,
                ...formData,
                riskScore: Number(formData.riskScore),
                impactScore: Number(formData.impactScore),
            });

            if (res.success) {
                toast.success(article ? "Intelligence report updated." : "New report filed successfully.");
                router.push("/admin/articles/");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to file report.");
            }
        } catch (err) {
            toast.error("Network interface error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-30 flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm -mx-4 sm:-mx-6 -mt-6 mb-8 transition-all duration-300">
                <div className="flex items-center gap-4">
                    <Link href="/admin/articles">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                            <ChevronLeft className="h-5 w-5 text-slate-500" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase py-0 px-2 h-5 border-slate-200 dark:border-slate-700 text-slate-500">
                                {article ? "RE-ROUTING REPORT" : "NEW INTEL SCAN"}
                            </Badge>
                            <span className="text-[10px] text-slate-300 font-bold">/</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">Sector: Geopolitical Intelligence</span>
                        </div>
                        <h1 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white leading-none">
                            {formData.title || "UNTITLED_INTEL_REPORT"}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={formData.status} onValueChange={(v: string) => handleSelectChange("status", v)}>
                        <SelectTrigger className="w-[140px] h-10 rounded-none bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest focus:ring-0">
                            <SelectValue placeholder="STATUS" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase">
                            <SelectItem value="DRAFT">DRAFT</SelectItem>
                            <SelectItem value="PUBLISHED">PUBLISH</SelectItem>
                            <SelectItem value="ARCHIVED">ARCHIVE</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-slate-900 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-none h-10 px-8 font-black uppercase italic tracking-tighter transition-all active:scale-95 shadow-xl disabled:opacity-50"
                    >
                        {loading ? < Zap className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4 mr-2" />}
                        {article ? "Commit Updates" : "File Report"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Tabs / Navigation */}
                    <div className="flex items-center border-b border-slate-200 dark:border-slate-800 overflow-x-auto scroller-hidden">
                        {[
                            { id: "content", label: "Report Body", icon: FileText },
                            { id: "forecast", label: "Scenario modeling", icon: TrendingUp },
                            { id: "aeo", label: "AI & Citations", icon: Zap },
                            { id: "metadata", label: "Search & SEO", icon: Settings },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap",
                                    activeTab === tab.id ? "border-slate-900 dark:border-white text-slate-900 dark:text-white" : "border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <tab.icon className="h-3 w-3" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === "content" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Primary Headline</Label>
                                <div className="flex gap-2">
                                    <Input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="ENTER HEADLINE..."
                                        className="text-2xl font-bold h-14 bg-transparent border-slate-200 dark:border-slate-800 rounded-none focus-visible:ring-slate-900 placeholder:text-slate-200 flex-1"
                                    />
                                    <Button type="button" variant="outline" className="h-14 rounded-none px-4" onClick={generateSlug} title="Sync Slug">
                                        <Link2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">On-Page Lead (Institutional Access Intro)</Label>
                                <Textarea
                                    name="onPageLead"
                                    value={formData.onPageLead}
                                    onChange={handleChange}
                                    placeholder="A high-visibility hook for the live page..."
                                    className="min-h-[80px] text-sm italic font-medium bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-none resize-none px-4 py-3"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Executive Summary (Global Feed)</Label>
                                <Textarea
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleChange}
                                    placeholder="Brief brief for the intelligence silos..."
                                    className="min-h-[100px] text-sm font-medium bg-transparent border-slate-200 dark:border-slate-800 rounded-none resize-none px-4 py-3"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Intelligence Briefing (Full Analysis)</Label>
                                <Textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="The full breakdown of geopolitical analysis..."
                                    className="min-h-[500px] text-base leading-relaxed font-serif bg-transparent border-slate-200 dark:border-slate-800 rounded-none px-6 py-6 focus-visible:ring-1 focus-visible:ring-slate-400"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "forecast" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 space-y-6">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    <h2 className="text-sm font-black uppercase italic tracking-tighter">Strategic convergence (Best Case)</h2>
                                </div>
                                <div className="space-y-4">
                                    <Input
                                        value={formData.scenarios.best.title}
                                        onChange={(e) => handleScenarioChange("best", "title", e.target.value)}
                                        placeholder="SCENARIO TITLE..."
                                        className="bg-white dark:bg-slate-950 rounded-none border-slate-200 dark:border-slate-800 font-bold"
                                    />
                                    <Textarea
                                        value={formData.scenarios.best.description}
                                        onChange={(e) => handleScenarioChange("best", "description", e.target.value)}
                                        placeholder="BEST CASE DESCRIPTION..."
                                        className="bg-white dark:bg-slate-950 rounded-none border-slate-200 dark:border-slate-800 h-32"
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-500/5 border border-blue-500/10 p-6 space-y-6">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-blue-500" />
                                    <h2 className="text-sm font-black uppercase italic tracking-tighter">Linear Tension (Most Likely)</h2>
                                </div>
                                <div className="space-y-4">
                                    <Input
                                        value={formData.scenarios.likely.title}
                                        onChange={(e) => handleScenarioChange("likely", "title", e.target.value)}
                                        placeholder="SCENARIO TITLE..."
                                        className="bg-white dark:bg-slate-950 rounded-none border-slate-200 dark:border-slate-800 font-bold"
                                    />
                                    <Textarea
                                        value={formData.scenarios.likely.description}
                                        onChange={(e) => handleScenarioChange("likely", "description", e.target.value)}
                                        placeholder="MOST LIKELY DESCRIPTION..."
                                        className="bg-white dark:bg-slate-950 rounded-none border-slate-200 dark:border-slate-800 h-32"
                                    />
                                </div>
                            </div>

                            <div className="bg-red-500/5 border border-red-500/10 p-6 space-y-6">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-red-500" />
                                    <h2 className="text-sm font-black uppercase italic tracking-tighter">Systemic Fragmentation (Worst Case)</h2>
                                </div>
                                <div className="space-y-4">
                                    <Input
                                        value={formData.scenarios.worst.title}
                                        onChange={(e) => handleScenarioChange("worst", "title", e.target.value)}
                                        placeholder="SCENARIO TITLE..."
                                        className="bg-white dark:bg-slate-950 rounded-none border-slate-200 dark:border-slate-800 font-bold"
                                    />
                                    <Textarea
                                        value={formData.scenarios.worst.description}
                                        onChange={(e) => handleScenarioChange("worst", "description", e.target.value)}
                                        placeholder="WORST CASE DESCRIPTION..."
                                        className="bg-white dark:bg-slate-950 rounded-none border-slate-200 dark:border-slate-800 h-32"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "aeo" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-slate-900 text-white p-8 space-y-6 shadow-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-emerald-400 animate-pulse" />
                                        <h2 className="text-md font-black uppercase italic">AEO/GEO Optimization Hub</h2>
                                    </div>
                                    <Badge className="bg-emerald-500 text-white border-none">AI CITATION READY</Badge>
                                </div>
                                <p className="text-slate-400 text-xs font-medium max-w-2xl">
                                    These fields directly feed the semantic layer of Today Decode, enabling citation by Google SGE, Perplexity, and OpenAI O1. Use concise, data-rich snippets.
                                </p>

                                <div className="space-y-6 pt-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quick Answer Intelligence (FAQ)</h3>
                                        <Button type="button" variant="outline" size="sm" onClick={addFaq} className="h-7 text-[9px] border-white/10 hover:bg-white/5 text-white bg-transparent rounded-none">
                                            <Plus className="h-3 w-3 mr-1" /> Add Node
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.faqData.map((faq: any, idx: number) => (
                                            <div key={idx} className="group relative bg-white/5 border border-white/10 p-4 space-y-4">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFaq(idx)}
                                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-red-400"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                                <Input
                                                    value={faq.question}
                                                    onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                                                    placeholder="The Strategic Question..."
                                                    className="bg-transparent border-white/10 text-white font-bold h-9 focus-visible:ring-emerald-500 rounded-none"
                                                />
                                                <Textarea
                                                    value={faq.answer}
                                                    onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                                                    placeholder="The Concise Analysis..."
                                                    className="bg-transparent border-white/10 text-slate-300 h-20 resize-none text-xs focus-visible:ring-emerald-500 rounded-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "metadata" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-slate-50/50 dark:bg-slate-950/50 p-6 border border-slate-200 dark:border-slate-800 shadow-inner">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Meta Title Override</Label>
                                    <Input
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleChange}
                                        placeholder="SEO Title Control..."
                                        className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-none font-bold text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Slug Manual Override</Label>
                                    <Input
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="custom-path/"
                                        className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-none font-bold text-xs text-slate-400"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Meta Description</Label>
                                <Textarea
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    placeholder="Search Engine visibility control..."
                                    className="min-h-[100px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-none resize-none font-bold text-xs"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Tactical Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Identity Cockpit */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
                            <Layout className="h-4 w-4 text-slate-900 dark:text-white" />
                            <h2 className="text-xs font-black uppercase tracking-wider italic">Identity Cockpit</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Analyst of Record</Label>
                                <Select value={formData.authorId} onValueChange={(v: string) => handleSelectChange("authorId", v)}>
                                    <SelectTrigger className="rounded-none bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase">
                                        <SelectValue placeholder="SELECT AUTHOR" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none text-[10px] font-bold uppercase">
                                        {authors.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Content Silo (Category)</Label>
                                <Select value={formData.categoryId} onValueChange={(v: string) => handleSelectChange("categoryId", v)}>
                                    <SelectTrigger className="rounded-none bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase">
                                        <SelectValue placeholder="SELECT CATEGORY" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none text-[10px] font-bold uppercase">
                                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="pt-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Premium Access</Label>
                                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Institutional Only</p>
                                </div>
                                <Switch checked={formData.isPremium} onCheckedChange={(c: boolean) => handleSwitchChange("isPremium", c)} className="data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-white" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Featured Analysis</Label>
                                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Front-Page Spotlight</p>
                                </div>
                                <Switch checked={formData.isFeatured} onCheckedChange={(c: boolean) => handleSwitchChange("isFeatured", c)} className="data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Operational Analysis */}
                    <div className="bg-slate-900 text-white p-5 space-y-6 shadow-2xl transition-all duration-300 hover:shadow-emerald-500/10 hover:border-emerald-500/20">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-2">
                            <Shield className="h-4 w-4 text-emerald-400" />
                            <h2 className="text-xs font-black uppercase tracking-wider italic">Operational Metrics</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">Region Sector</Label>
                                    <Globe className="h-3 w-3 text-emerald-400" />
                                </div>
                                <Select value={formData.region} onValueChange={(v: string) => handleSelectChange("region", v)}>
                                    <SelectTrigger className="rounded-none bg-white/5 border-white/10 text-[10px] font-black uppercase h-9">
                                        <SelectValue placeholder="GLOBAL" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none text-[10px] font-black uppercase bg-slate-900 text-white border-white/10">
                                        {["GLOBAL", "MENA", "APAC", "EUROPE", "AMERICAS", "AFRICA"].map(r => (
                                            <SelectItem key={r} value={r}>{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest font-mono">
                                        <span className="text-slate-400">Tactical Risk Level</span>
                                        <span className={cn(
                                            formData.riskLevel === "CRITICAL" ? "text-red-500" :
                                                formData.riskLevel === "HIGH" ? "text-orange-500" :
                                                    "text-emerald-500 underline"
                                        )}>{formData.riskLevel}</span>
                                    </div>
                                    <Select value={formData.riskLevel} onValueChange={(v: string) => handleSelectChange("riskLevel", v)}>
                                        <SelectTrigger className="rounded-none bg-white/5 border-white/10 text-[10px] font-black uppercase h-9">
                                            <SelectValue placeholder="RISK LEVEL" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none text-[10px] font-black uppercase bg-slate-900 text-white border-white/10">
                                            {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(l => (
                                                <SelectItem key={l} value={l}>{l}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest font-mono">
                                        <span className="text-slate-400 text-[8px]">Proprietary Risk Score</span>
                                        <span className="text-emerald-400 underline">{formData.riskScore}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={formData.riskScore}
                                        onChange={(e) => handleSelectChange("riskScore", e.target.value)}
                                        className="w-full accent-emerald-500 h-1 bg-white/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest font-mono">
                                        <span className="text-slate-400 text-[8px]">Strategic Impact factor</span>
                                        <span className="text-blue-400 underline">{formData.impactScore}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={formData.impactScore}
                                        onChange={(e) => handleSelectChange("impactScore", e.target.value)}
                                        className="w-full accent-blue-500 h-1 bg-white/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Database Identity */}
                    <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-none bg-slate-50/50 dark:bg-slate-950/50">
                        <div className="flex items-center gap-2 mb-3">
                            <Database className="h-3 w-3 text-slate-400" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">System Handshake</span>
                        </div>
                        <div className="space-y-1 font-mono text-[8px] text-slate-400 font-bold break-all">
                            <p>ID: {article?.id || "N/A_WAITING_FOR_FILE"}</p>
                            <p>SLUG_MAP: {formData.slug || "AUTO_GENERATED"}</p>
                            <p>STAMP: {article?.publishedAt ? new Date(article.publishedAt).toISOString() : "SYSTEM_CLOCK_READY"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
