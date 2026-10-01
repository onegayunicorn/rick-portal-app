import { useEffect, useRef } from "react";
import { ScanlineOverlay } from "@/components/portal/ScanlineOverlay";
import { Waveform } from "@/components/portal/Waveform";
import { cn } from "@/lib/utils";

export type CharacterState = "idle" | "thinking" | "talking";

interface CharacterStageProps {
  state: CharacterState;
  clips: Record<CharacterState, string>;
  posterUrl: string;
  telemetry?: { stability: number; resonance: number };
}

const STATUS: Record<CharacterState, string> = {
  idle: "STANDBY",
  thinking: "COMPUTING",
  talking: "TRANSMITTING",
};

export function CharacterStage({
  state,
  clips,
  posterUrl,
  telemetry,
}: CharacterStageProps) {
  const videoRefs = useRef<Record<CharacterState, HTMLVideoElement | null>>({
    idle: null,
    thinking: null,
    talking: null,
  });

  useEffect(() => {
    const activeVideo = videoRefs.current[state];
    if (activeVideo) {
      if (state !== "idle") activeVideo.currentTime = 0;
      void activeVideo.play().catch(() => {});
    }

    const timer = window.setTimeout(() => {
      (Object.keys(videoRefs.current) as CharacterState[]).forEach((key) => {
        if (key !== state) videoRefs.current[key]?.pause();
      });
    }, 550);

    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <div className="portal-frame relative mx-auto aspect-[5/9] w-full max-w-[380px] overflow-hidden rounded-3xl bg-surface stage-frame">
      {(Object.keys(clips) as CharacterState[]).map((key) => (
        <video
          key={key}
          ref={(el) => {
            videoRefs.current[key] = el;
          }}
          src={clips[key]}
          poster={posterUrl}
          muted
          loop
          playsInline
          autoPlay={key === "idle"}
          preload="auto"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out",
            state === key ? "z-10 opacity-100" : "z-0 opacity-0",
          )}
        />
      ))}

      <ScanlineOverlay />

      <div className="pointer-events-none absolute inset-3 z-30">
        <span className="hud-corner hud-corner-tl" />
        <span className="hud-corner hud-corner-tr" />
        <span className="hud-corner hud-corner-bl" />
        <span className="hud-corner hud-corner-br" />
      </div>

      {telemetry && (
        <>
          <div className="absolute left-3 top-3 z-30 rounded-md border border-primary/30 bg-void/80 px-2.5 py-1 font-hud text-[11px] tracking-widest text-primary shadow-glow">
            STATUS · {telemetry.stability.toFixed(1)}% · {telemetry.resonance} HZ
          </div>
          <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between gap-2 rounded-full border border-primary/30 bg-void/80 px-3 py-1.5 font-hud text-[11px] tracking-widest text-foreground">
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  state === "idle" && "bg-primary",
                  state === "thinking" && "bg-accent animate-pulse",
                  state === "talking" && "bg-alert animate-ping",
                )}
              />
              {STATUS[state]}
            </span>
            <Waveform active={state !== "idle"} />
          </div>
        </>
      )}
    </div>
  );
}
