import {
  CHARACTER_SYSTEM_PROMPT,
  generateDeviceReply,
  generatePocketReply,
  simulateTyping,
  type AiMode,
  type ChatMessage,
} from "@/lib/character-persona";

export type StreamHandlers = {
  onDelta: (chunk: string) => void;
  signal?: AbortSignal;
};

export class CloudEdgeError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = "CloudEdgeError";
    this.code = code;
  }
}

let cloudLocked = false;

export function isCloudLocked() {
  return cloudLocked;
}

function historyPayload(messages: ChatMessage[]) {
  return messages.slice(-12).map((m) => ({
    role: m.role,
    content: m.content.slice(0, 4000),
  }));
}

async function streamLocal(
  text: string,
  handlers: StreamHandlers,
  delay = 28,
) {
  for await (const chunk of simulateTyping(text, delay, handlers.signal)) {
    handlers.onDelta(chunk);
  }
}

async function streamCloud(messages: ChatMessage[], handlers: StreamHandlers) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: CHARACTER_SYSTEM_PROMPT,
      messages: historyPayload(messages),
    }),
    signal: handlers.signal,
  });

  if (!res.ok || !res.body) {
    let code = "upstream";
    try {
      const body = (await res.json()) as { code?: string };
      if (body.code) code = body.code;
    } catch {
      // ignore
    }
    if (code === "quota" || code === "unavailable") cloudLocked = true;
    throw new CloudEdgeError(`Cloud edge ${res.status}`, code);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data) as {
          choices?: { delta?: { content?: string } }[];
        };
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) handlers.onDelta(delta);
      } catch {
        // ignore malformed SSE keepalives
      }
    }
  }
}

export async function streamAssistantReply(options: {
  mode: AiMode;
  messages: ChatMessage[];
  userText: string;
  handlers: StreamHandlers;
}): Promise<AiMode> {
  const { mode, messages, userText, handlers } = options;
  let resolved: AiMode = mode;

  if (resolved === "cloud" && typeof navigator !== "undefined" && !navigator.onLine) {
    resolved = "pocket";
  }

  if (resolved === "cloud" && cloudLocked) {
    resolved = "pocket";
  }

  try {
    if (resolved === "cloud") {
      await streamCloud(messages, handlers);
      return "cloud";
    }
    if (resolved === "device") {
      await streamLocal(generateDeviceReply(userText), handlers, 22);
      return "device";
    }
    await streamLocal(generatePocketReply(userText), handlers, 16);
    return "pocket";
  } catch (err) {
    if (handlers.signal?.aborted) throw new DOMException("Aborted", "AbortError");
    if (err instanceof CloudEdgeError && (err.code === "quota" || err.code === "unavailable")) {
      cloudLocked = true;
    }
    await streamLocal(generatePocketReply(userText), handlers, 16);
    return "pocket";
  }
}
