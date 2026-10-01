import { cn } from "@/lib/utils";

export function Waveform({ active }: { active: boolean }) {
  return (
    <div
      className="flex h-5 items-end gap-0.5"
      aria-hidden="true"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-0.5 rounded-full bg-primary/80",
            active ? "wave-bar" : "h-1 opacity-40",
          )}
          style={
            active
              ? { animationDelay: `${i * 70}ms` }
              : undefined
          }
        />
      ))}
    </div>
  );
}
