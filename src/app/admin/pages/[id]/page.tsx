"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    getAdminPageById,
    upsertPage
} from "@/lib/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/ui/rich-text-editor";
import {
    Save,
    ChevronLeft,

    FileText,
    Globe,
    RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function PageEditor() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(id !== "new");

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        metaTitle: "",
        metaDescription: ""
    });

    useEffect(() => {
        if (id !== "new") {
            loadPage();
        }
    }, [id]);

    const loadPage = async () => {
        try {
            setPageLoading(true);
            const res = await getAdminPageById(id as string);
            if (res) {
                setFormData({
                    title: res.title,
                    slug: res.slug,
                    content: res.content,
                    metaTitle: res.metaTitle || "",
                    metaDescription: res.metaDescription || ""
                });
            } else {
                toast.error("Page not found.");
                router.push("/admin/pages/");
            }
        } catch (err) {
            toast.error("Failed to load page.");
        } finally {
            setPageLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const promise = upsertPage({
            id: id === "new" ? undefined : (id as string),
            ...formData
        });

        toast.promise(promise, {
            loading: "Saving page...",
            success: (res) => {
                if (res.success) {
                    router.push("/admin/pages/");
                    router.refresh();
                    return "Page saved.";
                }
                throw new Error(res.error || "Save failed.");
            },
            error: (err) => err.message || "An error occurred.",
        });

        try {
            await promise;
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E293B] dark:border-[#1E293B]">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages/">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg">
                                Static Page
                            </span>
                        </div>
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                            {formData.title || "New Page"}
                        </h1>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="h-10 px-8 rounded-xl font-black uppercase italic tracking-tighter shadow-lg shadow-primary/20 bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] hover:bg-black dark:hover:bg-white/90"
                >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Page
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-card border border-[#1E293B] p-8 rounded-[2rem] shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Page Title</label>
                            <Input
                                value={formData.title}
                                placeholder="Enter page title..."
                                onChange={(e) => {
                                    const newTitle = e.target.value;
                                    setFormData({
                                        ...formData,
                                        title: newTitle,
                                        slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                                    });
                                }}
                                className="text-2xl font-black h-16 bg-white dark:bg-[#020617] border-[#CBD5E1] dark:border-[#1E293B] uppercase tracking-tight italic"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">URL Slug</label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="about-us"
                                className="h-12 font-mono text-xs bg-muted/30 border-border"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Page Content</label>
                            <RichTextEditor 
                                content={formData.content} 
                                onChange={(html) => setFormData({ ...formData, content: html })} 
                                placeholder="Start writing page content..." 
                                minHeight="500px" 
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                    <div className="bg-[#111827] border border-[#1E293B] rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b border-[#1E293B] pb-4">
                            <Globe className="h-4 w-4 text-cyan-400" />
                            <h2 className="text-[11px] font-black uppercase tracking-widest italic text-white">SEO Settings</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">Meta Title</label>
                                <Input
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    placeholder="Custom search engine title"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">SEO Description</label>
                                <Textarea
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    placeholder="Custom search engine description"
                                    className="bg-[#020617] border-[#1E293B] min-h-[120px] text-[11px] font-black uppercase text-[#F1F5F9] resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-2 border-dashed border-[#1E293B] rounded-3xl bg-muted/5 font-mono text-[9px] text-muted-foreground/60 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-3.5 w-3.5 opacity-40" />
                            <span className="uppercase tracking-widest italic">Page Info</span>
                        </div>
                        <p>Status: <span className="text-foreground">Published</span></p>
                        <p>Visibility: <span className="text-foreground">Public</span></p>
                    </div>
                </div>
            </div>
        </form>
    );
}
