export const SITE_URL = 'https://todaydecode.com';

export function constructMetadata({
    title = "Today Decode — Global Intelligence & Geopolitical Risk",
    description = "Strategic analysis of Geopolitics, Economy, Security, and Global Shifts.",
    image = "/og-image.png",
    path = "",
    type = "website",
    noIndex = false
}: {
    title?: string;
    description?: string;
    image?: string;
    path?: string;
    type?: "website" | "article" | "profile";
    noIndex?: boolean;
} = {}) {
    // Ensure path is cleaned and has a trailing slash for canonical consistency
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${SITE_URL}${cleanPath.endsWith('/') ? cleanPath : cleanPath + '/'}`;

    return {
        metadataBase: new URL(SITE_URL),
        title: title.includes('|') ? title : `${title} | Today Decode`,
        description,
        alternates: {
            canonical: url,
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
        },
        openGraph: {
            title,
            description,
            url,
            images: [{ url: image }],
            type: 'website',
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
    };
}
