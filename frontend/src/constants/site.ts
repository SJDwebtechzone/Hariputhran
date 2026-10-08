// Site URL configuration for canonicals, OG tags, JSON-LD, sitemaps
// Default domain: https://hariputhranenterprises.com (TO BE CONFIRMED by client/host)
export const SITE_URL: string = (
  (import.meta.env["VITE_SITE_URL"] as string) || "https://hariputhranenterprises.com"
).replace(/\/+$/, "");

let hasWarnedApiUrl = false;

export function getApiBaseUrl(): string {
  const envUrl = (import.meta.env["VITE_API_URL"] as string) || "";
  if (import.meta.env.PROD && !hasWarnedApiUrl) {
    if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
      console.error(
        "[Production Warning] VITE_API_URL is unset or points to localhost:",
        envUrl || "(empty)"
      );
      hasWarnedApiUrl = true;
    }
  }
  return envUrl.replace(/\/+$/, "") || (import.meta.env.DEV ? "http://localhost:5000" : "");
}

