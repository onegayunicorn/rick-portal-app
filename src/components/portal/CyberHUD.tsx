import { Cloud, Cpu, Mic, MicOff, Volume2, VolumeX, Zap } from "lucide-react";
import type { AiMode } from "@/lib/character-persona";
import { cn } from "@/lib/utils";

interface CyberHUDProps {
  mode: AiMode;
  onModeChange: (mode: AiMode) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  isListening: boolean;
  onToggleMic: () => void;
  webGpuReady: boolean;
  modelLoadProgress?: number;
  online: boolean;
  cloudLocked?: boolean;
}

const MODES: Array<{
  id: AiMode;
  label: string;
  icon: typeof Cloud;
}> = [
  { id: "cloud", label: "Cloud Edge", icon: Cloud },
  { id: "device", label: "Device GPU", icon: Cpu },
  { id: "pocket", label: "Pocket Rule", icon: Zap },
];

export function CyberHUD({
  mode,
  onModeChange,
  voiceEnabled,
  onToggleVoice,
  isListening,
  onToggleMic,
  webGpuReady,
  modelLoadProgress,
  online,
  cloudLocked = false,
}: CyberHUDProps) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-primary/25 bg-surface/90 p-3 backdrop-blur-md md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-void/50 p-1">
        {MODES.map((item) => {
          const Icon = item.icon;
          const disabled = item.id === "cloud" && !online;
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              title={
                item.id === "device"
                  ? webGpuReady
                    ? "Run locally on-device"
                    : "WebGPU unavailable — local heuristic core still runs"
                  : item.id === "cloud" && cloudLocked
                    ? "Cloud edge quota-locked — pocket core will answer"
                    : item.id === "cloud" && !online
                      ? "Offline — cloud edge unavailable"
                      : item.label
              }
              onClick={() => onModeChange(item.id)}
              className={cn(
                "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 font-hud text-[11px] tracking-widest transition-colors md:flex-none",
                active && item.id === "cloud" && "bg-primary text-void shadow-glow",
                active && item.id === "device" && "bg-accent text-void shadow-cyan",
                active && item.id === "pocket" && "bg-alert text-alert-fg shadow-alert",
                !active && "text-muted hover:text-foreground",
                disabled && "cursor-not-allowed opacity-40",
              )}
            >
              <Icon className="size-3.5" />
              {item.id === "cloud" && cloudLocked ? "Cloud Lock" : item.label}
            </button>
          );
        })}
      </div>

      {typeof modelLoadProgress === "number" && modelLoadProgress < 1 && (
        <div className="flex items-center gap-2 font-hud text-[10px] tracking-widest text-accent">
          <span>MODEL SYNC</span>
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-void">
            <div
              className="h-full bg-accent transition-[width] duration-300"
              style={{ width: `${Math.round(modelLoadProgress * 100)}%` }}
            />
          </div>
          <span>{Math.round(modelLoadProgress * 100)}%</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 font-hud text-[10px] tracking-widest text-muted md:inline-flex">
          <span className={cn("h-1.5 w-1.5 rounded-full", webGpuReady ? "bg-primary" : "bg-muted")} />
          GPU {webGpuReady ? "READY" : "OFF"}
        </span>
        <button
          type="button"
          onClick={onToggleMic}
          className={cn(
            "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border px-3 font-hud text-[11px] tracking-widest transition-colors",
            isListening
              ? "border-alert bg-alert/20 text-alert"
              : "border-primary/40 bg-void text-primary hover:border-primary",
          )}
        >
          {isListening ? <Mic className="size-3.5" /> : <MicOff className="size-3.5" />}
          {isListening ? "MIC ON" : "MIC"}
        </button>
        <button
          type="button"
          onClick={onToggleVoice}
          className={cn(
            "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border px-3 font-hud text-[11px] tracking-widest transition-colors",
            voiceEnabled
              ? "border-primary bg-primary/15 text-primary shadow-glow"
              : "border-line bg-void text-muted hover:text-foreground",
          )}
        >
          {voiceEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
          TTS
        </button>
      </div>
    </div>
  );
}
