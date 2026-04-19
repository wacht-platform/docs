export const appName = "Wacht Docs";
export const docsRoute = "/";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";
export const siteUrl =
    process.env.NEXT_PUBLIC_DOCS_URL || "https://wacht.dev/docs";
export const siteDescription =
    "Developer documentation for Wacht SDKs, APIs, guides, and integration patterns.";

export const gitConfig = {
    user: "wacht-platform",
    repo: "documentation",
    branch: "main",
};
