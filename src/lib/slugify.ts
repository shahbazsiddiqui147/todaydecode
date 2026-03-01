/**
 * TODAY DECODE: STRATEGIC ROUTING UTILITY
 * 
 * Rules:
 * 1. Lowercase
 * 2. Hyphens only (strip special characters)
 * 3. Mandatory trailing slash /
 */
export function slugify(text: string): string {
    const slug = text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')     // Remove non-alphanumeric (except hyphens/spaces)
        .replace(/[\s\r\n\t]+/g, '-') // Replace spaces/newlines with hyphens
        .replace(/-+/g, '-')          // Remove multiple hyphens
        .replace(/^-|-$/g, '');       // Trim hyphens from ends

    if (!slug) return "/";
    return `/${slug}/`;
}
