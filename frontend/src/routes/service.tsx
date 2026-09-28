import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/service";

export const Route = createFileRoute("/service")({
  head: () => ({
    meta: [
      { title: "Services — AquaPure" },
      { name: "description", content: "AquaPure water services." },
      { property: "og:title", content: "Services — AquaPure" },
      { property: "og:description", content: "AquaPure water services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicePage,
});