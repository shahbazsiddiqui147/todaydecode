"use client";

import { useState, useEffect } from "react";
import { saveCountryMetric } from "@/lib/actions/user-actions";
import { getCountryMetric } from "@/lib/actions/public-actions";
import { toast } from "sonner";
import { Globe, Save, Search, Database } from "lucide-react";

const COUNTRIES = [
    { code: "USA", name: "United States" },
    { code: "CHN", name: "China" },
    { code: "RUS", name: "Russia" },
    { code: "GBR", name: "United Kingdom" },
    { code: "FRA", name: "France" },
    { code: "DEU", name: "Germany" },
    { code: "JPN", name: "Japan" },
    { code: "IND", name: "India" },
    { code: "BRA", name: "Brazil" },
    { code: "ZAF", name: "South Africa" },
    { code: "SAU", name: "Saudi Arabia" },
    { code: "EGY", name: "Egypt" },
    { code: "ISR", name: "Israel" },
    { code: "TUR", name: "Turkey" },
    { code: "IRN", name: "Iran" },
    { code: "AUS", name: "Australia" },
    { code: "CAN", name: "Canada" },
];

export default function MapDataPage() {
    const [selectedCode, setSelectedCode] = useState(COUNTRIES[0].code);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        countryName: COUNTRIES[0].name,
        literacy: "",
        economy: "",
        energy: "",
        army: ""
    });

    useEffect(() => {
        const loadMetric = async () => {
            setLoading(true);
            const metric = await getCountryMetric(selectedCode);
            if (metric) {
                setFormData({
                    countryName: metric.countryName,
                    literacy: metric.literacy || "",
                    economy: metric.economy || "",
                    energy: metric.energy || "",
                    army: metric.army || ""
                });
            } else {
                const country = COUNTRIES.find(c => c.code === selectedCode);
                setFormData({
                    countryName: country?.name || "",
                    literacy: "",
                    economy: "",
                    energy: "",
                    army: ""
                });
            }
            setLoading(false);
        };
        loadMetric();
    }, [selectedCode]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await saveCountryMetric({
            countryCode: selectedCode,
            ...formData
        });

        if (res.success) {
            toast.success("Institutional metrics synchronized.");
        } else {
            toast.error(res.error || "System synchronization failure.");
        }
        setSaving(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic text-foreground">
                        Sovereign Map Data
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest mt-1">
                        Manual Metric Injection Layer
                    </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-center">
                    <Database className="h-6 w-6 text-accent-red" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-4">
                    <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            <Search className="h-3 w-3" />
                            Select Sovereign Entity
                        </div>
                        <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                            {COUNTRIES.map(c => (
                                <button
                                    key={c.code}
                                    onClick={() => setSelectedCode(c.code)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedCode === c.code
                                            ? "bg-accent-red text-white shadow-lg"
                                            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{c.name}</span>
                                        <span className="text-[10px] opacity-60 font-black">{c.code}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <form onSubmit={handleSave} className="p-10 rounded-[2.5rem] bg-card border border-border shadow-2xl space-y-8 relative overflow-hidden">
                        {loading && (
                            <div className="absolute inset-0 bg-card/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-red" />
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-secondary rounded-2xl">
                                <Globe className="h-6 w-6 text-accent-red" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight italic">
                                    Strategic Profile: {formData.countryName}
                                </h2>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    Entity ID: {selectedCode} // Authorization Level 4
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest px-1">LITERACY RATE</label>
                                <input
                                    value={formData.literacy}
                                    onChange={e => setFormData({ ...formData, literacy: e.target.value })}
                                    className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-accent-red/20 outline-none"
                                    placeholder="e.g. 98% (Adult Universal)"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest px-1">ECONOMY STATUS</label>
                                <input
                                    value={formData.economy}
                                    onChange={e => setFormData({ ...formData, economy: e.target.value })}
                                    className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-accent-red/20 outline-none"
                                    placeholder="e.g. GDP $2.5T / +1.2% Growth"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest px-1">ENERGY INDEX</label>
                                <input
                                    value={formData.energy}
                                    onChange={e => setFormData({ ...formData, energy: e.target.value })}
                                    className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-accent-red/20 outline-none"
                                    placeholder="e.g. 72% Nuclear / 20% Renewables"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest px-1">ARMY STRENGTH</label>
                                <input
                                    value={formData.army}
                                    onChange={e => setFormData({ ...formData, army: e.target.value })}
                                    className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-accent-red/20 outline-none"
                                    placeholder="e.g. Active: 1.2M / Budget: $80B"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border/10 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                {saving ? "Synchronizing..." : "Inject Metrics"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
