export function VortexBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="vortex-core" />
      <div className="vortex-ring vortex-ring-a" />
      <div className="vortex-ring vortex-ring-b" />
      <div className="vortex-ring vortex-ring-c" />
    </div>
  );
}
