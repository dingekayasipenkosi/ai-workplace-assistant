import { AlertTriangle } from "lucide-react";

export function AIDisclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <span>
        AI-generated content may contain errors. Review carefully before sharing,
        especially for sensitive or high-stakes communication.
      </span>
    </div>
  );
}
