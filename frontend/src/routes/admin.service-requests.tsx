import { createFileRoute } from "@tanstack/react-router";
import { AdminServiceRequestsView } from "@/admin-service-requests";

export const Route = createFileRoute("/admin/service-requests")({
  head: () => ({
    meta: [
      { title: "Service Requests — Admin | Hariputhran Enterprises" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminServiceRequestsView,
});
