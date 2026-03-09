import { ShieldAlert, BookOpen, PenTool, Globe, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContributorsPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100">
            {/* Whitepaper Header */}
            <header className="py-24 px-6 md:px-12 lg:px-24 border-b-4 border-[#0F172A] dark:border-[#22D3EE] bg-white dark:bg-[#0B1120]">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center space-x-3 text-accent-red dark:text-[#22D3EE] mb-4">
                        <ShieldAlert className="h-6 w-6" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] font-mono">Institutional Document 001</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-[#0F172A] dark:text-white">
                        Join The <br />
                        <span className="text-accent-red dark:text-[#22D3EE]">Research Network</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-serif text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mt-8 border-l-4 border-slate-300 dark:border-slate-800 pl-6">
                        Today Decode operates a strict Peer-Verified Institutional Network. We invite academics, journalists, and strategic analysts to contribute to our global vulnerability archive.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-4xl mx-auto space-y-24">

                    {/* Section 1 */}
                    <section className="space-y-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter border-b-2 border-slate-200 dark:border-slate-800 pb-4">
                            01 // The Strategic Mandate
                        </h2>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-lg font-serif">
                            <p>
                                To maintain the highest standards of geopolitical intelligence, we have transitioned from an open-access model to a curated network of experts. Every analyst in our system is manually vetted to ensure their insights are grounded in reality, rigorously researched, and institutionally sound.
                            </p>
                            <p>
                                When you join Today Decode, you are joining an intelligence hub that values concrete data over speculation.
                            </p>
                        </div>
                    </section>

                    {/* Roles Grid */}
                    <section className="space-y-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter border-b-2 border-slate-200 dark:border-slate-800 pb-4">
                            02 // Recognized Clearances
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                <BookOpen className="h-8 w-8 text-accent-red dark:text-[#22D3EE] mb-6" />
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Academic Researcher</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-serif">University faculty, post-docs, and PhD candidates focusing on international relations, security, and economics.</p>
                            </div>
                            <div className="p-8 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                <Globe className="h-8 w-8 text-accent-red dark:text-[#22D3EE] mb-6" />
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Strategic Analyst</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-serif">Professionals from think tanks, intelligence agencies, and risk consulting firms with regional expertise.</p>
                            </div>
                            <div className="p-8 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                <PenTool className="h-8 w-8 text-accent-red dark:text-[#22D3EE] mb-6" />
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Accredited Journalist</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-serif">Field reporters and investigative journalists providing on-the-ground intelligence and verified facts.</p>
                            </div>
                            <div className="p-8 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                <ShieldAlert className="h-8 w-8 text-accent-red dark:text-[#22D3EE] mb-6" />
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Industry Professional</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-serif">Industry veterans with deep knowledge of supply chains, energy markets, or emerging technologies.</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="p-12 md:p-16 bg-[#0F172A] dark:bg-[#22D3EE]/10 border-4 border-[#0F172A] dark:border-[#22D3EE] rounded-3xl text-center space-y-8">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white dark:text-[#F1F5F9]">
                            Initiate Clearance Protocol
                        </h2>
                        <p className="text-slate-300 dark:text-slate-400 max-w-xl mx-auto font-serif">
                            Submit your institutional background for review. Applications are processed by the Editorial Desk within 48 hours.
                        </p>
                        <Link href="/auth/signup/" className="inline-block">
                            <Button className="h-14 px-8 bg-white text-[#0F172A] hover:bg-slate-200 dark:bg-[#22D3EE] dark:text-[#0F172A] dark:hover:bg-[#06B6D4] text-xs font-black uppercase tracking-[0.3em] rounded-xl shadow-2xl group transition-all">
                                Request Access
                                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </section>

                </div>
            </main>
        </div>
    );
}
