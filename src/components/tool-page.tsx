import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AIOutput } from "@/components/ai-output";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { runAITool } from "@/lib/ai.functions";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface ToolPageProps {
  tool: "email" | "notes" | "planner" | "research";
  title: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  showTone?: boolean;
}

export function ToolPage(props: ToolPageProps) {
  const run = useServerFn(runAITool);
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!input.trim()) {
      toast.error("Please enter some input first");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { tool: props.tool, input, tone: props.showTone ? tone : undefined } });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{props.title}</h1>
        <p className="text-muted-foreground mt-1">{props.description}</p>
      </div>

      <AIDisclaimer />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4 space-y-3 shadow-card">
          <Label htmlFor="ai-input" className="text-sm font-medium">{props.inputLabel}</Label>
          <Textarea
            id="ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={props.inputPlaceholder}
            className="min-h-[280px] bg-background/50"
          />
          {props.showTone && (
            <div>
              <Label htmlFor="tone" className="text-sm">Tone</Label>
              <Input id="tone" value={tone} onChange={(e) => setTone(e.target.value)}
                placeholder="Professional, friendly, concise…" />
            </div>
          )}
          <Button onClick={generate} disabled={loading} className="w-full bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? "Generating…" : "Generate with AI"}
          </Button>
        </Card>

        <AIOutput value={output} loading={loading} onRegenerate={generate}
          emptyHint="Your AI output will appear here. You can edit it before sharing." />
      </div>
    </div>
  );
}
