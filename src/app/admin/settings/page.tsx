"use client";

import { useState, useEffect } from "react";
import {
    Settings as SettingsIcon,
    Save,
    Globe,
    Shield,
    Share2,
    Image as ImageIcon,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getSiteSettings, upsertSiteSettings } from "@/lib/actions/admin-actions";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        siteName: "",
        logoUrl: "",
        faviconUrl: "",
        socialLinks: {
            x: "",
            linkedin: "",
            facebook: ""
        },
        maintenanceMode: false
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await getSiteSettings();
            setFormData({
                siteName: data.siteName,
                logoUrl: data.logoUrl || "",
                faviconUrl: data.faviconUrl || "",
                socialLinks: (data.socialLinks as any) || { x: "", linkedin: "", facebook: "" },
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
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-[#0891B2] dark:text-[#22D3EE] italic pb-1">Platform <span className="text-[#0F172A] dark:text-[#F1F5F9] not-italic">Parameters</span></h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] dark:text-[#94A3B8]">Configure global institutional sovereignty settings.</p>
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
                    <div className="bg-card border border-[#1E293B] p-10 rounded-[2.5rem] shadow-sm space-y-10">
                        <div className="flex items-center gap-4 border-b border-[#1E293B] pb-6">
                            <ImageIcon className="h-5 w-5 text-[#22D3EE]" />
                            <h2 className="text-xs font-black uppercase tracking-widest italic text-foreground">Visual Identity Nodes</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Institutional Name</label>
                                <Input
                                    value={formData.siteName}
                                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                    className="h-14 font-black uppercase tracking-tight bg-white dark:bg-[#020617] border-[#1E293B] rounded-2xl focus:ring-[#22D3EE]"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Primary Logo URL</label>
                                <Input
                                    value={formData.logoUrl}
                                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                    className="h-14 font-mono text-xs bg-white dark:bg-[#020617] border-[#1E293B] rounded-2xl focus:ring-[#22D3EE]"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Favicon Protocol URL</label>
                            <Input
                                value={formData.faviconUrl}
                                onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                                className="h-14 font-mono text-xs bg-white dark:bg-[#020617] border-[#1E293B] rounded-2xl focus:ring-[#22D3EE]"
                            />
                        </div>
                    </div>

                    <div className="bg-card border border-[#1E293B] p-10 rounded-[2.5rem] shadow-sm space-y-10">
                        <div className="flex items-center gap-4 border-b border-[#1E293B] pb-6">
                            <Share2 className="h-5 w-5 text-[#22D3EE]" />
                            <h2 className="text-xs font-black uppercase tracking-widest italic text-foreground">Strategic Linkages</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">X (Twitter) Terminal</label>
                                <Input
                                    value={formData.socialLinks.x}
                                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, x: e.target.value } })}
                                    className="h-14 font-mono text-xs bg-white dark:bg-[#020617] border-[#1E293B] rounded-2xl focus:ring-[#22D3EE]"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">LinkedIn Dossier</label>
                                <Input
                                    value={formData.socialLinks.linkedin}
                                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                                    className="h-14 font-mono text-xs bg-white dark:bg-[#020617] border-[#1E293B] rounded-2xl focus:ring-[#22D3EE]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status & Protocol */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#111827] border border-[#1E293B] p-8 rounded-[2rem] shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-[#1E293B] pb-6">
                            <Globe className="h-4 w-4 text-[#22D3EE]" />
                            <h2 className="text-xs font-black uppercase tracking-widest italic text-[#F1F5F9]">Interface State</h2>
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
                                <span className="uppercase tracking-widest italic">Aesthetic Protocol</span>
                            </div>
                            <p>// Trailing Slash Enforcement: <span className="text-[#22D3EE]">ACTIVE</span></p>
                            <p>// Institutional Border Hardening: <span className="text-[#22D3EE]">ACTIVE</span></p>
                            <p>// Dark Mode Persistence: <span className="text-[#22D3EE]">FORCED</span></p>
                        </div>
                    </div>

                    <div className="p-10 border border-[#1E293B] rounded-[2rem] bg-card flex flex-col items-center justify-center text-center space-y-4">
                        <SettingsIcon className="h-12 w-12 text-muted-foreground opacity-20" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">System Standby</p>
                            <p className="text-[9px] text-muted-foreground/40 font-mono">Verifying institutional sovereignty...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
