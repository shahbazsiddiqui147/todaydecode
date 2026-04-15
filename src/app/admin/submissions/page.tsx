"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
    Inbox,
    Search,
    Clock,
    User,
    FileText,
    CheckCircle2,
    XCircle,
    Eye,
    ChevronRight,
    Loader2,
    Check,
    X,
    MessageSquare,
    Link as LinkIcon,
    AlertCircle,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    getAdminSubmissions,
    reviewSubmission
} from "@/lib/actions/admin-actions";
import { FORMAT_LABELS } from "@/lib/constants/formats";
import { SubmissionStatus } from "@prisma/client";

export default function SubmissionsManager() {
    const { data: session, status } = useSession();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("ALL");
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [reviewing, setReviewing] = useState(false);
    const [rejectNote, setRejectNote] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && (!session || !["ADMIN", "EDITOR"].includes(session.user.role))) {
            redirect("/admin/");
        }
    }, [session, status]);

    useEffect(() => {
        if (status === "authenticated" && ["ADMIN", "EDITOR"].includes(session.user.role)) {
            loadSubmissions();
        }
    }, [status, session, filter]);

    const loadSubmissions = async () => {
        try {
            setLoading(true);
            const data = await getAdminSubmissions(filter === "ALL" ? undefined : filter);
            setSubmissions(data);
        } catch (err) {
            toast.error("Failed to load submissions.");
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (action: 'approve' | 'reject') => {
        if (action === 'reject' && !rejectNote) {
            toast.error("Please provide a reason for rejection.");
            return;
        }

        try {
            setReviewing(true);
            const res = await reviewSubmission(selectedSubmission.id, action, rejectNote);
            if (res.success) {
                toast.success(action === 'approve' ? "Submission approved. Draft article created." : "Submission rejected.");
                setSelectedSubmission(null);
                setRejectNote("");
                setShowRejectInput(false);
                loadSubmissions();
            } else {
                toast.error(res.error || "Review action failed.");
            }
        } catch (err) {
            toast.error("An error occurred during review.");
        } finally {
            setReviewing(false);
        }
    };

    if (status === "loading") return <div className="space-y-4 animate-pulse">{[...Array(6)].map((_,i) => <div key={i} className="h-16 bg-white/5 rounded-2xl" />)}</div>;

    const FILTERS = [
        { id: "ALL", label: "All" },
        { id: "PENDING", label: "Pending" },
        { id: "UNDER_REVIEW", label: "Under Review" },
        { id: "APPROVED", label: "Approved" },
        { id: "REJECTED", label: "Rejected" },
        { id: "PUBLISHED", label: "Published" },
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "UNDER_REVIEW": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "APPROVED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "PUBLISHED": return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
            case "REJECTED": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
            default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1E293B] dark:border-[#1E293B]">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Inbox className="h-4 w-4 text-[#22D3EE]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#22D3EE]">Submission Pipeline</span>
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-[#F1F5F9] dark:text-[#F1F5F9] italic">Submission <span className="text-[#22D3EE] dark:text-[#22D3EE] not-italic">Review</span></h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] dark:text-[#94A3B8]">Review and approve contributor submissions.</p>
                </div>
            </header>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-[#0F172A]/50 border border-[#1E293B] rounded-xl w-fit">
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === f.id
                                ? "bg-[#22D3EE] text-[#020617] shadow-lg shadow-[#22D3EE]/20"
                                : "text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5"
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Submissions Table */}
            <div className="bg-card border border-[#1E293B] rounded-[2rem] overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader className="bg-[#0F172A]/50">
                        <TableRow className="border-b border-[#1E293B] hover:bg-transparent">
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] h-14 pl-8">Submitter</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] h-14">Title</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] h-14 text-center">Format</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] h-14 text-center">Category</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] h-14 text-center">Date</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] h-14 text-right pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="h-8 w-8 animate-spin text-[#22D3EE]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">Verifying Submissions...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : submissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center text-[#64748B] font-bold uppercase tracking-widest text-[10px] italic">No submissions to review.</TableCell>
                            </TableRow>
                        ) : submissions.map((sub) => (
                            <TableRow key={sub.id} className="group border-b border-[#1E293B] hover:bg-[#020617]/50 transition-colors cursor-default">
                                <TableCell className="pl-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#22D3EE]/20 to-transparent flex items-center justify-center border border-[#22D3EE]/10">
                                            <User className="h-5 w-5 text-[#22D3EE]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase italic tracking-tight text-[#F1F5F9]">{sub.user.name}</p>
                                            <span className="bg-[#22D3EE]/10 text-[#22D3EE] text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-[#22D3EE]/20 mt-1 inline-block">
                                                {sub.user.designation}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm font-bold text-[#F1F5F9] line-clamp-1 max-w-[300px]">{sub.title}</p>
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-tight mt-1.5",
                                        getStatusStyles(sub.status)
                                    )}>
                                        <span className={cn("h-1 w-1 rounded-full", sub.status === 'PENDING' ? 'bg-amber-500 animate-pulse' : 'bg-current')} />
                                        {sub.status.replace('_', ' ')}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">
                                        {FORMAT_LABELS[sub.format] || sub.format}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="bg-white/5 text-[#F1F5F9] text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-white/10">
                                        {sub.category.name}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[11px] font-bold text-[#F1F5F9]">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                        <span className="text-[9px] font-medium text-[#64748B] flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" />
                                            {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <Button
                                        onClick={() => setSelectedSubmission(sub)}
                                        variant="outline"
                                        className="h-9 px-4 rounded-xl border-[#1E293B] hover:bg-white hover:text-black font-black uppercase tracking-widest text-[9px]"
                                    >
                                        <Eye className="mr-2 h-3.5 w-3.5" /> Review
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Review Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#0F172A] border border-[#1E293B] w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-8 border-b border-[#1E293B] bg-[#020617]/30">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-[#22D3EE]/10 flex items-center justify-center border border-[#22D3EE]/20">
                                    <FileText className="h-6 w-6 text-[#22D3EE]" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-tight",
                                            getStatusStyles(selectedSubmission.status)
                                        )}>
                                            {selectedSubmission.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">Node Review</span>
                                    </div>
                                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-[#F1F5F9]">
                                        {selectedSubmission.title}
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={() => { setSelectedSubmission(null); setShowRejectInput(false); setRejectNote(""); }}
                                className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-white/5 text-[#64748B] transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-12">
                            {/* Author Card Info */}
                            <div className="bg-[#020617]/50 border border-[#1E293B] rounded-3xl p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">Contributor</label>
                                    <p className="text-sm font-black uppercase italic text-[#F1F5F9]">{selectedSubmission.user.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">Designation</label>
                                    <p className="text-xs font-bold text-[#22D3EE]">{selectedSubmission.user.designation}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">Affiliation</label>
                                    <p className="text-xs font-bold text-[#F1F5F9]">{selectedSubmission.user.affiliation || "Independent"}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">Email Registry</label>
                                    <p className="text-xs font-mono text-[#64748B] lowercase">{selectedSubmission.user.email}</p>
                                </div>
                            </div>

                            {/* Brief Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#22D3EE] flex items-center gap-2">
                                        <AlertCircle className="h-3.5 w-3.5" /> Executive Summary
                                    </h3>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-xs font-medium leading-relaxed text-[#CBD5E1] italic">
                                        {selectedSubmission.summary}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#22D3EE] flex items-center gap-2">
                                        <Layers className="h-3.5 w-3.5" /> Metadata Attributes
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <label className="text-[8px] font-black uppercase tracking-widest text-[#64748B] block mb-1">Format</label>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9]">
                                                {FORMAT_LABELS[selectedSubmission.format]}
                                            </span>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <label className="text-[8px] font-black uppercase tracking-widest text-[#64748B] block mb-1">Topic</label>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9]">
                                                {selectedSubmission.category.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#22D3EE] flex items-center gap-2">
                                    <FileText className="h-3.5 w-3.5" /> Full Analysis Documentation
                                </h3>
                                <div className="p-10 bg-white/5 rounded-[2rem] border border-white/10 text-sm font-medium leading-[1.8] text-[#F1F5F9] whitespace-pre-wrap font-serif">
                                    {selectedSubmission.content}
                                </div>
                            </div>

                            {/* Source Links */}
                            {selectedSubmission.sourceUrls && selectedSubmission.sourceUrls.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#22D3EE] flex items-center gap-2">
                                        <LinkIcon className="h-3.5 w-3.5" /> Verification Sources
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedSubmission.sourceUrls.map((url: string, i: number) => (
                                            <a
                                                key={i}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-white/5 hover:bg-[#22D3EE]/10 rounded-xl border border-white/10 transition-all text-[10px] font-bold text-[#F1F5F9] flex items-center gap-2"
                                            >
                                                Source {i + 1}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Rejection Section */}
                            {showRejectInput && (
                                <div className="space-y-4 pt-12 border-t border-[#1E293B] animate-in slide-in-from-top duration-500">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" /> Rejection Rationale (Required)
                                    </h3>
                                    <textarea
                                        value={rejectNote}
                                        onChange={(e) => setRejectNote(e.target.value)}
                                        placeholder="Specifically describe why this submission is being rejected..."
                                        className="w-full min-h-[150px] bg-[#020617] border border-rose-500/30 rounded-2xl p-6 text-sm text-[#F1F5F9] focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-[#475569]"
                                    />
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            onClick={() => setShowRejectInput(false)}
                                            variant="ghost"
                                            className="font-black uppercase tracking-widest text-[9px] hover:bg-white/5"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => handleReview('reject')}
                                            disabled={reviewing || !rejectNote}
                                            className="h-10 px-8 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-600/20"
                                        >
                                            {reviewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                                            Purge Submission
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer (Actions) */}
                        {!showRejectInput && (
                            <div className="p-8 border-t border-[#1E293B] bg-[#020617]/30 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="hidden md:flex flex-col">
                                    <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">Protocol Action Required</span>
                                    <span className="text-[9px] font-bold text-[#475569] uppercase italic">Awaiting administrative finality...</span>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-4">
                                    <Button
                                        onClick={() => setShowRejectInput(true)}
                                        disabled={reviewing}
                                        variant="outline"
                                        className="h-12 px-8 rounded-2xl border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all"
                                    >
                                        <X className="mr-2 h-4 w-4" /> Reject Node
                                    </Button>
                                    <Button
                                        onClick={() => handleReview('approve')}
                                        disabled={reviewing}
                                        className="h-12 px-10 rounded-2xl bg-[#0EA5E9] hover:bg-[#38BDF8] text-[#020617] font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-[#0EA5E9]/20"
                                    >
                                        {reviewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                        Approve & Create Draft
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
