import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/service";

export const Route = createFileRoute("/service")({
  head: () => ({
    meta: [
      { title: "Services — Hariputhran Enterprises | Infrastructure & Civil Contractors" },
      { name: "description", content: "Explore Hariputhran Enterprises underground sewerage, drainage systems, pipeline laying, and infrastructure services." },
      { property: "og:title", content: "Services — Hariputhran Enterprises" },
      { property: "og:description", content: "Explore Hariputhran Enterprises underground sewerage, drainage systems, pipeline laying, and infrastructure services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicePage,
});
