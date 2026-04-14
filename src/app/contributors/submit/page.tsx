"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
    Send, 
    FileText, 
    Layers, 
    Globe, 
    Plus, 
    X, 
    Loader2, 
    AlertCircle,
    Info,
    ChevronRight,
    ExternalLink,
    Shield
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { submitArticle } from "@/lib/actions/user-actions";
import { getAdminCategories } from "@/lib/actions/admin-actions";
import { FORMAT_LABELS, REGION_LABELS } from "@/lib/constants/formats";
import Link from "next/link";

export default function SubmitArticlePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [isApproved, setIsApproved] = useState<boolean | null>(null);
    const [checkingStatus, setCheckingStatus] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        content: "",
        format: "",
        categoryId: "",
        region: "GLOBAL",
        sourceUrls: [""]
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin/?callbackUrl=/contributors/submit/");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            checkUserStatus();
            loadCategories();
        }
    }, [status, session]);

    const checkUserStatus = async () => {
        try {
            // We need to check the actual DB status because session might be stale
            // For now, we'll trust the session if it has isApproved, or just fetch the user
            // Since we don't have a specific getMe action, we'll use a hack or just use session.user.isApproved if it exists
            const user = session?.user as any;
            setIsApproved(user.isApproved || user.role === "ADMIN" || user.role === "EDITOR");
        } finally {
            setCheckingStatus(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await getAdminCategories();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddSource = () => {
        setFormData({ ...formData, sourceUrls: [...formData.sourceUrls, ""] });
    };

    const handleRemoveSource = (index: number) => {
        const newUrls = [...formData.sourceUrls];
        newUrls.splice(index, 1);
        setFormData({ ...formData, sourceUrls: newUrls });
    };

    const handleSourceChange = (index: number, value: string) => {
        const newUrls = [...formData.sourceUrls];
        newUrls[index] = value;
        setFormData({ ...formData, sourceUrls: newUrls });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.format) return toast.error("Please select a publication format.");
        if (!formData.categoryId) return toast.error("Please select a research topic.");

        setSubmitting(true);
        try {
            const cleanSourceUrls = formData.sourceUrls.filter(url => url.trim() !== "");
            const res = await submitArticle({
                ...formData,
                sourceUrls: cleanSourceUrls
            });

            if (res.success) {
                toast.success("Article submitted successfully. Our editorial team will review it within 7 days.");
                router.push("/dashboard/");
            } else {
                toast.error(res.error || "Failed to submit article.");
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    if (status === "loading" || checkingStatus) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <Loader2 className="h-8 w-8 animate-spin text-[#22D3EE]" />
            </div>
        );
    }

    if (!isApproved) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-card border border-border p-10 rounded-[2.5rem] text-center space-y-6 shadow-2xl">
                    <div className="h-20 w-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                        <Shield className="h-10 w-10 text-amber-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-[#F1F5F9]">Pending Approval</h1>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Your account is pending approval as a registered contributor. You'll be able to submit articles once our editorial board verifies your credentials.
                        </p>
                    </div>
                    <Link href="/dashboard/">
                        <Button variant="outline" className="w-full h-12 rounded-xl border-border hover:bg-white hover:text-black font-black uppercase tracking-widest text-[10px]">
                            Return to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left: Form */}
                <div className="lg:col-span-8 space-y-12">
                    <header className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Send className="h-4 w-4 text-[#22D3EE]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#22D3EE]">Article Submission</span>
                        </div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#F1F5F9]">
                            Submit Your <span className="text-accent-red">Analysis</span>
                        </h1>
                        <p className="text-muted-foreground font-medium text-lg uppercase tracking-tight">
                            Share your expertise with the Today Decode readership.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Title & Summary */}
                        <div className="space-y-8 bg-card border border-border p-8 md:p-12 rounded-[3.5rem] shadow-xl">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Article Title</label>
                                <Input 
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter a compelling, strategic title..."
                                    required
                                    className="h-16 text-xl font-black italic bg-white dark:bg-[#0F172A] border-border rounded-xl px-6 focus:ring-2 focus:ring-[#22D3EE]"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1 flex justify-between">
                                    Executive Summary
                                    <span className={cn(
                                        "text-[8px] font-bold tracking-normal",
                                        formData.summary.length >= 150 && formData.summary.length <= 300 ? "text-emerald-500" : "text-amber-500"
                                    )}>
                                        {formData.summary.split(/\s+/).filter(Boolean).length} words (150-300 recommended)
                                    </span>
                                </label>
                                <Textarea 
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    placeholder="Provide a concise briefing of your core arguments..."
                                    required
                                    className="min-h-[150px] bg-white dark:bg-[#0F172A] border-border rounded-xl p-6 text-sm font-medium leading-relaxed resize-none"
                                />
                            </div>
                        </div>

                        {/* Metadata Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Publication Format</label>
                                <Select value={formData.format} onValueChange={(val) => setFormData({ ...formData, format: val })}>
                                    <SelectTrigger className="h-14 bg-card border-border rounded-xl text-xs font-bold uppercase tracking-widest">
                                        <SelectValue placeholder="SELECT FORMAT" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0F172A] border-[#1E293B]">
                                        {Object.entries(FORMAT_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value} className="text-xs font-bold uppercase tracking-widest hover:bg-[#22D3EE] hover:text-[#020617]">
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Research Topic</label>
                                <Select value={formData.categoryId} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                                    <SelectTrigger className="h-14 bg-card border-border rounded-xl text-xs font-bold uppercase tracking-widest">
                                        <SelectValue placeholder="SELECT TOPIC" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0F172A] border-[#1E293B]">
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id} className="text-xs font-bold uppercase tracking-widest hover:bg-[#22D3EE] hover:text-[#020617]">
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Region</label>
                                <Select value={formData.region} onValueChange={(val) => setFormData({ ...formData, region: val })}>
                                    <SelectTrigger className="h-14 bg-card border-border rounded-xl text-xs font-bold uppercase tracking-widest">
                                        <SelectValue placeholder="SELECT REGION" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0F172A] border-[#1E293B]">
                                        {Object.entries(REGION_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value} className="text-xs font-bold uppercase tracking-widest hover:bg-[#22D3EE] hover:text-[#020617]">
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3 bg-card border border-border p-8 md:p-12 rounded-[3.5rem] shadow-xl">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1 flex items-center gap-2">
                                <FileText className="h-3 w-3" /> Full Analysis Documentation
                            </label>
                            <Textarea 
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Develop your full strategic analysis here..."
                                required
                                className="min-h-[500px] bg-white dark:bg-[#0F172A] border-border rounded-[2rem] p-10 text-base font-medium leading-loose resize-none font-serif"
                            />
                            <div className="flex items-center gap-2 text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-4">
                                <Info className="h-3.5 w-3.5" />
                                HTML formatting is supported for headings, bold, and bullet points.
                            </div>
                        </div>

                        {/* Sources */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F1F5F9] flex items-center gap-2">
                                    <ExternalLink className="h-3.5 w-3.5 text-[#22D3EE]" /> Verification Sources (Optional)
                                </h3>
                                <Button 
                                    type="button" 
                                    onClick={handleAddSource}
                                    variant="outline"
                                    className="h-8 px-3 rounded-lg border-border hover:bg-white/5 text-[8px] font-black uppercase tracking-widest"
                                >
                                    <Plus className="mr-1.5 h-3 w-3" /> Add Source
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {formData.sourceUrls.map((url, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="relative flex-1">
                                            <Input 
                                                value={url}
                                                onChange={(e) => handleSourceChange(index, e.target.value)}
                                                placeholder="https://..."
                                                className="h-12 bg-white dark:bg-[#0F172A] border-border rounded-xl px-4 text-xs font-mono"
                                            />
                                        </div>
                                        {formData.sourceUrls.length > 1 && (
                                            <Button 
                                                type="button" 
                                                onClick={() => handleRemoveSource(index)}
                                                variant="ghost" 
                                                className="h-12 w-12 rounded-xl text-muted-foreground hover:text-accent-red hover:bg-accent-red/10"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">Procedural Acknowledgement</p>
                                <p className="text-[9px] font-bold text-[#475569] uppercase italic max-w-sm">
                                    By submitting, you certify this analysis is your original work and meets our editorial integrity standards.
                                </p>
                            </div>
                            <Button 
                                type="submit" 
                                disabled={submitting}
                                className="h-16 px-16 rounded-[2rem] bg-accent-red text-white hover:bg-accent-red/90 font-black uppercase tracking-widest text-sm shadow-xl shadow-accent-red/20 transition-all active:scale-95 min-w-[300px]"
                            >
                                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="mr-3 h-4 w-4" />}
                                Finalize & Submit Analysis
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Right: Sidebar Guidelines */}
                <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 h-fit">
                    <div className="bg-[#111827] border border-[#1E293B] rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Layers className="h-32 w-32" />
                        </div>
                        
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3 border-b border-[#1E293B] pb-6">
                                <div className="h-10 w-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center border border-[#22D3EE]/20">
                                    <Shield className="h-5 w-5 text-[#22D3EE]" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest italic text-[#F1F5F9]">Editorial Standards</h3>
                                    <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-tight italic">Submission Matrix v2.0</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#22D3EE]">Word Count Protocols</h4>
                                    <ul className="space-y-2">
                                        {[
                                            { label: "Briefs", range: "800 - 1,200 words" },
                                            { label: "Reports", range: "2,500 - 4,000 words" },
                                            { label: "Commentary", range: "600 - 1,000 words" }
                                        ].map((item) => (
                                            <li key={item.label} className="flex items-center justify-between text-[11px] font-medium text-[#CBD5E1]">
                                                <span>{item.label}</span>
                                                <span className="font-mono text-[#64748B]">{item.range}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-[#1E293B]">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#22D3EE]">Submission Lifecycle</h4>
                                    <div className="space-y-4">
                                        {[
                                            { step: "Editorial Intake", time: "24-48 Hours" },
                                            { step: "Strategic Review", time: "3-5 Business Days" },
                                            { step: "Final Publication", time: "7-10 Days Total" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="text-[10px] font-black text-[#22D3EE]/30 italic">{i+1}</div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-[#F1F5F9]">{item.step}</p>
                                                    <p className="text-[9px] font-bold text-[#64748B]">{item.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-[#1E293B]">
                                    <Link href="/submission-guidelines/">
                                        <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-[#22D3EE] hover:text-[#0EA5E9] flex items-center gap-2 group">
                                            Full Submission Guidelines
                                            <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-2 border-dashed border-[#1E293B] rounded-[2.5rem] bg-[#020617]/40 space-y-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-500/50" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Policy Note</h4>
                        </div>
                        <p className="text-[10px] font-medium text-[#64748B] leading-relaxed italic">
                            Submissions are reviewed for objective analysis and verifiable data. Partisan advocacy or unverifiable claims will lead to instant node rejection.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
