import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/app/notes")({
  component: () => (
    <ToolPage
      tool="notes"
      title="Meeting Notes Summarizer"
      description="Paste raw notes or a transcript. Get a clean summary, decisions, and action items."
      inputLabel="Raw meeting notes or transcript"
      inputPlaceholder="Paste your meeting notes here…"
    />
  ),
  head: () => ({ meta: [{ title: "Meeting Notes — Workly AI" }] }),
});
