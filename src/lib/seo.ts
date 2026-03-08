export const SITE_URL = 'https://todaydecode.com';

export function constructMetadata({
    title = "Today Decode — Global Strategic Analysis & Geopolitical Risk",
    description = "Strategic analysis of Geopolitics, Economy, Security, and Global Shifts.",
    image = "/og-image.png",
    path = "",
    type = "website",
    riskScore,
    impactScore,
    articleFormat,
    noIndex = false
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
} = {}) {
    // Ensure path is cleaned and has a trailing slash for absolute canonical consistency
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${SITE_URL}${cleanPath.endsWith('/') ? cleanPath : cleanPath + '/'}`;

    // Dynamic Institutional Descriptions for Social Dominance
    let dynamicDescription = description;

    if (articleFormat) {
        const formatLabels: Record<string, string> = {
            'POLICY_BRIEF': 'Institutional Policy Brief',
            'STRATEGIC_REPORT': 'Executive Strategic Report',
            'RISK_ASSESSMENT': 'Global Risk Assessment',
            'SCENARIO_ANALYSIS': 'Strategic Scenario Forecast',
            'COMMENTARY': 'Strategic Commentary',
            'DATA_INSIGHT': 'Technical Data Insight',
            'ANNUAL_OUTLOOK': 'Annual Strategic Outlook',
            'POLICY_TOOLKIT': 'Operational Policy Toolkit'
        };
        const label = formatLabels[articleFormat] || 'Strategic Analysis';
        dynamicDescription = `[${label}] ${description}`;
    }

    if (riskScore !== undefined) {
        dynamicDescription = `[RISK: ${riskScore}/100] // ${dynamicDescription}`;
    }

    return {
        metadataBase: new URL(SITE_URL),
        title: title.includes('|') ? title : `${title} | Today Decode`,
        description: dynamicDescription,
        alternates: {
            canonical: url,
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
        },
        openGraph: {
            title,
            description: dynamicDescription,
            url,
            images: [{ url: image }],
            type: type,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: dynamicDescription,
            images: [image],
        },
    };
}
