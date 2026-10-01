export async function isWebGPUSupported(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) return false;
  try {
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu;
    if (!gpu) return false;
    const adapter = await gpu.requestAdapter();
    return Boolean(adapter);
  } catch {
    return false;
  }
}
