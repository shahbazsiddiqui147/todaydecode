"use client";

import { useState, useEffect } from "react";
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
        loadAuthors();
    }, []);

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
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Personnel <span className="text-slate-400 font-medium">Database</span></h1>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Managing analyst credentials and intelligence profiles.</p>
                </div>
                <Button onClick={() => { setEditingAuthor(null); setFormData({ name: "", slug: "", role: "", bio: "", image: "", expertise: "" }); setIsModalOpen(true); }} className="h-11 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 font-black uppercase tracking-widest text-[11px] px-6">
                    <UserPlus className="mr-2 h-4 w-4" /> Initialize Analyst
                </Button>
            </header>

            <div className="flex items-center space-x-4 bg-white dark:bg-[#0D1425] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 dark:bg-slate-800 group-focus-within:bg-slate-900 dark:group-focus-within:bg-white transition-all" />
                <div className="relative flex-1 flex items-center pl-6">
                    <Search className="h-4 w-4 text-slate-300 dark:text-slate-600 mr-4" />
                    <input
                        placeholder="Search manifests by name or designation..."
                        className="w-full bg-transparent border-none outline-none text-sm font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm shadow-slate-100 dark:shadow-none">
                <Table className="border-collapse">
                    <TableHeader className="bg-slate-50 dark:bg-white/5">
                        <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
                            <TableHead className="w-16 text-center">Protocol</TableHead>
                            <TableHead className="py-5 pl-8">Full Identity</TableHead>
                            <TableHead>Designation</TableHead>
                            <TableHead>Expertise Nodes</TableHead>
                            <TableHead className="text-right pr-8">Operations</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="h-8 w-8 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-slate-900 dark:border-t-white animate-spin"></div>
                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Scanning Manifests...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredAuthors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center text-slate-400 font-bold uppercase tracking-widest text-[11px] italic">No personnel found in current sector.</TableCell>
                            </TableRow>
                        ) : filteredAuthors.map((author) => (
                            <TableRow key={author.id} className="group border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <TableCell className="text-center">
                                    <ShieldCheck className="h-4 w-4 mx-auto text-slate-200 dark:text-slate-800 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                                </TableCell>
                                <TableCell className="pl-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                                            {author.image ? <img src={author.image} alt="" className="h-full w-full object-cover" /> : <span className="text-white font-black italic uppercase text-xs">{(author.name || "A").charAt(0)}</span>}
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{author.name}</div>
                                            <div className="text-[10px] font-mono text-slate-400 lowercase">{author.slug}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-slate-800">{author.role}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                                        {author.expertise.slice(0, 3).map((e, i) => (
                                            <span key={i} className="text-[9px] font-black uppercase text-slate-400 flex items-center">
                                                <Tag className="h-2 w-2 mr-1" /> {e}
                                            </span>
                                        ))}
                                        {author.expertise.length > 3 && <span className="text-[9px] font-black text-slate-300">+{author.expertise.length - 3} More</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="outline"
                                            className="h-8 rounded-lg border-slate-200 dark:border-slate-800 hover:bg-white"
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
                                        <Button variant="danger" className="h-8 w-8 p-0 rounded-lg" onClick={() => handleDeleteClick(author.id)}>
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
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white dark:bg-[#0D1425] w-full max-w-3xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-white/5">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                                    {editingAuthor ? "Reconfigure Analysis Node" : "Initialize New Personnel"}
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section 4 Authorization Required</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-white transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto bg-white dark:bg-[#0D1425]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                                        <AtSign className="h-3 w-3 mr-2" /> Full Identity
                                    </label>
                                    <Input
                                        required
                                        className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-sm font-bold placeholder:font-normal"
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
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                                        <Globe className="h-3 w-3 mr-2" /> Digital Handshake (Slug)
                                    </label>
                                    <Input
                                        required
                                        className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-sm font-bold font-mono"
                                        placeholder="elena-vance/"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                                        <Plus className="h-3 w-3 mr-2 rotate-45" /> Rank / Designation
                                    </label>
                                    <Input
                                        required
                                        className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-sm font-bold"
                                        placeholder="e.g. Lead Analyst"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                                        <ImageIcon className="h-3 w-3 mr-2" /> Personnel Photo (URL)
                                    </label>
                                    <Input
                                        className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-sm font-bold"
                                        placeholder="https://..."
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                                    <Tag className="h-3 w-3 mr-2" /> Sector Expertise (Comma Separated)
                                </label>
                                <Input
                                    className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-sm font-bold"
                                    placeholder="e.g. Cyber, MENA, Defense"
                                    value={formData.expertise}
                                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                                    <FileText className="h-3 w-3 mr-2" /> Operational Bio
                                </label>
                                <textarea
                                    required
                                    className="w-full h-40 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 p-6 text-sm font-medium focus-visible:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all outline-none resize-none placeholder:font-normal leading-relaxed"
                                    placeholder="Document the professional capabilities and strategic background..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            <div className="pt-10 flex justify-end space-x-4">
                                <Button type="button" variant="ghost" className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px]" onClick={() => setIsModalOpen(false)}>Abort Change</Button>
                                <Button type="submit" className="h-12 px-10 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 font-black uppercase tracking-widest text-[10px] shadow-xl">Commit Manifest</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
