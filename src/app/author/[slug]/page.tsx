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
        <div className="min-h-screen bg-primary pb-20">
            {/* Tactical Header */}
            <div className="bg-secondary/40 border-b border-border-slate py-12">
                <div className="max-w-7xl mx-auto px-8">
                    <Breadcrumbs items={[
                        { label: 'Home', href: '/' },
                        { label: 'Personnel', href: '#' },
                        { label: author.name, href: `/author/${author.slug}/` }
                    ]} />

                    <div className="mt-10 flex flex-col md:flex-row items-start gap-10">
                        <div className="relative h-40 w-40 rounded-3xl bg-slate-800 border-2 border-border-slate overflow-hidden shrink-0 shadow-2xl">
                            {author.image ? (
                                <Image src={author.image} alt={author.name} fill className="object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-5xl font-black italic text-slate-700 uppercase">
                                    {(author.name || "A").charAt(0)}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="flex items-center space-x-1.5 px-3 py-1 bg-accent-red/10 border border-accent-red/20 rounded-full text-[10px] font-black text-accent-red uppercase tracking-widest">
                                        <ShieldCheck className="h-3 w-3" />
                                        <span>Verified Analyst</span>
                                    </span>
                                    {author.expertise.slice(0, 2).map((exp: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-slate-900 border border-border-slate rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                            {exp}
                                        </span>
                                    ))}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                                    {author.name}
                                </h1>
                                <p className="text-lg text-slate-400 font-bold uppercase tracking-widest italic">{author.role}</p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <button className="flex items-center space-x-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors shadow-xl">
                                    <span>Follow Research Feed</span>
                                </button>
                                <div className="flex items-center space-x-2">
                                    <Link href="#" className="p-3 bg-slate-900 border border-border-slate rounded-xl hover:border-white transition-all text-slate-500 hover:text-white">
                                        <Twitter className="h-4 w-4" />
                                    </Link>
                                    <Link href="#" className="p-3 bg-slate-900 border border-border-slate rounded-xl hover:border-white transition-all text-slate-500 hover:text-white">
                                        <Linkedin className="h-4 w-4" />
                                    </Link>
                                    <Link href="#" className="p-3 bg-slate-900 border border-border-slate rounded-xl hover:border-white transition-all text-slate-500 hover:text-white">
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
                <div className="lg:col-span-4 space-y-10">
                    <section className="space-y-4">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 pb-4 border-b border-border-slate">Operational Background</h2>
                        <div className="text-slate-300 leading-relaxed font-serif text-lg">
                            {author.bio}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 pb-4 border-b border-border-slate">Expertise Manifest</h2>
                        <div className="flex flex-wrap gap-2">
                            {author.expertise.map((exp: string, i: number) => (
                                <div key={i} className="flex items-center space-x-2 px-4 py-2 bg-slate-900/50 border border-border-slate rounded-xl group hover:border-white transition-all">
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent-red" />
                                    <span className="text-xs font-black text-white uppercase tracking-tight">{exp}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-8 space-y-10">
                    <div className="flex items-center justify-between pb-4 border-b border-border-slate">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Research Portfolios / Recent Reports</h2>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Authorized Access Only</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        {author.articles?.map((article: any) => (
                            <AnalysisCard
                                key={article.slug}
                                id={article.id}
                                title={article.title}
                                category={article.category.name}
                                slug={article.slug}
                                image="/images/intel-1.jpg"
                                riskLevel={article.riskLevel}
                                riskScore={article.riskScore}
                            />
                        ))}
                    </div>

                    {author.articles?.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-border-slate rounded-[2.5rem]">
                            <p className="text-slate-500 uppercase font-black tracking-widest text-xs italic">
                                No public dispatches currently indexed for this analyst.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
