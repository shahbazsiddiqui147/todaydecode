import { SITE_URL } from "@/lib/seo";

interface JsonLdProps {
    type: "Article" | "FAQ";
    data: any;
}

export function JsonLd({ type, data }: JsonLdProps) {
    let schema: any = {};

    if (type === "Article") {
        schema = {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": data.title,
            "image": [data.image],
            "datePublished": data.publishedAt,
            "author": {
                "@type": "Person",
                "name": data.authorName,
            },
            "publisher": {
                "@type": "Organization",
                "name": "Today Decode",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${SITE_URL}/logo.png`,
                },
            },
        };
    } else if (type === "FAQ") {
        schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": data.map((item: any) => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer,
                },
            })),
        };
    }

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
                Quick Intelligence Answer
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
