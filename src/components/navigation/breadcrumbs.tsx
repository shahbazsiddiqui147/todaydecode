import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE_URL } from '@/lib/seo';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.label,
            "item": `${SITE_URL}${item.href}`
        }))
    };

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex py-4", className)}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ol className="flex items-center space-x-2">
                <li>
                    <Link
                        href="/"
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                    >
                        <Home className="h-3 w-3" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                        <Link
                            href={item.href}
                            className={cn(
                                "text-[10px] font-bold uppercase tracking-widest transition-colors",
                                index === items.length - 1
                                    ? "text-foreground pointer-events-none"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            aria-current={index === items.length - 1 ? "page" : undefined}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
