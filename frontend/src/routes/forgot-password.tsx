import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/forgot-password";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — Hariputhran Admin Portal" },
      { name: "description", content: "Reset your Hariputhran Admin Portal password." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ForgotPasswordPage,
});
