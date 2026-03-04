import { getPublicAuthorBySlug } from "@/lib/actions/public-actions";
import { constructMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { ShieldCheck, Globe, Twitter, Linkedin, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const author = await getPublicAuthorBySlug(slug);

    if (!author) return constructMetadata({ title: "Analyst Not Found" });

    return constructMetadata({
        title: `${author.name} | Strategic Analyst Profile`,
        description: `Professional strategic manifest for ${author.name}. Role: ${author.role}. Sector Expertise: ${author.expertise.join(", ")}.`,
        path: `/author/${slug}/`,
    });
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const author = await getPublicAuthorBySlug(slug);

    if (!author) notFound();

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Tactical Header Reconstruction */}
            <div className="bg-[#0A0F1E] dark:bg-[#0A0F1E] border-b border-[#1E293B] py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-red/5 to-transparent pointer-events-none" />
                <div className="max-w-screen-2xl mx-auto px-6 relative z-10">
                    <Breadcrumbs items={[
                        { label: 'Home', href: '/' },
                        { label: 'Analysts', href: '#' },
                        { label: author.name.toUpperCase(), href: '#' }
                    ]} />

                    <div className="mt-12 flex flex-col md:flex-row items-center gap-10">
                        <div className="h-40 w-40 rounded-3xl bg-slate-900 border-2 border-[#1E293B] overflow-hidden relative group">
                            {author.image ? (
                                <Image
                                    src={author.image}
                                    alt={author.name}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-3xl font-black bg-slate-800 text-slate-500 uppercase italic">
                                    {(author.name || "A").substring(0, 2)}
                                </div>
                            )}
                            <div className="absolute inset-0 border-[8px] border-black/20 pointer-events-none" />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div className="space-y-2">
                                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-red/10 border border-accent-red/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
                                    <span className="text-[10px] font-black text-accent-red uppercase tracking-[0.2em]">Authorized Research Fellow</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                                    {author.name}
                                </h1>
                                <p className="text-xs font-black text-[#94A3B8] uppercase tracking-[0.4em] italic pl-1">
                                    Strategic Analysis // {author.role}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                                <button className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 rounded-full shadow-xl">
                                    Follow Research Feed
                                </button>
                                <div className="flex gap-2">
                                    {[Twitter, Linkedin, ExternalLink].map((Icon, idx) => (
                                        <button key={idx} className="p-3 bg-slate-900 border border-[#1E293B] rounded-full hover:border-[#F1F5F9] transition-all group">
                                            <Icon className="h-4 w-4 text-slate-400 group-hover:text-white" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-screen-2xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
                <div className="lg:col-span-4 space-y-10">
                    <section className="p-8 rounded-3xl bg-secondary/30 dark:bg-[#111827] border border-border-slate dark:border-[#1E293B] space-y-6 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-red/5 blur-[50px]" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-[#94A3B8] pb-4 border-b border-border/10">Biographical Synopsis</h2>
                        <div className="text-sm text-slate-600 dark:text-[#CBD5E1] leading-relaxed font-medium prose-slate dark:prose-invert">
                            {author.bio || "No biographical documentation available for this research profile."}
                        </div>
                    </section>

                    <section className="p-8 rounded-3xl bg-secondary/30 dark:bg-[#111827] border border-border-slate dark:border-[#1E293B] space-y-6 backdrop-blur-sm">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-[#94A3B8] pb-4 border-b border-border/10">Strategic Specializations</h2>
                        <div className="flex flex-wrap gap-2">
                            {author.expertise?.map((exp: string, i: number) => (
                                <div key={i} className="flex items-center space-x-2 px-4 py-2 bg-slate-900/50 border border-[#1E293B] rounded-xl group hover:border-[#F1F5F9] transition-all">
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent-red" />
                                    <span className="text-[10px] font-black text-slate-400 dark:text-[#94A3B8] uppercase tracking-tight">{exp}</span>
                                </div>
                            )) || "General Assessment"}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-8 space-y-10">
                    <div className="flex items-center justify-between border-b border-border-slate dark:border-[#1E293B] pb-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic">Authorized Research Archive</h2>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-green" />
                                Verified Institutional Dispatches
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span>{author.articles?.length || 0} Reports Found</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        {author.articles && author.articles.length > 0 ? (
                            author.articles.map((article: any) => (
                                <AnalysisCard
                                    key={article.slug}
                                    id={article.id}
                                    title={article.title}
                                    category={article.category.name}
                                    slug={article.slug}
                                    image={article.featuredImage || "/images/intel-1.jpg"}
                                    riskLevel={article.riskLevel}
                                    riskScore={article.riskScore}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-[#1E293B] rounded-[2.5rem]">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                                    Archive Initialized // No Datastreams Found
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
