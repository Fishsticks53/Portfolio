/** Prefix a public asset with the site's base path (set to /Portfolio on GitHub Pages). */
export const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${p.replace(/^\//, "")}`;
