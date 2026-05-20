import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Mail, FileText, ListChecks, Search, MessagesSquare, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — Workly AI" }] }),
});

const tools = [
  { url: "/app/email", icon: Mail, title: "Smart Email Generator", desc: "Draft polished emails in seconds." },
  { url: "/app/notes", icon: FileText, title: "Meeting Notes Summarizer", desc: "Summaries, decisions, action items." },
  { url: "/app/planner", icon: ListChecks, title: "AI Task Planner", desc: "Prioritized daily & weekly plans." },
  { url: "/app/research", icon: Search, title: "AI Research Assistant", desc: "Structured briefings on any topic." },
  { url: "/app/chat", icon: MessagesSquare, title: "AI Chatbot", desc: "Conversational assistant with history." },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <p className="text-muted-foreground mt-1">Pick a tool to get started.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.url} to={t.url}>
            <Card className="p-6 shadow-card hover:border-primary/50 transition-colors h-full group">
              <div className="h-10 w-10 rounded-lg bg-accent/50 grid place-items-center mb-4">
                <t.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold flex items-center justify-between">
                {t.title}
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
