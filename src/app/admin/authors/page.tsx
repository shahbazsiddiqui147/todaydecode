"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    MoreVertical,
    UserPlus
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

interface Author {
    id: string;
    name: string;
    slug: string;
    role: string;
    bio: string;
    image?: string;
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
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const res = await fetch("/api/admin/authors/");
            const data = await res.json();
            setAuthors(data);
        } catch (err) {
            console.error(err);
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
        const url = editingAuthor ? `/api/admin/authors/${editingAuthor.id}/` : "/api/admin/authors/";
        const method = editingAuthor ? "PATCH" : "POST";

        const payload = {
            ...formData,
            slug: formData.slug.endsWith('/') ? formData.slug : formData.slug + '/',
            expertise: formData.expertise.split(",").map(s => s.trim()).filter(Boolean)
        };

        try {
            const res = await fetch(url, {
                method,
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingAuthor(null);
                setFormData({ name: "", slug: "", role: "", bio: "", image: "", expertise: "" });
                fetchAuthors();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This action is irreversible.")) return;
        try {
            await fetch(`/api/admin/authors/${id}/`, { method: "DELETE" });
            fetchAuthors();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Personnel <span className="text-accent-red">Database</span></h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage geopolitical analysts and strategic contributors.</p>
                </div>
                <Button onClick={() => { setEditingAuthor(null); setIsModalOpen(true); }} className="h-12 px-6">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Author
                </Button>
            </header>

            <div className="flex items-center space-x-4 bg-white dark:bg-[#0D1425] p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search manifests..."
                        className="pl-11 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Analyst</TableHead>
                            <TableHead>Designation</TableHead>
                            <TableHead>ID Signature</TableHead>
                            <TableHead>Expertise</TableHead>
                            <TableHead className="text-right">Operations</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-slate-500 italic font-medium">Scanning network for personnel records...</TableCell>
                            </TableRow>
                        ) : filteredAuthors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-slate-500 italic font-medium">No records matching search criteria.</TableCell>
                            </TableRow>
                        ) : filteredAuthors.map((author) => (
                            <TableRow key={author.id} className="group">
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-black uppercase text-accent-red overflow-hidden">
                                            {author.image ? <img src={author.image} alt="" className="h-full w-full object-cover" /> : author.name.charAt(0)}
                                        </div>
                                        <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{author.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs font-bold text-slate-500 uppercase tracking-widest">{author.role}</TableCell>
                                <TableCell className="font-mono text-[10px] text-slate-400">{author.slug}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {author.expertise.map((e, i) => (
                                            <span key={i} className="text-[9px] font-black uppercase tracking-tighter bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded text-slate-500">{e}</span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
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
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" className="h-8 w-8 p-0 text-accent-red hover:text-accent-red hover:bg-accent-red/5" onClick={() => handleDelete(author.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Simple Modal Implementation */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white dark:bg-[#0A0F1E] w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                            <h2 className="text-xl font-black uppercase tracking-tight">
                                {editingAuthor ? "Reconfigure" : "Initialize"} Analyst Profile
                            </h2>
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsModalOpen(false)}>×</Button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Identity</label>
                                    <Input
                                        required
                                        placeholder="e.g. Dr. Elena Vance"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                                slug: editingAuthor ? formData.slug : e.target.value.toLowerCase().replace(/ /g, '-') + '/'
                                            });
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Digital Signature (Slug)</label>
                                    <Input
                                        required
                                        placeholder="e.g. elena-vance/"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Rank / Designation</label>
                                    <Input required placeholder="e.g. Strategic Analyst" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Avatar Uplink (URL)</label>
                                    <Input placeholder="https://..." value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Professional Expertise (Comma Separated)</label>
                                <Input placeholder="e.g. Cyber Security, MENA, Geopolitics" value={formData.expertise} onChange={(e) => setFormData({ ...formData, expertise: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Strategic Bio / Briefing</label>
                                <textarea
                                    required
                                    className="w-full h-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1425] p-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 focus-visible:ring-offset-2 transition-all outline-none"
                                    placeholder="Provide professional background..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Abort</Button>
                                <Button type="submit">Commit Changes</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
