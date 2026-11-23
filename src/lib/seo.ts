import type { Metadata } from "next";

/** Canonical production host. The apex domain 307s here. */
export const SITE_URL = "https://www.todaydecode.com";

const BRAND = "Today Decode";
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 155;
const DEFAULT_TITLE = "Today Decode — Global Strategic Analysis & Geopolitical Risk";
const DEFAULT_DESCRIPTION = "Strategic analysis of Geopolitics, Economy, Security, and Global Shifts.";
const DEFAULT_OG_IMAGE = "/og-image.png";

const FORMAT_LABELS: Record<string, string> = {
    POLICY_BRIEF: "Institutional Policy Brief",
    STRATEGIC_REPORT: "Executive Strategic Report",
    RISK_ASSESSMENT: "Global Risk Assessment",
    SCENARIO_ANALYSIS: "Strategic Scenario Forecast",
    COMMENTARY: "Strategic Commentary",
    DATA_INSIGHT: "Technical Data Insight",
    ANNUAL_OUTLOOK: "Annual Strategic Outlook",
    POLICY_TOOLKIT: "Institutional Policy Toolkit",
};

/** Cut on a word boundary so meta descriptions stay inside a typical snippet. */
export function trimDescription(text: string, limit = 160): string {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length <= limit) return normalized;
    const window = normalized.slice(0, limit + 1);
    const lastSpace = window.lastIndexOf(" ");
    const cut = lastSpace >= Math.floor(limit * 0.6)
        ? window.slice(0, lastSpace)
        : normalized.slice(0, limit);
    return cut.replace(/[\s,;:.!?-]+$/g, "").trim();
}

function formatDescription(description: string, articleFormat?: string): string {
    const body = trimDescription(description, 160);
    if (!articleFormat) return body;
    const label = FORMAT_LABELS[articleFormat] || "Strategic Analysis";
    const prefixed = `[${label}] ${body}`;
    return prefixed.length <= DESCRIPTION_LIMIT ? prefixed : body;
}

export function absoluteUrl(pathOrUrl: string): string {
    if (!pathOrUrl) return `${SITE_URL}/`;
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    return `${SITE_URL}${path}`;
}

/**
 * Append the brand only when the title does not already include it
 * and the combined string stays within a typical SERP title length.
 */
export function formatDocumentTitle(title: string): string {
    const trimmed = title.trim();
    if (!trimmed) return BRAND;
    if (trimmed.toLowerCase().includes(BRAND.toLowerCase())) return trimmed;
    if (trimmed.includes("|")) return trimmed;
    const branded = `${trimmed} | ${BRAND}`;
    if (branded.length > TITLE_LIMIT) return trimmed;
    return branded;
}

function withTrailingSlash(path: string): string {
    const clean = path.startsWith("/") ? path : `/${path}`;
    if (clean !== "/" && !clean.endsWith("/")) return `${clean}/`;
    return clean;
}

function toIso(value: string | Date | null | undefined): string | undefined {
    if (!value) return undefined;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toISOString();
}

export function articlePageMetadata(
    article: {
        title: string;
        metaTitle?: string | null;
        metaDescription?: string | null;
        summary?: string | null;
        format?: string | null;
        featuredImage?: string | null;
        publishedAt?: string | Date | null;
        updatedAt?: string | Date | null;
        riskScore?: number;
        impactScore?: number;
    },
    path: string,
): Metadata {
    return constructMetadata({
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.summary || DEFAULT_DESCRIPTION,
        image: article.featuredImage || DEFAULT_OG_IMAGE,
        path,
        type: "article",
        articleFormat: article.format || undefined,
        riskScore: article.riskScore,
        impactScore: article.impactScore,
        publishedTime: toIso(article.publishedAt),
        modifiedTime: toIso(article.updatedAt),
    });
}

export function constructMetadata({
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_OG_IMAGE,
    path,
    type = "website",
    articleFormat,
    noIndex = false,
    follow,
    publishedTime,
    modifiedTime,
}: {
    title?: string;
    description?: string;
    image?: string;
    path?: string;
    type?: "website" | "article" | "profile";
    riskScore?: number;
    impactScore?: number;
    articleFormat?: string;
    noIndex?: boolean;
    /** Defaults to false when noIndex is set, otherwise true. */
    follow?: boolean;
    publishedTime?: string;
    modifiedTime?: string;
} = {}): Metadata {
    const documentTitle = formatDocumentTitle(title);
    const dynamicDescription = formatDescription(description, articleFormat);

    const canonical = path ? absoluteUrl(withTrailingSlash(path)) : undefined;
    const imageUrl = absoluteUrl(image);
    const allowFollow = follow ?? !noIndex;
    const isDefaultOg = imageUrl === absoluteUrl(DEFAULT_OG_IMAGE);

    return {
        metadataBase: new URL(SITE_URL),
        title: documentTitle,
        description: dynamicDescription,
        ...(canonical ? { alternates: { canonical } } : {}),
        robots: {
            index: !noIndex,
            follow: allowFollow,
        },
        openGraph: {
            title: documentTitle,
            description: dynamicDescription,
            ...(canonical ? { url: canonical } : {}),
            images: [
                {
                    url: imageUrl,
                    ...(isDefaultOg ? { width: 1200, height: 630, alt: "Today Decode" } : {}),
                },
            ],
            type,
            ...(type === "article" && publishedTime ? { publishedTime } : {}),
            ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title: documentTitle,
            description: dynamicDescription,
            images: [imageUrl],
        },
    };
}
