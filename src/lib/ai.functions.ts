import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const MODEL = "google/gemini-3-flash-preview";

async function callLovableAI(messages: { role: string; content: string }[]) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace settings.");
    const txt = await res.text();
    throw new Error(`AI gateway error (${res.status}): ${txt.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? "";
}

const PROMPTS: Record<string, string> = {
  email:
    "You are a professional workplace email writer. Produce a clear, polished, well-structured email based on the user's brief. Match the requested tone. Output ONLY the email (subject + body), no commentary.",
  notes:
    "You are an expert meeting notes summarizer. Given raw meeting notes or a transcript, produce: 1) a 3-5 sentence executive summary, 2) Key Decisions (bullets), 3) Action Items with owners and due dates if mentioned (bullets), 4) Open Questions. Use clean markdown.",
  planner:
    "You are an AI productivity planner. Given the user's goals or workload, generate a prioritized task plan grouped by Today / This Week / Later. For each task include: title, estimated time, priority (High/Med/Low). Use clean markdown.",
  research:
    "You are an AI research assistant. Provide a concise, well-structured briefing on the topic with: TL;DR (3 sentences), Key Points (bullets), Considerations / Trade-offs, and Suggested Next Steps. Be factual; note uncertainty where appropriate. Use clean markdown.",
};

export const runAITool = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        tool: z.enum(["email", "notes", "planner", "research"]),
        input: z.string().min(1).max(20000),
        tone: z.string().max(60).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const system = PROMPTS[data.tool];
    const userContent =
      data.tool === "email" && data.tone
        ? `Tone: ${data.tone}\n\nBrief:\n${data.input}`
        : data.input;
    const content = await callLovableAI([
      { role: "system", content: system },
      { role: "user", content: userContent },
    ]);
    return { content };
  });

export const sendChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        threadId: z.string().uuid(),
        message: z.string().min(1).max(8000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // verify thread ownership
    const { data: thread, error: tErr } = await supabase
      .from("threads")
      .select("id, title")
      .eq("id", data.threadId)
      .single();
    if (tErr || !thread) throw new Error("Thread not found");

    // load history
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });

    // save user message
    const { error: insErr } = await supabase.from("messages").insert({
      thread_id: data.threadId,
      user_id: userId,
      role: "user",
      content: data.message,
    });
    if (insErr) throw new Error(insErr.message);

    const msgs = [
      {
        role: "system",
        content:
          "You are a helpful AI workplace productivity assistant. Be concise, friendly, and practical. Use markdown when helpful.",
      },
      ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: data.message },
    ];

    const assistant = await callLovableAI(msgs);

    const { error: aErr } = await supabase.from("messages").insert({
      thread_id: data.threadId,
      user_id: userId,
      role: "assistant",
      content: assistant,
    });
    if (aErr) throw new Error(aErr.message);

    // bump thread updated_at and auto-title on first exchange
    const updates: { updated_at: string; title?: string } = {
      updated_at: new Date().toISOString(),
    };
    if (!history || history.length === 0) {
      updates.title = data.message.slice(0, 60);
    }
    await supabase.from("threads").update(updates).eq("id", data.threadId);

    return { assistant };
  });
