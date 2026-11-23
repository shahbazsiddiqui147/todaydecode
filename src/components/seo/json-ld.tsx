import { absoluteUrl, SITE_URL } from "@/lib/seo";
import { publicPath } from "@/lib/paths";

interface FaqItem {
    question?: string;
    answer?: string;
}

export interface ArticleJsonLdInput {
    title: string;
    summary?: string | null;
    format?: string | null;
    publishedAt?: string | Date | null;
    updatedAt?: string | Date | null;
    authorName?: string | null;
    image?: string | null;
    categoryName?: string | null;
    categorySlug?: string | null;
    articleSlug?: string | null;
    fullSiloPath?: string | null;
    faqData?: FaqItem[] | null;
}

function toIso(value: string | Date | null | undefined): string | undefined {
    if (!value) return undefined;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toISOString();
}

function articleType(format?: string | null): "NewsArticle" | "OpinionNewsArticle" {
    if (format === "COMMENTARY") return "OpinionNewsArticle";
    return "NewsArticle";
}

function validFaqs(faqData?: FaqItem[] | null) {
    if (!Array.isArray(faqData)) return [];
    return faqData.filter((item) => item?.question?.trim() && item?.answer?.trim());
}

export function ArticleJsonLd({ data }: { data: ArticleJsonLdInput }) {
    const sectionPath = publicPath(data.fullSiloPath || data.categorySlug);
    const url = absoluteUrl(publicPath(data.fullSiloPath || data.categorySlug, data.articleSlug));
    const image = absoluteUrl(data.image || "/og-image.png");
    const published = toIso(data.publishedAt);
    const modified = toIso(data.updatedAt) || published;

    const graph: Record<string, unknown>[] = [
        {
            "@type": articleType(data.format),
            headline: data.title,
            description: data.summary || undefined,
            url,
            mainEntityOfPage: url,
            datePublished: published,
            dateModified: modified,
            articleSection: data.categoryName || undefined,
            image: [image],
            author: {
                "@type": "Person",
                name: data.authorName || "Today Decode",
            },
            publisher: {
                "@type": "Organization",
                name: "Today Decode",
                logo: {
                    "@type": "ImageObject",
                    url: `${SITE_URL}/logo.png`,
                },
            },
            speakable: {
                "@type": "SpeakableSpecification",
                xpath: [
                    "/html/head/title",
                    "//*[@name='description']",
                    "//*[@class='aeo-summary']",
                ],
            },
        },
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: data.categoryName || "Analysis",
                    item: absoluteUrl(sectionPath),
                },
                { "@type": "ListItem", position: 3, name: data.title, item: url },
            ],
        },
    ];

    const faqs = validFaqs(data.faqData);
    if (faqs.length > 0) {
        graph.push({
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer,
                },
            })),
        });
    }

    const schema = {
        "@context": "https://schema.org",
        "@graph": graph,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function HomeJsonLd() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "Today Decode",
                url: `${SITE_URL}/`,
                logo: {
                    "@type": "ImageObject",
                    url: `${SITE_URL}/logo.png`,
                },
            },
            {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                name: "Today Decode",
                url: `${SITE_URL}/`,
                publisher: { "@id": `${SITE_URL}/#organization` },
                description: "Strategic analysis of Geopolitics, Economy, Security, and Global Shifts.",
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function QuickAnswer({ points }: { points: string[] }) {
    return (
        <div className="aeo-summary border-l-4 border-accent-red bg-primary/20 p-6 my-8 rounded-r-lg" data-aeo="summary">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent-red mb-4">
                Quick Strategic Answer
            </h3>
            <ul className="space-y-3 list-none p-0 m-0">
                {points.map((point, i) => (
                    <li key={i} className="text-slate-200 text-lg font-medium leading-relaxed">
                        {point}
                    </li>
                ))}
            </ul>
        </div>
    );
}
