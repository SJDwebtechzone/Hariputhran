import { createFileRoute } from "@tanstack/react-router";
import { AdminRecentWorksView } from "@/admin-recent-works";

export const Route = createFileRoute("/admin/recent-works")({
  head: () => ({
    meta: [
      { title: "Manage Recent Works — Admin | Hariputhran Enterprises" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRecentWorksView,
});
