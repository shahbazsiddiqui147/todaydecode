"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
    Settings as SettingsIcon,
    Save,
    Globe,
    Shield,
    Share2,
    ImageIcon,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getSiteSettings, upsertSiteSettings } from "@/lib/actions/admin-actions";
import { UploadNode } from "@/components/admin/UploadNode";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { data: session, status: authStatus } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        siteName: "",
        logoUrl: "",
        faviconUrl: "",
        socialLinks: {
            x: { url: "", enabled: true },
            linkedin: { url: "", enabled: true },
            facebook: { url: "", enabled: true },
            pinterest: { url: "", enabled: true },
            instagram: { url: "", enabled: true }
        } as Record<string, { url: string; enabled: boolean }>,
        maintenanceMode: false
    });

    useEffect(() => {
        if (authStatus === "authenticated" && session?.user?.role !== "ADMIN") {
            redirect("/admin/");
        }
        loadSettings();
    }, [session, authStatus]);

    const loadSettings = async () => {
        try {
            const data = await getSiteSettings();

            // Normalize social links to handle legacy strings or missing keys
            const rawLinks = (data.socialLinks as any) || {};
            const normalizedLinks: Record<string, { url: string; enabled: boolean }> = {
                x: { url: "", enabled: true },
                linkedin: { url: "", enabled: true },
                facebook: { url: "", enabled: true },
                pinterest: { url: "", enabled: true },
                instagram: { url: "", enabled: true }
            };

            Object.keys(normalizedLinks).forEach(key => {
                const val = rawLinks[key];
                if (typeof val === 'string') {
                    normalizedLinks[key] = { url: val, enabled: true };
                } else if (val && typeof val === 'object') {
                    normalizedLinks[key] = {
                        url: val.url || "",
                        enabled: typeof val.enabled === 'boolean' ? val.enabled : true
                    };
                }
            });

            setFormData({
                siteName: data.siteName,
                logoUrl: data.logoUrl || "",
                faviconUrl: data.faviconUrl || "",
                socialLinks: normalizedLinks,
                maintenanceMode: data.maintenanceMode
            });
        } catch (err) {
            toast.error("Archive interface failure.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await upsertSiteSettings(formData);
            if (res.success) {
                toast.success("Global parameters finalized.");
            } else {
                toast.error(res.error || "Uplink rejected.");
            }
        } catch (err) {
            toast.error("Network synchronization error.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1E293B] dark:border-[#1E293B]">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-[#22D3EE] dark:text-[#22D3EE] italic pb-1">Platform <span className="text-[#F1F5F9] dark:text-[#F1F5F9] not-italic">Parameters</span></h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8] dark:text-[#94A3B8]">Configure global institutional advisory settings.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-11 rounded-xl font-black uppercase tracking-widest text-[11px] px-8 shadow-xl bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] hover:bg-black dark:hover:bg-white/90"
                >
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Commit Changes
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Identity & Aesthetics */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-[#020617] border border-[#1E293B] p-10 rounded-[2.5rem] shadow-2xl space-y-10">
                        <div className="flex items-center gap-4 border-b border-[#1E293B] pb-6">
                            <ImageIcon className="h-5 w-5 text-[#22D3EE]" />
                            <h2 className="text-xs font-black uppercase tracking-widest italic text-foreground">Visual Identity Nodes</h2>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] dark:text-[#94A3B8] pl-1">Institutional Name</label>
                                <Input
                                    value={formData.siteName}
                                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                    className="h-14 font-black uppercase tracking-tight bg-[#020617] text-[#F1F5F9] border-[#1E293B] rounded-2xl focus:ring-[#22D3EE] focus:border-[#22D3EE]"
                                />
                            </div>

                            <div className="space-y-6">
                                <UploadNode
                                    label="Primary Logo Asset"
                                    currentUrl={formData.logoUrl}
                                    onUploadComplete={(url: string) => setFormData({ ...formData, logoUrl: url })}
                                />
                            </div>

                            <UploadNode
                                label="Favicon Framework Asset"
                                currentUrl={formData.faviconUrl}
                                onUploadComplete={(url: string) => setFormData({ ...formData, faviconUrl: url })}
                            />
                        </div>
                    </div>

                    <div className="bg-[#020617] border border-[#1E293B] p-10 rounded-[2.5rem] shadow-2xl space-y-10">
                        <div className="flex items-center gap-4 border-b border-[#1E293B] pb-6">
                            <Share2 className="h-5 w-5 text-[#22D3EE]" />
                            <h2 className="text-xs font-black uppercase tracking-widest italic text-foreground">Social Media Links</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { id: "x", label: "X (Twitter) Terminal", placeholder: "https://x.com/username" },
                                { id: "linkedin", label: "LinkedIn Dossier", placeholder: "https://linkedin.com/in/username" },
                                { id: "facebook", label: "Facebook Node", placeholder: "https://facebook.com/username" },
                                { id: "instagram", label: "Instagram Node", placeholder: "https://instagram.com/username" },
                                { id: "pinterest", label: "Pinterest Node", placeholder: "https://pinterest.com/username" },
                            ].map((platform) => (
                                <div key={platform.id} className="space-y-4 p-6 rounded-3xl bg-[#020617]/50 border border-[#1E293B] transition-all hover:border-[#22D3EE]/30 group">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pl-1">{platform.label}</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({
                                                ...formData,
                                                socialLinks: {
                                                    ...formData.socialLinks,
                                                    [platform.id]: {
                                                        ...formData.socialLinks[platform.id],
                                                        enabled: !formData.socialLinks[platform.id].enabled
                                                    }
                                                }
                                            })}
                                            className={cn(
                                                "h-5 w-9 rounded-full p-1 transition-colors duration-200",
                                                formData.socialLinks[platform.id].enabled ? 'bg-[#22D3EE]' : 'bg-slate-700'
                                            )}
                                        >
                                            <div className={cn(
                                                "h-3 w-3 rounded-full bg-white transition-transform duration-200",
                                                formData.socialLinks[platform.id].enabled ? 'translate-x-4' : 'translate-x-0'
                                            )} />
                                        </button>
                                    </div>
                                    <Input
                                        value={formData.socialLinks[platform.id].url}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socialLinks: {
                                                ...formData.socialLinks,
                                                [platform.id]: {
                                                    ...formData.socialLinks[platform.id],
                                                    url: e.target.value
                                                }
                                            }
                                        })}
                                        placeholder={platform.placeholder}
                                        className="h-12 font-mono text-[10px] bg-[#020617] text-[#F1F5F9] border-[#1E293B] rounded-xl focus:ring-[#22D3EE] focus:border-[#22D3EE] opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status & Framework */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#020617] border border-[#1E293B] p-8 rounded-[2rem] shadow-2xl space-y-8">
                        <div className="flex items-center gap-3 border-b border-[#1E293B] pb-6">
                            <Globe className="h-4 w-4 text-[#22D3EE]" />
                            <h2 className="text-xs font-black uppercase tracking-widest italic text-[#F1F5F9] font-medium">Interface State</h2>
                        </div>

                        <button
                            className="w-full flex items-center justify-between p-6 rounded-2xl border border-[#1E293B] bg-slate-900/50 cursor-pointer group transition-all hover:bg-slate-900"
                            onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
                        >
                            <div className="text-left space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white">Maintenance Mode</p>
                                <p className="text-[9px] text-muted-foreground/60 uppercase">Restrict public ingress</p>
                            </div>
                            <div className={`h-6 w-11 rounded-full p-1 transition-colors duration-200 ${formData.maintenanceMode ? 'bg-[#22D3EE]' : 'bg-slate-700'}`}>
                                <div className={`h-4 w-4 rounded-full bg-white transition-transform duration-200 ${formData.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                        </button>

                        <div className="p-6 border-2 border-dashed border-[#1E293B] rounded-2xl bg-muted/5 font-mono text-[9px] text-muted-foreground/60 space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-3.5 w-3.5 opacity-40" />
                                <span className="uppercase tracking-widest italic">Aesthetic Framework</span>
                            </div>
                            <p>// Trailing Slash Enforcement: <span className="text-[#22D3EE]">ACTIVE</span></p>
                            <p>// Institutional Border Hardening: <span className="text-[#22D3EE]">ACTIVE</span></p>
                            <p>// Dark Mode Persistence: <span className="text-[#22D3EE]">FORCED</span></p>
                        </div>
                    </div>

                    <div className="p-10 border border-[#1E293B] rounded-[2rem] bg-[#020617] flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
                        <SettingsIcon className="h-12 w-12 text-[#64748B] opacity-20" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748B] italic">System Standby</p>
                            <p className="text-[9px] text-[#64748B]/40 font-mono">Verifying institutional framework...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
