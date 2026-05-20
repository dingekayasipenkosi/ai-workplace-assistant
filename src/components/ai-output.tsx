import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AIOutputProps {
  value: string;
  onRegenerate?: () => void;
  loading?: boolean;
  emptyHint?: string;
}

export function AIOutput({ value, onRegenerate, loading, emptyHint }: AIOutputProps) {
  const [text, setText] = useState(value);
  const [copied, setCopied] = useState(false);

  useEffect(() => setText(value), [value]);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  if (!value && !loading) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground border-dashed">
        {emptyHint ?? "Your AI output will appear here."}
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3 shadow-card">
      <Textarea
        value={loading ? "Generating..." : text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
        className="min-h-[280px] font-mono text-sm bg-background/50 resize-y"
      />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={copy} disabled={loading || !text}>
          {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
          Copy
        </Button>
        {onRegenerate && (
          <Button size="sm" variant="outline" onClick={onRegenerate} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
        )}
        <span className="ml-auto self-center text-xs text-muted-foreground">
          Editable — refine as needed
        </span>
      </div>
    </Card>
  );
}
