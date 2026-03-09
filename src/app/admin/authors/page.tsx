"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
    Search,
    Edit2,
    Trash2,
    UserPlus,
    MoreVertical,
    ChevronRight,
    ShieldCheck,
    Globe,
    Tag,
    AtSign,
    X,
    Plus,
    Image as ImageIcon,
    FileText
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
    getAdminAuthors,
    upsertAuthor,
    deleteAuthor
} from "@/lib/actions/admin-actions";

interface Author {
    id: string;
    name: string;
    slug: string;
    role: string;
    bio: string;
    image: string | null;
    expertise: string[];
}

export default function AuthorsPage() {
    const { data: session, status } = useSession();
    const [authors, setAuthors] = useState<Author[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        role: "",
        bio: "",
        image: "",
        expertise: ""
    });

    useEffect(() => {
        if (status === "authenticated" && (!session || session.user.role !== "ADMIN")) {
            redirect("/admin/");
        }
    }, [session, status]);

    useEffect(() => {
        if (status === "authenticated" && session?.user.role === "ADMIN") {
            loadAuthors();
        }
    }, [status, session]);

    if (status === "loading") return null;

    const loadAuthors = async () => {
        try {
            setLoading(true);
            const data = await getAdminAuthors();
            setAuthors(data as any);
        } catch (err) {
            toast.error("Failed to connect to personnel node.");
        } finally {
            setLoading(false);
        }
    };

    const filteredAuthors = authors.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            slug: formData.slug,
            role: formData.role,
            bio: formData.bio,
            image: formData.image,
            expertise: formData.expertise.split(",").map(s => s.trim()).filter(Boolean)
        };

        try {
            const res = await upsertAuthor({
                id: editingAuthor?.id,
                ...payload
            });

            if (res.success) {
                toast.success(editingAuthor ? "Personnel record updated." : "New analyst initialized.");
                setIsModalOpen(false);
                setEditingAuthor(null);
                setFormData({ name: "", slug: "", role: "", bio: "", image: "", expertise: "" });
                loadAuthors();
            } else {
                toast.error(res.error || "Server synchronization failed.");
            }
        } catch (err) {
            toast.error("Network interface error.");
        }
    };

    const handleDeleteClick = async (id: string) => {
        if (!confirm("Confirm Record Termination? This action is irreversible.")) return;
        try {
            const res = await deleteAuthor(id);
            if (res.success) {
                toast.success("Personnel record purged.");
                loadAuthors();
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
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic pb-1">
                        <span className="text-[#22D3EE]">Analyst</span> <span className="text-[#F1F5F9]">Roster</span>
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] dark:text-[#94A3B8]">Managing institutional advisor profiles and strategic expertise.</p>
                </div>
                <Button onClick={() => { setEditingAuthor(null); setFormData({ name: "", slug: "", role: "", bio: "", image: "", expertise: "" }); setIsModalOpen(true); }} className="h-11 rounded-xl font-black uppercase tracking-widest text-[10px] px-8 shadow-xl bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] border-none hover:bg-black dark:hover:bg-white/90">
                    <UserPlus className="mr-2 h-4 w-4" /> Authorize Analyst
                </Button>
            </header>

            <div className="flex items-center space-x-4 bg-[#020617] p-3 rounded-2xl border border-[#1E293B] shadow-sm relative overflow-hidden group focus-within:ring-2 focus-within:ring-[#22D3EE] transition-all">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#1E293B] group-focus-within:bg-[#22D3EE] transition-all" />
                <div className="relative flex-1 flex items-center pl-6">
                    <Search className="h-4 w-4 text-[#475569] mr-4" />
                    <input
                        placeholder="Search analysts by name or designation..."
                        className="w-full bg-transparent border-none outline-none text-sm font-bold placeholder:text-[#475569] text-[#F1F5F9]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card border border-[#1E293B] rounded-3xl overflow-hidden shadow-sm shadow-black/5 dark:shadow-none transition-colors">
                <Table className="border-collapse">
                    <TableHeader className="bg-slate-50 dark:bg-white/5">
                        <TableRow className="border-b border-[#1E293B] hover:bg-transparent">
                            <TableHead className="w-16 text-center text-[#94A3B8] font-black uppercase text-[10px] tracking-widest py-4">Access</TableHead>
                            <TableHead className="py-5 pl-8 text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Analyst Designation</TableHead>
                            <TableHead className="text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Institutional Rank</TableHead>
                            <TableHead className="text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Strategic Silos</TableHead>
                            <TableHead className="text-right pr-8 text-[#94A3B8] font-black uppercase text-[10px] tracking-widest">Operations</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="h-8 w-8 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">Scanning Analyst Roster...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredAuthors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center text-[#64748B] font-bold uppercase tracking-widest text-[10px] italic">No analysts found in current roster.</TableCell>
                            </TableRow>
                        ) : filteredAuthors.map((author) => (
                            <TableRow key={author.id} className="group border-b border-[#1E293B] hover:bg-[#020617]/50 transition-colors">
                                <TableCell className="text-center">
                                    <ShieldCheck className="h-4 w-4 mx-auto text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                </TableCell>
                                <TableCell className="pl-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                                            {author.image ? <img src={author.image} alt="" className="h-full w-full object-cover" /> : <span className="text-white font-black italic uppercase text-xs">{(author.name || "A").charAt(0)}</span>}
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-black text-[#F1F5F9] uppercase tracking-tight">{author.name}</div>
                                            <div className="text-[10px] font-mono text-[#94A3B8]/60 lowercase">{author.slug}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-[11px] font-black text-[#94A3B8] uppercase tracking-widest px-3 py-1 rounded-lg bg-[#020617]/50 border border-[#1E293B]">{author.role}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                                        {author.expertise.slice(0, 3).map((e, i) => (
                                            <span key={i} className="text-[9px] font-black uppercase text-[#94A3B8]/60 flex items-center">
                                                <Tag className="h-2 w-2 mr-1" /> {e}
                                            </span>
                                        ))}
                                        {author.expertise.length > 3 && <span className="text-[9px] font-black text-[#94A3B8]/40">+{author.expertise.length - 3} More</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="outline"
                                            className="h-8 rounded-lg border-border hover:bg-secondary"
                                            onClick={() => {
                                                setEditingAuthor(author);
                                                setFormData({
                                                    name: author.name,
                                                    slug: author.slug,
                                                    role: author.role,
                                                    bio: author.bio,
                                                    image: author.image || "",
                                                    expertise: author.expertise.join(", ")
                                                });
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            <Edit2 className="h-3 w-3 mr-2" /> <span className="text-[10px] uppercase font-black">Configure</span>
                                        </Button>
                                        <Button variant="destructive" className="h-8 w-8 p-0 rounded-lg shadow-lg shadow-destructive/20" onClick={() => handleDeleteClick(author.id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </ Table>
            </div>

            {/* Professional Multi-Column Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-[#020617] w-full max-w-3xl rounded-[2.5rem] border border-[#1E293B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 border-b border-[#1E293B] flex justify-between items-center bg-[#020617]/50">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-[#F1F5F9]">
                                    {editingAuthor ? "Finalize Analyst Profile" : "Authorize Analyst"}
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Level 4 Access Required</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 border border-[#1E293B] rounded-xl hover:bg-[#111827] text-[#94A3B8] transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto bg-[#020617]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] flex items-center">
                                        <AtSign className="h-3 w-3 mr-2 text-cyan-500" /> Analyst Name
                                    </label>
                                    <Input
                                        required
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                        placeholder="e.g. Elena Vance"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                                slug: editingAuthor ? formData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') + '/'
                                            });
                                        }}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] flex items-center">
                                        <Globe className="h-3 w-3 mr-2 text-cyan-500" /> Digital Handshake (Slug)
                                    </label>
                                    <Input
                                        required
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold font-mono placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                        placeholder="elena-vance/"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] flex items-center">
                                        <Plus className="h-3 w-3 mr-2 rotate-45 text-cyan-500" /> Rank / Designation
                                    </label>
                                    <Input
                                        required
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                        placeholder="e.g. Lead Analyst"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] flex items-center">
                                        <ImageIcon className="h-3 w-3 mr-2 text-cyan-500" /> Analyst Portrait (URL)
                                    </label>
                                    <Input
                                        className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                        placeholder="https://..."
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] flex items-center">
                                    <Tag className="h-3 w-3 mr-2 text-cyan-500" /> Sector Expertise (Comma Separated)
                                </label>
                                <Input
                                    className="h-12 rounded-xl bg-[#020617] border-[#1E293B] text-[#F1F5F9] text-sm font-bold placeholder:text-[#475569] focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all"
                                    placeholder="e.g. Cyber, MENA, Defense"
                                    value={formData.expertise}
                                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] flex items-center">
                                    <FileText className="h-3 w-3 mr-2 text-cyan-500" /> Institutional Bio
                                </label>
                                <textarea
                                    required
                                    className="w-full h-40 rounded-2xl border border-[#1E293B] bg-[#020617] p-6 text-sm font-bold text-[#F1F5F9] placeholder:text-[#475569] focus-visible:outline-none focus:ring-2 focus:ring-[#22D3EE] transition-all outline-none resize-none leading-relaxed shadow-sm"
                                    placeholder="Document the professional capabilities and strategic background..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            <div className="pt-10 flex justify-end space-x-4">
                                <Button type="button" variant="ghost" className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5" onClick={() => setIsModalOpen(false)}>Cancel Action</Button>
                                <Button type="submit" className="h-12 px-10 rounded-xl bg-white text-[#020617] font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-white/90">Confirm Authorization</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
