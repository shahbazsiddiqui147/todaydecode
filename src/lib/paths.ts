/**
 * Join stored slugs into one public path.
 * Category and article slugs are persisted with wrapping slashes
 * (`/geopolitics/`). Concatenating those values produces `//geopolitics//`.
 * Strip and rejoin here so callers do not rewrite stored data.
 */
export function publicPath(...parts: Array<string | null | undefined>): string {
    const segments = parts
        .flatMap((part) => (part ?? "").split("/"))
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0);

    if (segments.length === 0) return "/";
    return `/${segments.join("/")}/`;
}
