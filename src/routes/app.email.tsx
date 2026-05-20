import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/app/email")({
  component: () => (
    <ToolPage
      tool="email"
      title="Smart Email Generator"
      description="Describe the email you need. We'll draft it in your chosen tone."
      inputLabel="What should the email say?"
      inputPlaceholder="e.g. Reply to a client postponing our Friday meeting to next Tuesday, keep it warm and professional…"
      showTone
    />
  ),
  head: () => ({ meta: [{ title: "Smart Email — Workly AI" }] }),
});
