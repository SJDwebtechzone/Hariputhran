import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/reset-password";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  head: () => ({
    meta: [
      { title: "Reset Password — Hariputhran Admin Portal" },
      { name: "description", content: "Choose a new password for your Hariputhran Admin account." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});
