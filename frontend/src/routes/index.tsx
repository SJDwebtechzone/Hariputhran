import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hariputhran Enterprises — Infrastructure & Underground Civil Works" },
      {
        name: "description",
        content:
          "Specialized underground sewerage systems, drainage infrastructure, pipeline installation, manhole construction, chamber works, and civil engineering works.",
      },
      {
        property: "og:title",
        content: "Hariputhran Enterprises — Infrastructure & Underground Civil Works",
      },
      {
        property: "og:description",
        content:
          "Specialized underground sewerage systems, drainage infrastructure, pipeline installation, manhole construction, chamber works, and civil engineering works.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});