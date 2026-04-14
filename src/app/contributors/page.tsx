import { 
    GraduationCap, 
    Globe, 
    Newspaper, 
    BookOpen, 
    ChevronRight, 
    Plus,
    UserPlus,
    FileSearch,
    CheckCircle,
    Layout
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContributorCTA } from "@/components/contributors/contributor-cta";

const ROLES = [
    {
        title: "Academics & Researchers",
        description: "University faculty and PhD candidates focusing on international relations, macroeconomics, or regional security studies.",
        icon: GraduationCap
    },
    {
        title: "Policy Analysts",
        description: "Think tank professionals and strategic consultants with deep expertise in specific geopolitical or sectoral domains.",
        icon: Globe
    },
    {
        title: "Journalists",
        description: "Investigative reporters and field journalists providing verifiable intelligence and on-the-ground reporting.",
        icon: Newspaper
    },
    {
        title: "Independent Scholars",
        description: "Subject matter experts and industry veterans with unique insights into emerging technologies or resource markets.",
        icon: BookOpen
    }
];

const FORMATS = [
    { name: "Policy Brief", count: "1200-2500w" },
    { name: "Strategic Report", count: "3000-12000w" },
    { name: "Commentary", count: "800-1200w" },
    { name: "Scenario Analysis", count: "1500-3000w" },
    { name: "Risk Assessment", count: "1200-2000w" },
    { name: "Data Insight", count: "600-1000w" },
    { name: "Annual Outlook", count: "4000-8000w" },
    { name: "Policy Toolkit", count: "1500-3000w" },
    { name: "News Brief", count: "400-800w" },
    { name: "Current Affairs", count: "800-1500w" }
];

const STEPS = [
    { title: "Create Account", description: "Sign up via our contributor portal and complete your professional profile." },
    { title: "Submit Article", description: "Upload your draft using our structured editor, ensuring all citations are provided." },
    { title: "Editorial Review", description: "Our editorial desk reviews submissions for accuracy, evidence, and analytical rigor." },
    { title: "Publication", description: "Approved research is published to our global network and archived for decision-makers." }
];

export default function ContributorsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="py-32 px-6 border-b border-border bg-card/30">
                <div className="max-w-screen-xl mx-auto space-y-8">
                    <div className="space-y-4">
                        <div className="h-1.5 w-24 bg-accent-red" />
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.85]">
                            Contribute to <br />
                            <span className="text-accent-red">Today Decode</span>
                        </h1>
                    </div>
                    <p className="text-2xl md:text-3xl font-medium text-muted-foreground max-w-3xl uppercase tracking-tight leading-tight">
                        We invite researchers, analysts, academics, and journalists to join our network of experts providing high-fidelity geopolitical research.
                    </p>
                </div>
            </header>

            <main className="max-w-screen-xl mx-auto px-6 py-32 space-y-40">
                {/* Why Contribute */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-accent-red italic">01 // The Network</h2>
                        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
                            Why Publish <br /> With Us?
                        </h3>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                            Today Decode provides a premium platform for rigorous analysis. We bridge the gap between academic depth and policy relevance, ensuring your research reaches decision-makers globally while maintaining full author attribution and intellectual integrity.
                        </p>
                    </div>
                    <div className="p-12 bg-card border border-border rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Layout className="h-40 w-40" />
                        </div>
                        <div className="space-y-6 relative z-10">
                            <p className="text-lg font-bold italic uppercase tracking-widest text-[#22D3EE]">Institutional Standards</p>
                            <p className="text-4xl font-black uppercase tracking-tighter leading-tight italic">
                                "Rigorous, Evidence-Based, and Actions-Oriented Research."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Who We Welcome */}
                <section className="space-y-16">
                    <div className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-accent-red italic">02 // Eligibility</h2>
                        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
                            Who We Welcome
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ROLES.map((role) => (
                            <div key={role.title} className="p-10 bg-card border border-border rounded-3xl hover:border-accent-red/50 transition-all group">
                                <role.icon className="h-10 w-10 text-accent-red mb-8 group-hover:scale-110 transition-transform" />
                                <h4 className="text-xl font-black uppercase tracking-tight mb-4 italic">{role.title}</h4>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{role.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Publication Formats */}
                <section className="space-y-16">
                    <div className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-accent-red italic">03 // Standards</h2>
                        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
                            Publication Formats
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {FORMATS.map((format) => (
                            <div key={format.name} className="p-6 bg-secondary/30 border border-border rounded-2xl flex flex-col justify-between hover:bg-secondary/50 transition-colors">
                                <p className="text-sm font-black uppercase tracking-tight italic mb-2">{format.name}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{format.count}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How It Works */}
                <section className="space-y-16">
                    <div className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-accent-red italic">04 // Process</h2>
                        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
                            How It Works
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {STEPS.map((step, idx) => (
                            <div key={step.title} className="space-y-8 relative">
                                <div className="text-6xl font-black text-muted-foreground/10 absolute -top-8 -left-4 select-none italic">
                                    0{idx + 1}
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <h4 className="text-2xl font-black uppercase tracking-tighter italic">{step.title}</h4>
                                    <p className="text-muted-foreground font-medium leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="p-16 md:p-24 bg-card border border-border rounded-[4rem] text-center space-y-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-accent-red/5" />
                    <div className="space-y-6 relative z-10">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                            Ready to <br /> <span className="text-accent-red">Contribute?</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-xl mx-auto font-medium uppercase tracking-tight">
                            Join our global network of analysts and provide high-impact research to our platform.
                        </p>
                    </div>
                    <ContributorCTA />
                </section>
            </main>
        </div>
    );
}
