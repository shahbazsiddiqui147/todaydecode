import { Shield, FileText, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContributorsPublicPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-[#22D3EE]/30">
            {/* Hero / Header */}
            <div className="relative pt-32 pb-20 px-6 border-b border-[#1E293B] overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0F172A] via-transparent to-transparent opacity-50" />

                <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
                    <div className="flex items-center justify-center gap-3 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <span className="h-px w-10 bg-[#22D3EE]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#22D3EE] italic">Strategic Recruitment</span>
                        <span className="h-px w-10 bg-[#22D3EE]" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Join the <span className="text-[#22D3EE]">Strategic</span> Dialogue
                    </h1>

                    <p className="text-lg md:text-xl text-[#94A3B8] font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-200">
                        Today Decode is expanding its intelligence network. We are seeking academic researchers, defense analysts, and economic strategists to contribute to our global risk assessment framework.
                    </p>
                </div>
            </div>

            {/* Content / Guidelines */}
            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <div className="space-y-6 p-8 rounded-3xl border border-[#1E293B] bg-[#0F172A]/30 group hover:border-[#22D3EE]/50 transition-all">
                        <div className="h-12 w-12 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center border border-[#22D3EE]/20 mb-4 transition-transform group-hover:scale-110">
                            <Shield className="h-6 w-6 text-[#22D3EE]" />
                        </div>
                        <h2 className="text-xl font-black uppercase italic tracking-tight">Institutional Standards</h2>
                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                            Every report submitted undergoes a rigorous review process by the Strategic Oversight Group. We prioritize data-driven analysis and predictive modeling over speculative commentary.
                        </p>
                    </div>

                    <div className="space-y-6 p-8 rounded-3xl border border-[#1E293B] bg-[#0F172A]/30 group hover:border-[#22D3EE]/50 transition-all">
                        <div className="h-12 w-12 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center border border-[#22D3EE]/20 mb-4 transition-transform group-hover:scale-110">
                            <FileText className="h-6 w-6 text-[#22D3EE]" />
                        </div>
                        <h2 className="text-xl font-black uppercase italic tracking-tight">Paper Specifications</h2>
                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                            Submissions should follow the Today Decode Whitepaper format. This includes clear risk scoring (1-100), regional impact assessments, and a minimum of three scenario forecasts.
                        </p>
                    </div>
                </div>

                {/* Main Text Content - Academic Style */}
                <div className="bg-white text-slate-900 p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden mb-20">
                    <div className="absolute top-0 right-0 p-8">
                        <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest rotate-90 origin-right whitespace-nowrap">DOCUMENT_REF: TD_GUIDELINE_V2.1</span>
                    </div>

                    <article className="prose prose-slate max-w-none">
                        <h3 className="text-2xl font-black uppercase italic tracking-tight mb-8 pb-4 border-b-4 border-slate-900 inline-block">Contributor Protocols</h3>

                        <div className="space-y-8 font-medium leading-relaxed">
                            <section className="space-y-4">
                                <h4 className="font-black uppercase text-sm tracking-widest text-[#22D3EE]">01. Intellectual Sovereignty</h4>
                                <p>Analysts retain intellectual credit for their reports but grant Today Decode exclusive distribution rights within our premium intelligence silos. All contributors are vetted for academic and professional credentials prior to authorization.</p>
                            </section>

                            <section className="space-y-4">
                                <h4 className="font-black uppercase text-sm tracking-widest text-[#22D3EE]">02. Data Integrity</h4>
                                <p>Citations must follow the Chicago Manual of Style. We utilize AI-augmented verification for all economic data points and geopolitical claims. Plagiarism or data manipulation results in immediate de-authorization from the platform.</p>
                            </section>

                            <section className="space-y-4">
                                <h4 className="font-black uppercase text-sm tracking-widest text-[#22D3EE]">03. Strategic Tone</h4>
                                <p>Today Decode serves institutional clients. The collective voice of the platform is detached, objective, and forward-looking. We focus on the "Decode"—stripping away noise to reveal the underlying strategic skeleton of global events.</p>
                            </section>
                        </div>
                    </article>
                </div>

                {/* Call to Action */}
                <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#22D3EE]/20 text-center space-y-8 shadow-3xl">
                    <Users className="h-16 w-16 text-[#22D3EE] mx-auto mb-4 animate-pulse" />
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Ready to impact global strategy?</h2>
                        <p className="text-[#94A3B8] max-w-xl mx-auto">Apply for Analyst Status today. Our recruitment window is currently open for regional specialists in MENA and APAC.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/auth/signup/">
                            <Button className="h-16 px-12 rounded-2xl bg-[#22D3EE] text-[#0F172A] font-black uppercase italic tracking-tighter text-lg hover:bg-white transition-all shadow-xl shadow-[#22D3EE]/20">
                                Apply for Analyst Status
                            </Button>
                        </Link>
                        <Button variant="outline" className="h-16 px-12 rounded-2xl border-[#1E293B] bg-transparent text-white font-black uppercase italic tracking-tighter hover:bg-[#1E293B]">
                            Contact Board
                        </Button>
                    </div>

                    <div className="pt-8 flex items-center justify-center gap-6 opacity-30">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Recruitment Active</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-slate-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Global Ingress: Open</span>
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="px-6 py-12 border-t border-[#1E293B] text-center">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#64748B]">Institutional Privacy Framework &copy; 2026 Today Decode</span>
            </div>
        </div>
    );
}
