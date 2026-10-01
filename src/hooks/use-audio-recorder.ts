import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type SpeechRec = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function useAudioRecorder(onTranscript: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRec | null>(null);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const start = useCallback(async () => {
    if (typeof window === "undefined") return;

    const Ctor =
      (
        window as Window & {
          SpeechRecognition?: new () => SpeechRec;
          webkitSpeechRecognition?: new () => SpeechRec;
        }
      ).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: new () => SpeechRec }).webkitSpeechRecognition;

    if (!Ctor) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const recognition = new Ctor();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) onTranscript(transcript);
      };

      recognition.onerror = (e) => {
        if (e.error && e.error !== "aborted") {
          toast.error("Microphone channel dropped.");
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        recognitionRef.current = null;
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch {
      toast.error("Microphone permission denied.");
      setIsRecording(false);
    }
  }, [onTranscript]);

  const toggle = useCallback(() => {
    if (isRecording) stop();
    else void start();
  }, [isRecording, start, stop]);

  return { isRecording, start, stop, toggle };
}
