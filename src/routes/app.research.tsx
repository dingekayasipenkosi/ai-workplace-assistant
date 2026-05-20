import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/app/research")({
  component: () => (
    <ToolPage
      tool="research"
      title="AI Research Assistant"
      description="Get a structured briefing on any topic — TL;DR, key points, trade-offs, next steps."
      inputLabel="What do you want to research?"
      inputPlaceholder="e.g. Pros and cons of switching our team from Jira to Linear…"
    />
  ),
  head: () => ({ meta: [{ title: "Research — Workly AI" }] }),
});
