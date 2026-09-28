import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AquaPure — We'd Love to Hear From You" },
      { name: "description", content: "Contact AquaPure for clean water solutions, service and support." },
      { property: "og:title", content: "Contact AquaPure" },
      { property: "og:description", content: "Contact AquaPure for clean water solutions, service and support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});