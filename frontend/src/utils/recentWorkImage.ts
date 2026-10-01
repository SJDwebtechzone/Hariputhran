import { RecentWorkItem } from "@/types/recentWork";

export const DEFAULT_RECENT_WORK_IMAGES: Record<number, string> = {
  1: "/images/recents/sewer.jpg",
  2: "/images/recents/manhole.jpg",
  3: "/images/recents/pipeline.jpg",
  4: "/images/recents/road.jpg",
};

/**
 * Returns the effective image src for a Recent Work item.
 * If the item has an uploaded image (hasImage is true and imageUrl is provided),
 * it prepends the backend VITE_API_URL.
 * Otherwise, it falls back to the static default photo for that position (1..4).
 */
export function getRecentWorkImageSrc(item: {
  id?: number | string;
  position?: number;
  hasImage?: boolean;
  imageUrl?: string | null;
}): string {
  const idNum = Number(item.position || item.id || 1);
  const defaultImg = DEFAULT_RECENT_WORK_IMAGES[idNum] || "/images/recents/sewer.jpg";

  if (item.hasImage && item.imageUrl) {
    const rawApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    return `${rawApiUrl}${item.imageUrl}`;
  }

  return defaultImg;
}

/**
 * Image error handler fallback to static image without showing broken image icon
 */
export function handleRecentWorkImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  positionOrId: number | string = 1
) {
  const idNum = Number(positionOrId || 1);
  const defaultImg = DEFAULT_RECENT_WORK_IMAGES[idNum] || "/images/recents/sewer.jpg";
  const currentSrc = e.currentTarget.src;

  console.warn("Recent Works: image load failed, falling back to default photo", currentSrc);

  if (e.currentTarget.src !== window.location.origin + defaultImg && e.currentTarget.src !== defaultImg) {
    e.currentTarget.src = defaultImg;
  }
}
