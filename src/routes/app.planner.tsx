import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/app/planner")({
  component: () => (
    <ToolPage
      tool="planner"
      title="AI Task Planner"
      description="Describe your goals and workload — get a prioritized, time-boxed plan."
      inputLabel="What are you trying to get done?"
      inputPlaceholder="e.g. Ship onboarding redesign, prep Q3 board deck, 5 customer calls, gym 3x…"
    />
  ),
  head: () => ({ meta: [{ title: "Task Planner — Workly AI" }] }),
});
