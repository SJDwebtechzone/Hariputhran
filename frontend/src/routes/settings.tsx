import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Account Settings — Hariputhran Admin Portal" },
      { name: "description", content: "Manage admin account email and security credentials." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SettingsPage,
});
