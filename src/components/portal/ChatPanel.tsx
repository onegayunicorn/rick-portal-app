import { useEffect, useRef } from "react";
import { Send, Trash2 } from "lucide-react";
import type { ChatMessage } from "@/lib/character-persona";
import { SUGGESTED_PROMPTS } from "@/lib/character-persona";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  messages: ChatMessage[];
  input: string;
  onInput: (value: string) => void;
  onSend: (text?: string) => void;
  onClear: () => void;
  busy: boolean;
}

export function ChatPanel({
  messages,
  input,
  onInput,
  onSend,
  onClear,
  busy,
}: ChatPanelProps) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="flex h-full min-h-[280px] flex-col rounded-3xl border border-primary/25 bg-surface/80 p-3 backdrop-blur-md md:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="font-hud text-[11px] tracking-[0.22em] text-primary">LIVE TRANSCRIPT</p>
          <p className="text-xs text-muted">Talk to the twin. Cloud, device, or pocket core.</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={messages.length === 0}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:text-foreground disabled:opacity-30"
          aria-label="Clear transcript"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div
        ref={scroller}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-2 text-center">
            <p className="max-w-xs font-hud text-[11px] leading-relaxed tracking-widest text-muted">
              AWAITING AUDIO TRANSCRIPTION OR TEXT TELEMETRY
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onSend(prompt)}
                  className="min-h-11 rounded-full border border-primary/30 bg-void px-3 py-2 font-hud text-[10px] tracking-widest text-primary transition-colors hover:border-primary"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[92%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "ml-auto border border-primary/35 bg-primary/10 text-primary"
                  : "mr-auto border border-line bg-void/70 text-foreground",
              )}
            >
              <div className="mb-1 font-hud text-[10px] tracking-widest text-muted">
                {m.role === "user" ? "OBSERVER" : "C-137"}
              </div>
              <p className="select-text whitespace-pre-wrap">
                {m.content || (busy ? "…" : "")}
              </p>
            </div>
          ))
        )}
      </div>

      <form
        className="mt-3 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        <label className="sr-only" htmlFor="c137-input">
          Transmit inquiry
        </label>
        <input
          id="c137-input"
          value={input}
          onChange={(e) => onInput(e.target.value)}
          placeholder="Transmit inquiry to C-137..."
          autoComplete="off"
          className="min-h-11 flex-1 rounded-xl border border-primary/30 bg-void px-3 py-2 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted focus:border-primary focus:shadow-glow"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-primary px-3 text-void transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
