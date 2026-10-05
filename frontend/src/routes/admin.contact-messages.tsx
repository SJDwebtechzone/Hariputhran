import { createFileRoute } from "@tanstack/react-router";
import { AdminContactMessagesView } from "@/admin-contact-messages";

export const Route = createFileRoute("/admin/contact-messages")({
  head: () => ({
    meta: [
      { title: "Contact Messages — Admin | Hariputhran Enterprises" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminContactMessagesView,
});
