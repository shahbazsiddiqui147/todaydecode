export const SITE_URL = 'https://todaydecode.com';

export function constructMetadata({
    title = "Today Decode — Global Intelligence & Geopolitical Risk",
    description = "Strategic analysis of Geopolitics, Economy, Security, and Global Shifts.",
    image = "/og-image.png",
    path = "",
    noIndex = false // Public pages default to false (meaning they ARE indexed)
}) {
    const url = `${SITE_URL}${path.endsWith('/') ? path : path + '/'}`;

    return {
        metadataBase: new URL(SITE_URL),
        title,
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
