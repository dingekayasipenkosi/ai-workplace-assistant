import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listThreads, createThread, deleteThread } from "@/lib/chat.functions";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, MessagesSquare } from "lucide-react";
import { useRouterState, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/chat")({
  component: ChatLayout,
  head: () => ({ meta: [{ title: "AI Chatbot — Workly AI" }] }),
});

function ChatLayout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const path = useRouterState({ select: (r) => r.location.pathname });

  const list = useServerFn(listThreads);
  const create = useServerFn(createThread);
  const del = useServerFn(deleteThread);

  const { data: threads = [] } = useQuery({
    queryKey: ["threads"],
    queryFn: () => list(),
  });

  const newThread = useMutation({
    mutationFn: async () => create(),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      navigate({ to: "/app/chat/$threadId", params: { threadId: res.id } });
    },
  });

  const removeThread = useMutation({
    mutationFn: async (threadId: string) => del({ data: { threadId } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      navigate({ to: "/app/chat" });
    },
  });

  useEffect(() => {
    if (path === "/app/chat" && threads.length === 0 && !newThread.isPending) {
      newThread.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, threads.length]);

  const activeId = path.startsWith("/app/chat/") ? path.split("/").pop() : null;

  return (
    <div className="flex h-[calc(100vh-7.5rem)] gap-4">
      <aside className="w-64 shrink-0 border border-border rounded-lg bg-card/50 flex flex-col">
        <div className="p-3 border-b border-border">
          <Button
            size="sm"
            className="w-full bg-gradient-primary shadow-glow"
            onClick={() => newThread.mutate()}
            disabled={newThread.isPending}
          >
            <Plus className="h-4 w-4 mr-1" /> New chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {threads.length === 0 && (
              <div className="text-xs text-muted-foreground p-3 text-center">
                No conversations yet
              </div>
            )}
            {threads.map((t) => (
              <div
                key={t.id}
                className={`group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50 ${
                  activeId === t.id ? "bg-accent" : ""
                }`}
              >
                <Link
                  to="/app/chat/$threadId"
                  params={{ threadId: t.id }}
                  className="flex-1 truncate flex items-center gap-2"
                >
                  <MessagesSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{t.title}</span>
                </Link>
                <button
                  onClick={() => removeThread.mutate(t.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  aria-label="Delete thread"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
