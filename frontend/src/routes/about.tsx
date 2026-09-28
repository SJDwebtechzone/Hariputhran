import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/about";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Hariputhran Enterprises | Infrastructure & Civil Contractors" },
      { name: "description", content: "Learn about Hariputhran Enterprises, our mission, vision, and core values in underground sewerage, drainage systems, and municipal civil engineering." },
      { property: "og:title", content: "About Us — Hariputhran Enterprises" },
      { property: "og:description", content: "Learn about Hariputhran Enterprises, our mission, vision, and core values in underground sewerage, drainage systems, and municipal civil engineering." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});