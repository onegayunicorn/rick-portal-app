import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CharacterStage, type CharacterState } from "@/components/portal/CharacterStage";
import { ChatPanel } from "@/components/portal/ChatPanel";
import { CyberHUD } from "@/components/portal/CyberHUD";
import { VortexBackdrop } from "@/components/portal/VortexBackdrop";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { useSpeechSynthesizer } from "@/hooks/use-speech-synthesizer";
import { isCloudLocked, streamAssistantReply } from "@/lib/chat-engine";
import type { AiMode, ChatMessage } from "@/lib/character-persona";
import { isWebGPUSupported } from "@/lib/offline-ai";
import { uid } from "@/lib/utils";

const CLIPS: Record<CharacterState, string> = {
  idle: "/media/character-idle.mp4",
  thinking: "/media/character-thinking.mp4",
  talking: "/media/character-talking.mp4",
};

const POSTER = "/character-poster.jpg";
const STORAGE_KEY = "c137-portal-state";

type PersistShape = {
  mode: AiMode;
  voiceEnabled: boolean;
  messages: ChatMessage[];
};

function loadPersist(): PersistShape | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistShape;
  } catch {
    return null;
  }
}

export function PortalConsole() {
  const [mode, setMode] = useState<AiMode>("cloud");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted" | "streaming">("idle");
  const [webGpuReady, setWebGpuReady] = useState(false);
  const [online, setOnline] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [cloudLocked, setCloudLocked] = useState(false);
  const [telemetry, setTelemetry] = useState({ stability: 99.4, resonance: 1207 });
  const abortRef = useRef<AbortController | null>(null);
  const allowSpeak = useRef(false);

  const { speaking, stop: stopSpeech, feedStream } = useSpeechSynthesizer(voiceEnabled);

  const sendText = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || status !== "idle") return;

      stopSpeech();
      allowSpeak.current = true;
      const userMsg: ChatMessage = { id: uid(), role: "user", content: text };
      const assistantId = uid();
      const assistantMsg: ChatMessage = { id: assistantId, role: "assistant", content: "" };
      const nextHistory = [...messages, userMsg];

      setMessages([...nextHistory, assistantMsg]);
      setInput("");
      setStatus("submitted");

      const controller = new AbortController();
      abortRef.current = controller;
      let assembled = "";

      try {
        setStatus("streaming");
        const used = await streamAssistantReply({
          mode,
          messages: nextHistory,
          userText: text,
          handlers: {
            signal: controller.signal,
            onDelta: (chunk) => {
              assembled += chunk;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: assembled } : m)),
              );
            },
          },
        });
        if (isCloudLocked()) setCloudLocked(true);
        if (used !== mode && mode === "cloud") {
          toast.message("Cloud edge dropped. Pocket core took over.");
        }
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId && !m.content
              ? { ...m, content: "Channel collapsed. Try pocket mode or transmit again." }
              : m,
          ),
        );
      } finally {
        setStatus("idle");
        abortRef.current = null;
      }
    },
    [messages, mode, status, stopSpeech],
  );

  const { isRecording, toggle: toggleMic } = useAudioRecorder((transcript) => {
    void sendText(transcript);
  });

  useEffect(() => {
    const saved = loadPersist();
    if (saved) {
      if (saved.mode) setMode(saved.mode);
      if (typeof saved.voiceEnabled === "boolean") setVoiceEnabled(saved.voiceEnabled);
      if (Array.isArray(saved.messages)) setMessages(saved.messages);
    }
    setOnline(navigator.onLine);
    setHydrated(true);
    void isWebGPUSupported().then(setWebGpuReady);
  }, []);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTelemetry({
        stability: 98.8 + Math.random() * 1.1,
        resonance: 1180 + Math.floor(Math.random() * 90),
      });
    }, 1800);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          mode,
          voiceEnabled,
          messages: messages.slice(-40),
        } satisfies PersistShape),
      );
    } catch {
      // ignore quota
    }
  }, [hydrated, mode, voiceEnabled, messages]);

  const lastMessage = messages[messages.length - 1];
  useEffect(() => {
    if (!allowSpeak.current) return;
    if (!lastMessage || lastMessage.role !== "assistant") return;
    feedStream(lastMessage.id, lastMessage.content, status !== "streaming");
  }, [lastMessage, status, feedStream]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const characterState: CharacterState = useMemo(() => {
    if (status === "submitted" || status === "streaming") {
      return speaking ? "talking" : "thinking";
    }
    if (speaking) return "talking";
    return "idle";
  }, [status, speaking]);

  const handleSend = (preset?: string) => {
    void sendText(preset ?? input);
  };

  return (
    <main className="relative flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground">
      <VortexBackdrop />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:px-8 md:py-6">
        <header className="flex items-center justify-between gap-3 border-b border-primary/20 pb-3">
          <div>
            <h1 className="flex items-center gap-2 font-hud text-lg font-medium tracking-[0.22em] text-primary md:text-2xl">
              <span className="inline-block size-2.5 rounded-full bg-primary shadow-glow" />
              SOVEREIGN C-137 PORTAL
            </h1>
            <p className="mt-1 text-xs text-muted">Talk to your twin. Tri-modal intelligence node.</p>
          </div>
          <div className="text-right font-hud text-[10px] tracking-widest text-muted md:text-xs">
            <div>NODE · DIMENSION-C137</div>
            <div className={online ? "text-primary" : "text-alert"}>
              {online ? "UPLINK LIVE" : "UPLINK DARK"}
            </div>
          </div>
        </header>

        {cloudLocked && (
          <p className="rounded-xl border border-accent/30 bg-void/70 px-3 py-2 font-hud text-[11px] tracking-widest text-accent">
            CLOUD EDGE QUOTA-LOCKED · POCKET CORE IS ANSWERING
          </p>
        )}

        <section className="grid flex-1 grid-cols-1 items-stretch gap-4 md:grid-cols-[minmax(0,420px)_1fr] md:gap-6">
          <CharacterStage
            state={characterState}
            clips={CLIPS}
            posterUrl={POSTER}
            telemetry={telemetry}
          />
          <ChatPanel
            messages={messages}
            input={input}
            onInput={setInput}
            onSend={handleSend}
            onClear={() => {
              stopSpeech();
              abortRef.current?.abort();
              allowSpeak.current = false;
              setMessages([]);
              setStatus("idle");
            }}
            busy={status !== "idle"}
          />
        </section>

        <footer className="safe-footer">
          <CyberHUD
            mode={mode}
            onModeChange={setMode}
            voiceEnabled={voiceEnabled}
            onToggleVoice={() => {
              if (voiceEnabled) stopSpeech();
              setVoiceEnabled(!voiceEnabled);
            }}
            isListening={isRecording}
            onToggleMic={toggleMic}
            webGpuReady={webGpuReady}
            online={online}
            cloudLocked={cloudLocked}
          />
        </footer>
      </div>
    </main>
  );
}
