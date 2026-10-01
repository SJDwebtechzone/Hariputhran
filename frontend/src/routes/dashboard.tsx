import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Hariputhran Enterprises" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});
