import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessagesSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Workly AI — AI Workplace Productivity Assistant" },
      { name: "description", content: "Draft emails, summarize meetings, plan your day, and research faster with AI built for professionals." },
    ],
  }),
});

const features = [
  { icon: Mail, title: "Smart Email Generator", desc: "Draft polished emails in any tone, instantly." },
  { icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn messy notes into clean summaries with action items." },
  { icon: ListChecks, title: "AI Task Planner", desc: "Get a prioritized daily and weekly plan from your goals." },
  { icon: Search, title: "AI Research Assistant", desc: "Concise, structured briefings on any topic." },
  { icon: MessagesSquare, title: "AI Chatbot", desc: "Conversational assistant with full chat history." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 backdrop-blur sticky top-0 z-30 bg-background/70">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-primary grid place-items-center shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Workly AI</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
            <Button asChild size="sm" className="bg-gradient-primary shadow-glow">
              <Link to="/login">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative bg-gradient-hero">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground mb-6">
            <Zap className="h-3 w-3 text-primary" /> Powered by Lovable AI
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Your AI co-worker for the
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              modern workplace
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Automate the busywork — draft emails, summarize meetings, plan your day,
            and research instantly. One clean, professional workspace.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-gradient-primary shadow-glow">
              <Link to="/login">
                Start free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">See features</Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Private workspace · Editable AI outputs
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Five tools. One workspace.</h2>
          <p className="mt-3 text-muted-foreground">Everything you need to move faster at work.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="p-6 shadow-card hover:border-primary/40 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-accent/50 grid place-items-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Workly AI · AI outputs may contain errors — review before sharing.
      </footer>
    </div>
  );
}
