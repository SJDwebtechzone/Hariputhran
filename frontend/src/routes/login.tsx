import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Staff & Client Portal — Hariputhran Enterprises" },
      { name: "description", content: "Secure portal login for Hariputhran Enterprises staff and clients." },
      { property: "og:title", content: "Portal Login — Hariputhran Enterprises" },
      { property: "og:description", content: "Secure portal login for Hariputhran Enterprises staff and clients." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});
