/**
 * TODAY DECODE: STRATEGIC ROUTING UTILITY
 *
 * Rules:
 * 1. Lowercase
 * 2. Hyphens only (strip special characters)
 * 3. Mandatory trailing slash /
 *
 * `slugify` is stable for values that are already slugs. Do not add
 * truncation here — category, page, and author slugs, and every stored
 * article slug, pass back through this function on edit.
 */
export function slugify(text: string): string {
    const slug = text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s\r\n\t]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    if (!slug) return "/";
    return `/${slug}/`;
}

const TRAILING_STOP_WORDS = new Set([
    "a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into",
    "of", "on", "or", "the", "to", "with", "vs", "via", "over", "after",
    "before", "about", "between", "without", "within", "than",
]);

/** Keep newly generated article slugs readable without cutting a phrase in half. */
const MAX_ARTICLE_SLUG_LENGTH = 80;

/**
 * Slug for a NEW article title only.
 * Shortens on a word boundary and drops a dangling stop-word ("of", "the")
 * so the slug does not end mid-phrase. Never use this to rewrite a slug
 * that is already stored.
 */
export function slugifyArticle(text: string): string {
    const base = slugify(text);
    const inner = base.replace(/^\/|\/$/g, "");
    if (!inner) return base;

    const words = inner.split("-").filter(Boolean);
    while (words.length > 1 && words.join("-").length > MAX_ARTICLE_SLUG_LENGTH) {
        words.pop();
    }
    while (words.length > 3 && TRAILING_STOP_WORDS.has(words[words.length - 1]!)) {
        words.pop();
    }

    let slug = words.join("-");
    if (slug.length > MAX_ARTICLE_SLUG_LENGTH) {
        slug = slug.slice(0, MAX_ARTICLE_SLUG_LENGTH).replace(/-+$/g, "");
    }
    if (!slug) return base;
    return `/${slug}/`;
}
