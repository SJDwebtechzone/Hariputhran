import { createFileRoute } from "@tanstack/react-router";
import { AdminServicesPage } from "@/admin-services";

export const Route = createFileRoute("/admin/services")({
  head: () => ({
    meta: [
      { title: "Manage Core Services — Admin | Hariputhran Enterprises" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminServicesPage,
});
