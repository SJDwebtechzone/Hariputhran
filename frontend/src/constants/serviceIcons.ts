import {
  Ban,
  Droplets,
  Construction,
  Wrench,
  Hammer,
  Pipette,
  Waves,
  Route,
  HardHat,
  Truck,
  Building2,
  ShieldCheck,
  Layers3,
  type LucideIcon,
} from "lucide-react";

export interface ServiceIconOption {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const SERVICE_ICON_OPTIONS: ServiceIconOption[] = [
  { key: "none", label: "No icon (hidden)", icon: Ban },
  { key: "Droplets", label: "Water & Droplets", icon: Droplets },
  { key: "Construction", label: "Construction & Road", icon: Construction },
  { key: "Wrench", label: "Wrench & Maintenance", icon: Wrench },
  { key: "Hammer", label: "Hammer & Tools", icon: Hammer },
  { key: "Pipette", label: "Pipette & Testing", icon: Pipette },
  { key: "Waves", label: "Waves & Drainage", icon: Waves },
  { key: "Route", label: "Route & Network", icon: Route },
  { key: "HardHat", label: "Hard Hat & Safety", icon: HardHat },
  { key: "Truck", label: "Truck & Transport", icon: Truck },
  { key: "Building2", label: "Building & Civil", icon: Building2 },
  { key: "ShieldCheck", label: "Quality & Shield", icon: ShieldCheck },
  { key: "Layers3", label: "Layers & Infrastructure", icon: Layers3 },
];

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Droplets,
  Construction,
  Wrench,
  Hammer,
  Pipette,
  Waves,
  Route,
  HardHat,
  Truck,
  Building2,
  ShieldCheck,
  Layers3,
};

/**
 * Resolves a Lucide icon component from an icon_key string.
 * Returns null if the icon_key is empty, null, undefined, or "none",
 * or if it's an unrecognized icon key (graceful fallback with console warning).
 */
export function getServiceIcon(iconKey?: string | null): LucideIcon | null {
  if (!iconKey || iconKey === "none" || iconKey === "null" || iconKey === "") {
    return null;
  }

  if (SERVICE_ICON_MAP[iconKey]) {
    return SERVICE_ICON_MAP[iconKey];
  }

  console.warn(`[ServiceIcon] Unknown icon key: "${iconKey}". Rendering without icon badge.`);
  return null;
}
