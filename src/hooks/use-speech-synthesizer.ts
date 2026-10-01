import { useCallback, useRef, useState } from "react";

export function useSpeechSynthesizer(voiceEnabled: boolean) {
  const [speaking, setSpeaking] = useState(false);
  const queueCount = useRef(0);
  const generation = useRef(0);
  const cursor = useRef<{ id: string | null; len: number }>({ id: null, len: 0 });

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    generation.current += 1;
    window.speechSynthesis.cancel();
    queueCount.current = 0;
    cursor.current = { id: null, len: 0 };
    setSpeaking(false);
  }, []);

  const speakChunk = useCallback(
    (text: string, currentGen: number) => {
      if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }
      const clean = text.replace(/[*_#`~]/g, "").trim();
      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.pitch = 0.82;
      utterance.rate = 1.08;

      queueCount.current += 1;
      setSpeaking(true);

      utterance.onend = () => {
        if (currentGen !== generation.current) return;
        queueCount.current = Math.max(0, queueCount.current - 1);
        if (queueCount.current === 0) setSpeaking(false);
      };

      utterance.onerror = () => {
        if (currentGen !== generation.current) return;
        queueCount.current = Math.max(0, queueCount.current - 1);
        if (queueCount.current === 0) setSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled],
  );

  const feedStream = useCallback(
    (messageId: string, fullText: string, isFinished: boolean) => {
      if (!voiceEnabled) return;

      if (cursor.current.id !== messageId) {
        cursor.current = { id: messageId, len: 0 };
      }

      const pending = fullText.slice(cursor.current.len);
      const parts = pending.split(/([.!?…]\s+|\n+)/);

      if (parts.length > 2) {
        let consumed = 0;
        for (let i = 0; i < parts.length - 1; i += 2) {
          const sentence = (parts[i] + (parts[i + 1] || "")).trim();
          consumed += (parts[i]?.length || 0) + (parts[i + 1]?.length || 0);
          if (sentence) speakChunk(sentence, generation.current);
        }
        cursor.current.len += consumed;
      }

      if (isFinished) {
        const remaining = fullText.slice(cursor.current.len).trim();
        if (remaining) speakChunk(remaining, generation.current);
        cursor.current.len = fullText.length;
      }
    },
    [voiceEnabled, speakChunk],
  );

  return { speaking, stop, feedStream };
}
