import type { ServiceItemData } from "@/types/service";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

export const DEFAULT_SERVICE_PHOTOS = [
  "/images/Underground Utility Infrastructure.jpg", // Position 1, 3, 5... (index 0, 2, 4...)
  "/images/Civil & Infrastructure Works.jpg",       // Position 2, 4, 6... (index 1, 3, 5...)
];

/**
 * Returns the static fallback image for a given position index.
 * Index 0 (Position 1) -> Photo 1
 * Index 1 (Position 2) -> Photo 2
 * Index 2 (Position 3) -> Photo 1, etc.
 */
export function getDefaultServiceImage(positionIndex: number = 0): string {
  const safeIndex = Math.max(0, positionIndex);
  return safeIndex % 2 === 0
    ? DEFAULT_SERVICE_PHOTOS[0]
    : DEFAULT_SERVICE_PHOTOS[1];
}

/**
 * Constructs the absolute URL for a service image if uploaded, or returns the default photo.
 * Never returns a relative API path that would mistakenly hit the frontend dev server on port 8080.
 */
export function getServiceImageSrc(
  service: Partial<ServiceItemData> | null | undefined,
  positionIndex: number = 0
): string {
  if (!service) {
    return getDefaultServiceImage(positionIndex);
  }

  const hasImg = !!service.has_image;
  const rawUrl = service.image_url;

  if (hasImg && rawUrl && typeof rawUrl === "string" && rawUrl.trim()) {
    const trimmed = rawUrl.trim();
    // Already absolute or object URL / data URI
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("blob:") ||
      trimmed.startsWith("data:")
    ) {
      return trimmed;
    }
    // Relative API endpoint from backend -> prepend backend API_BASE
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${API_BASE}${cleanPath}`;
  }

  return getDefaultServiceImage(positionIndex);
}
