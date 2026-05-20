import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages } from "@/lib/chat.functions";
import { sendChatMessage } from "@/lib/ai.functions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { toast } from "sonner";

export const Route = createFileRoute("/app/chat/$threadId")({
  component: ChatThread,
});

function ChatThread() {
  const { threadId } = Route.useParams();
  const qc = useQueryClient();
  const fetchMsgs = useServerFn(getMessages);
  const send = useServerFn(sendChatMessage);

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: () => fetchMsgs({ data: { threadId } }),
  });

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingUser, setPendingUser] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pendingUser]);

  useEffect(() => { inputRef.current?.focus(); }, [threadId, sending]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setPendingUser(text);
    setInput("");
    try {
      await send({ data: { threadId, message: text } });
      await qc.invalidateQueries({ queryKey: ["messages", threadId] });
      await qc.invalidateQueries({ queryKey: ["threads"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
      setInput(text);
    } finally {
      setPendingUser(null);
      setSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col border border-border rounded-lg bg-card/30">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">AI Assistant</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && !pendingUser && (
          <div className="h-full grid place-items-center text-center text-muted-foreground">
            <div>
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary" />
              <p className="text-sm">Ask me anything about your workday.</p>
            </div>
          </div>
        )}
        {messages.map((m) => (
          <Message key={m.id} role={m.role} content={m.content} />
        ))}
        {pendingUser && <Message role="user" content={pendingUser} />}
        {sending && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
            Thinking…
          </div>
        )}
      </div>

      <form onSubmit={submit} className="border-t border-border p-3 space-y-2">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
            }}
            placeholder="Type a message…"
            className="resize-none min-h-[52px] max-h-40 bg-background/50"
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !input.trim()} className="bg-gradient-primary shadow-glow self-end h-[52px] w-[52px] p-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <AIDisclaimer />
      </form>
    </div>
  );
}

function Message({ role, content }: { role: string; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          isUser
            ? "max-w-[80%] rounded-2xl px-4 py-2 bg-primary text-primary-foreground"
            : "max-w-[85%] text-foreground"
        }
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{content}</div>
      </div>
    </div>
  );
}
