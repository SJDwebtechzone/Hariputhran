import { useState, useEffect } from "react";
import type { ServiceItemData } from "@/types/service";

const API_BASE = ((import.meta.env["VITE_API_URL"] as string) || "http://localhost:5000").replace(/\/+$/, "");
const CACHE_TTL_MS = 60 * 1000; // 60-second module cache

let cachedServices: ServiceItemData[] | null = null;
let cacheTimestamp = 0;

export const fallbackFooterServices: ServiceItemData[] = [
  {
    id: 1,
    title: "Sewerage Works",
    description: "",
    features: [],
    button_label: "",
    button_link: "",
    icon_key: null,
    sort_order: 1,
    is_active: true,
    has_image: false,
    image_url: null,
  },
  {
    id: 2,
    title: "Drainage Works",
    description: "",
    features: [],
    button_label: "",
    button_link: "",
    icon_key: null,
    sort_order: 2,
    is_active: true,
    has_image: false,
    image_url: null,
  },
  {
    id: 3,
    title: "Pipeline Installation",
    description: "",
    features: [],
    button_label: "",
    button_link: "",
    icon_key: null,
    sort_order: 3,
    is_active: true,
    has_image: false,
    image_url: null,
  },
  {
    id: 4,
    title: "Manhole Construction",
    description: "",
    features: [],
    button_label: "",
    button_link: "",
    icon_key: null,
    sort_order: 4,
    is_active: true,
    has_image: false,
    image_url: null,
  },
  {
    id: 5,
    title: "Chamber Works",
    description: "",
    features: [],
    button_label: "",
    button_link: "",
    icon_key: null,
    sort_order: 5,
    is_active: true,
    has_image: false,
    image_url: null,
  },
  {
    id: 6,
    title: "Road Restoration",
    description: "",
    features: [],
    button_label: "",
    button_link: "",
    icon_key: null,
    sort_order: 6,
    is_active: true,
    has_image: false,
    image_url: null,
  },
];

export function useFooterServices() {
  const isCached = cachedServices && Date.now() - cacheTimestamp < CACHE_TTL_MS;

  const [services, setServices] = useState<ServiceItemData[]>(() => {
    if (isCached && cachedServices) {
      return cachedServices;
    }
    return [];
  });
  const [loading, setLoading] = useState<boolean>(!isCached);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    if (cachedServices && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
      setServices(cachedServices);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadServices() {
      try {
        const res = await fetch(`${API_BASE}/api/services`, {
          signal: controller.signal,
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          cachedServices = json.data;
          cacheTimestamp = Date.now();
          setServices(json.data);
          setFailed(false);
        } else {
          setServices(fallbackFooterServices);
          setFailed(true);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.warn("[useFooterServices] Failed to fetch services from API:", err);
          setFailed(true);
          setServices(fallbackFooterServices);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      controller.abort();
    };
  }, []);

  return { services, loading, failed };
}

