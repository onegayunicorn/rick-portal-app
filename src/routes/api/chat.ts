import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CHARACTER_SYSTEM_PROMPT } from "@/lib/character-persona";

const ChatRequest = z.object({
  system: z.string().max(4000).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(4000),
      }),
    )
    .min(1)
    .max(24),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.XAI_API_KEY?.trim();
        if (!apiKey) {
          return Response.json(
            { error: "AI is not available in this environment", code: "unavailable" },
            { status: 503 },
          );
        }

        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = ChatRequest.safeParse(json);
        if (!parsed.success) {
          return Response.json({ error: "Invalid payload" }, { status: 400 });
        }

        const { messages, system } = parsed.data;
        const last = messages[messages.length - 1];
        if (!last || last.role !== "user" || !last.content.trim()) {
          return Response.json({ error: "Expected a user message" }, { status: 400 });
        }

        const upstream = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "grok-4.5",
            stream: true,
            temperature: 0.8,
            max_tokens: 320,
            messages: [
              { role: "system", content: system || CHARACTER_SYSTEM_PROMPT },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
            ],
          }),
          signal: request.signal,
        });

        if (!upstream.ok || !upstream.body) {
          const detail = await upstream.text().catch(() => "");
          const quota =
            upstream.status === 403 || /spending-limit|credits/i.test(detail);
          return Response.json(
            {
              error: quota
                ? "Cloud edge is quota-locked"
                : `xAI API error ${upstream.status}`,
              code: quota ? "quota" : "upstream",
            },
            { status: quota ? 503 : 502 },
          );
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
