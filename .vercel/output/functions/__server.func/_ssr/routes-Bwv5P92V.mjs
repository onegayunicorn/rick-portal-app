import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trash2, c as MicOff, l as Cpu, n as VolumeX, o as Send, r as Volume2, s as Mic, t as Zap, u as Cloud } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as generatePocketReply, i as generateDeviceReply, n as CHARACTER_SYSTEM_PROMPT, o as simulateTyping, r as SUGGESTED_PROMPTS } from "./router-BKB1Hhm7.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bwv5P92V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ScanlineOverlay() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scanlines pointer-events-none absolute inset-0 z-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette pointer-events-none absolute inset-0 z-20" })] });
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
	return `c137-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function Waveform({ active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-5 items-end gap-0.5",
		"aria-hidden": "true",
		children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("w-0.5 rounded-full bg-primary/80", active ? "wave-bar" : "h-1 opacity-40"),
			style: active ? { animationDelay: `${i * 70}ms` } : void 0
		}, i))
	});
}
var STATUS = {
	idle: "STANDBY",
	thinking: "COMPUTING",
	talking: "TRANSMITTING"
};
function CharacterStage({ state, clips, posterUrl, telemetry }) {
	const videoRefs = (0, import_react.useRef)({
		idle: null,
		thinking: null,
		talking: null
	});
	(0, import_react.useEffect)(() => {
		const activeVideo = videoRefs.current[state];
		if (activeVideo) {
			if (state !== "idle") activeVideo.currentTime = 0;
			activeVideo.play().catch(() => {});
		}
		const timer = window.setTimeout(() => {
			Object.keys(videoRefs.current).forEach((key) => {
				if (key !== state) videoRefs.current[key]?.pause();
			});
		}, 550);
		return () => window.clearTimeout(timer);
	}, [state]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "portal-frame relative mx-auto aspect-[5/9] w-full max-w-[380px] overflow-hidden rounded-3xl bg-surface stage-frame",
		children: [
			Object.keys(clips).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: (el) => {
					videoRefs.current[key] = el;
				},
				src: clips[key],
				poster: posterUrl,
				muted: true,
				loop: true,
				playsInline: true,
				autoPlay: key === "idle",
				preload: "auto",
				className: cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out", state === key ? "z-10 opacity-100" : "z-0 opacity-0")
			}, key)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanlineOverlay, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-3 z-30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hud-corner hud-corner-tl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hud-corner hud-corner-tr" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hud-corner hud-corner-bl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hud-corner hud-corner-br" })
				]
			}),
			telemetry && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute left-3 top-3 z-30 rounded-md border border-primary/30 bg-void/80 px-2.5 py-1 font-hud text-[11px] tracking-widest text-primary shadow-glow",
				children: [
					"STATUS · ",
					telemetry.stability.toFixed(1),
					"% · ",
					telemetry.resonance,
					" HZ"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between gap-2 rounded-full border border-primary/30 bg-void/80 px-3 py-1.5 font-hud text-[11px] tracking-widest text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2.5 w-2.5 rounded-full", state === "idle" && "bg-primary", state === "thinking" && "bg-accent animate-pulse", state === "talking" && "bg-alert animate-ping") }), STATUS[state]]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waveform, { active: state !== "idle" })]
			})] })
		]
	});
}
function ChatPanel({ messages, input, onInput, onSend, onClear, busy }) {
	const scroller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-[280px] flex-col rounded-3xl border border-primary/25 bg-surface/80 p-3 backdrop-blur-md md:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hud text-[11px] tracking-[0.22em] text-primary",
					children: "LIVE TRANSCRIPT"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Talk to the twin. Cloud, device, or pocket core."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClear,
					disabled: messages.length === 0,
					className: "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:text-foreground disabled:opacity-30",
					"aria-label": "Clear transcript",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scroller,
				className: "min-h-0 flex-1 space-y-3 overflow-y-auto pr-1",
				children: messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col items-center justify-center gap-4 px-2 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xs font-hud text-[11px] leading-relaxed tracking-widest text-muted",
						children: "AWAITING AUDIO TRANSCRIPTION OR TEXT TELEMETRY"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap justify-center gap-2",
						children: SUGGESTED_PROMPTS.map((prompt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onSend(prompt),
							className: "min-h-11 rounded-full border border-primary/30 bg-void px-3 py-2 font-hud text-[10px] tracking-widest text-primary transition-colors hover:border-primary",
							children: prompt
						}, prompt))
					})]
				}) : messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("max-w-[92%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed", m.role === "user" ? "ml-auto border border-primary/35 bg-primary/10 text-primary" : "mr-auto border border-line bg-void/70 text-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 font-hud text-[10px] tracking-widest text-muted",
						children: m.role === "user" ? "OBSERVER" : "C-137"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "select-text whitespace-pre-wrap",
						children: m.content || (busy ? "…" : "")
					})]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex items-end gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					onSend();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "sr-only",
						htmlFor: "c137-input",
						children: "Transmit inquiry"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "c137-input",
						value: input,
						onChange: (e) => onInput(e.target.value),
						placeholder: "Transmit inquiry to C-137...",
						autoComplete: "off",
						className: "min-h-11 flex-1 rounded-xl border border-primary/30 bg-void px-3 py-2 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted focus:border-primary focus:shadow-glow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy || !input.trim(),
						className: "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-primary px-3 text-void transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-40",
						"aria-label": "Send",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})
				]
			})
		]
	});
}
var MODES = [
	{
		id: "cloud",
		label: "Cloud Edge",
		icon: Cloud
	},
	{
		id: "device",
		label: "Device GPU",
		icon: Cpu
	},
	{
		id: "pocket",
		label: "Pocket Rule",
		icon: Zap
	}
];
function CyberHUD({ mode, onModeChange, voiceEnabled, onToggleVoice, isListening, onToggleMic, webGpuReady, modelLoadProgress, online, cloudLocked = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex w-full flex-col gap-3 rounded-2xl border border-primary/25 bg-surface/90 p-3 backdrop-blur-md md:flex-row md:items-center md:justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1.5 rounded-xl border border-primary/20 bg-void/50 p-1",
				children: MODES.map((item) => {
					const Icon = item.icon;
					const disabled = item.id === "cloud" && !online;
					const active = mode === item.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled,
						title: item.id === "device" ? webGpuReady ? "Run locally on-device" : "WebGPU unavailable — local heuristic core still runs" : item.id === "cloud" && cloudLocked ? "Cloud edge quota-locked — pocket core will answer" : item.id === "cloud" && !online ? "Offline — cloud edge unavailable" : item.label,
						onClick: () => onModeChange(item.id),
						className: cn("inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 font-hud text-[11px] tracking-widest transition-colors md:flex-none", active && item.id === "cloud" && "bg-primary text-void shadow-glow", active && item.id === "device" && "bg-accent text-void shadow-cyan", active && item.id === "pocket" && "bg-alert text-alert-fg shadow-alert", !active && "text-muted hover:text-foreground", disabled && "cursor-not-allowed opacity-40"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), item.id === "cloud" && cloudLocked ? "Cloud Lock" : item.label]
					}, item.id);
				})
			}),
			typeof modelLoadProgress === "number" && modelLoadProgress < 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 font-hud text-[10px] tracking-widest text-accent",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MODEL SYNC" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 w-20 overflow-hidden rounded-full bg-void",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-accent transition-[width] duration-300",
							style: { width: `${Math.round(modelLoadProgress * 100)}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Math.round(modelLoadProgress * 100), "%"] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden items-center gap-1.5 font-hud text-[10px] tracking-widest text-muted md:inline-flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 w-1.5 rounded-full", webGpuReady ? "bg-primary" : "bg-muted") }),
							"GPU ",
							webGpuReady ? "READY" : "OFF"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onToggleMic,
						className: cn("inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border px-3 font-hud text-[11px] tracking-widest transition-colors", isListening ? "border-alert bg-alert/20 text-alert" : "border-primary/40 bg-void text-primary hover:border-primary"),
						children: [isListening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-3.5" }), isListening ? "MIC ON" : "MIC"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onToggleVoice,
						className: cn("inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border px-3 font-hud text-[11px] tracking-widest transition-colors", voiceEnabled ? "border-primary bg-primary/15 text-primary shadow-glow" : "border-line bg-void text-muted hover:text-foreground"),
						children: [voiceEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-3.5" }), "TTS"]
					})
				]
			})
		]
	});
}
function VortexBackdrop() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed inset-0 z-0 overflow-hidden",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vortex-core" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vortex-ring vortex-ring-a" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vortex-ring vortex-ring-b" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vortex-ring vortex-ring-c" })
		]
	});
}
function useAudioRecorder(onTranscript) {
	const [isRecording, setIsRecording] = (0, import_react.useState)(false);
	const recognitionRef = (0, import_react.useRef)(null);
	const stop = (0, import_react.useCallback)(() => {
		if (recognitionRef.current) {
			recognitionRef.current.onend = null;
			recognitionRef.current.stop();
			recognitionRef.current = null;
		}
		setIsRecording(false);
	}, []);
	const start = (0, import_react.useCallback)(async () => {
		if (typeof window === "undefined") return;
		const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
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
				if (e.error && e.error !== "aborted") toast.error("Microphone channel dropped.");
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
	return {
		isRecording,
		start,
		stop,
		toggle: (0, import_react.useCallback)(() => {
			if (isRecording) stop();
			else start();
		}, [
			isRecording,
			start,
			stop
		])
	};
}
function useSpeechSynthesizer(voiceEnabled) {
	const [speaking, setSpeaking] = (0, import_react.useState)(false);
	const queueCount = (0, import_react.useRef)(0);
	const generation = (0, import_react.useRef)(0);
	const cursor = (0, import_react.useRef)({
		id: null,
		len: 0
	});
	const stop = (0, import_react.useCallback)(() => {
		if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
		generation.current += 1;
		window.speechSynthesis.cancel();
		queueCount.current = 0;
		cursor.current = {
			id: null,
			len: 0
		};
		setSpeaking(false);
	}, []);
	const speakChunk = (0, import_react.useCallback)((text, currentGen) => {
		if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
		const clean = text.replace(/[*_#`~]/g, "").trim();
		if (!clean) return;
		const utterance = new SpeechSynthesisUtterance(clean);
		utterance.pitch = .82;
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
	}, [voiceEnabled]);
	return {
		speaking,
		stop,
		feedStream: (0, import_react.useCallback)((messageId, fullText, isFinished) => {
			if (!voiceEnabled) return;
			if (cursor.current.id !== messageId) cursor.current = {
				id: messageId,
				len: 0
			};
			const parts = fullText.slice(cursor.current.len).split(/([.!?…]\s+|\n+)/);
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
		}, [voiceEnabled, speakChunk])
	};
}
var CloudEdgeError = class extends Error {
	code;
	constructor(message, code) {
		super(message);
		this.name = "CloudEdgeError";
		this.code = code;
	}
};
var cloudLocked = false;
function isCloudLocked() {
	return cloudLocked;
}
function historyPayload(messages) {
	return messages.slice(-12).map((m) => ({
		role: m.role,
		content: m.content.slice(0, 4e3)
	}));
}
async function streamLocal(text, handlers, delay = 28) {
	for await (const chunk of simulateTyping(text, delay, handlers.signal)) handlers.onDelta(chunk);
}
async function streamCloud(messages, handlers) {
	const res = await fetch("/api/chat", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			system: CHARACTER_SYSTEM_PROMPT,
			messages: historyPayload(messages)
		}),
		signal: handlers.signal
	});
	if (!res.ok || !res.body) {
		let code = "upstream";
		try {
			const body = await res.json();
			if (body.code) code = body.code;
		} catch {}
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
				const delta = JSON.parse(data).choices?.[0]?.delta?.content;
				if (delta) handlers.onDelta(delta);
			} catch {}
		}
	}
}
async function streamAssistantReply(options) {
	const { mode, messages, userText, handlers } = options;
	let resolved = mode;
	if (resolved === "cloud" && typeof navigator !== "undefined" && !navigator.onLine) resolved = "pocket";
	if (resolved === "cloud" && cloudLocked) resolved = "pocket";
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
		if (err instanceof CloudEdgeError && (err.code === "quota" || err.code === "unavailable")) cloudLocked = true;
		await streamLocal(generatePocketReply(userText), handlers, 16);
		return "pocket";
	}
}
async function isWebGPUSupported() {
	if (typeof navigator === "undefined" || !("gpu" in navigator)) return false;
	try {
		const gpu = navigator.gpu;
		if (!gpu) return false;
		const adapter = await gpu.requestAdapter();
		return Boolean(adapter);
	} catch {
		return false;
	}
}
var CLIPS = {
	idle: "/media/character-idle.mp4",
	thinking: "/media/character-thinking.mp4",
	talking: "/media/character-talking.mp4"
};
var POSTER = "/character-poster.jpg";
var STORAGE_KEY = "c137-portal-state";
function loadPersist() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function PortalConsole() {
	const [mode, setMode] = (0, import_react.useState)("cloud");
	const [voiceEnabled, setVoiceEnabled] = (0, import_react.useState)(true);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [webGpuReady, setWebGpuReady] = (0, import_react.useState)(false);
	const [online, setOnline] = (0, import_react.useState)(true);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [cloudLocked, setCloudLocked] = (0, import_react.useState)(false);
	const [telemetry, setTelemetry] = (0, import_react.useState)({
		stability: 99.4,
		resonance: 1207
	});
	const abortRef = (0, import_react.useRef)(null);
	const allowSpeak = (0, import_react.useRef)(false);
	const { speaking, stop: stopSpeech, feedStream } = useSpeechSynthesizer(voiceEnabled);
	const sendText = (0, import_react.useCallback)(async (raw) => {
		const text = raw.trim();
		if (!text || status !== "idle") return;
		stopSpeech();
		allowSpeak.current = true;
		const userMsg = {
			id: uid(),
			role: "user",
			content: text
		};
		const assistantId = uid();
		const assistantMsg = {
			id: assistantId,
			role: "assistant",
			content: ""
		};
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
						setMessages((prev) => prev.map((m) => m.id === assistantId ? {
							...m,
							content: assembled
						} : m));
					}
				}
			});
			if (isCloudLocked()) setCloudLocked(true);
			if (used !== mode && mode === "cloud") toast.message("Cloud edge dropped. Pocket core took over.");
		} catch (err) {
			if (err.name === "AbortError") return;
			setMessages((prev) => prev.map((m) => m.id === assistantId && !m.content ? {
				...m,
				content: "Channel collapsed. Try pocket mode or transmit again."
			} : m));
		} finally {
			setStatus("idle");
			abortRef.current = null;
		}
	}, [
		messages,
		mode,
		status,
		stopSpeech
	]);
	const { isRecording, toggle: toggleMic } = useAudioRecorder((transcript) => {
		sendText(transcript);
	});
	(0, import_react.useEffect)(() => {
		const saved = loadPersist();
		if (saved) {
			if (saved.mode) setMode(saved.mode);
			if (typeof saved.voiceEnabled === "boolean") setVoiceEnabled(saved.voiceEnabled);
			if (Array.isArray(saved.messages)) setMessages(saved.messages);
		}
		setOnline(navigator.onLine);
		setHydrated(true);
		isWebGPUSupported().then(setWebGpuReady);
	}, []);
	(0, import_react.useEffect)(() => {
		const on = () => setOnline(true);
		const off = () => setOnline(false);
		window.addEventListener("online", on);
		window.addEventListener("offline", off);
		return () => {
			window.removeEventListener("online", on);
			window.removeEventListener("offline", off);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const timer = window.setInterval(() => {
			setTelemetry({
				stability: 98.8 + Math.random() * 1.1,
				resonance: 1180 + Math.floor(Math.random() * 90)
			});
		}, 1800);
		return () => window.clearInterval(timer);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({
				mode,
				voiceEnabled,
				messages: messages.slice(-40)
			}));
		} catch {}
	}, [
		hydrated,
		mode,
		voiceEnabled,
		messages
	]);
	const lastMessage = messages[messages.length - 1];
	(0, import_react.useEffect)(() => {
		if (!allowSpeak.current) return;
		if (!lastMessage || lastMessage.role !== "assistant") return;
		feedStream(lastMessage.id, lastMessage.content, status !== "streaming");
	}, [
		lastMessage,
		status,
		feedStream
	]);
	(0, import_react.useEffect)(() => {
		return () => abortRef.current?.abort();
	}, []);
	const characterState = (0, import_react.useMemo)(() => {
		if (status === "submitted" || status === "streaming") return speaking ? "talking" : "thinking";
		if (speaking) return "talking";
		return "idle";
	}, [status, speaking]);
	const handleSend = (preset) => {
		sendText(preset ?? input);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VortexBackdrop, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:px-8 md:py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between gap-3 border-b border-primary/20 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "flex items-center gap-2 font-hud text-lg font-medium tracking-[0.22em] text-primary md:text-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-2.5 rounded-full bg-primary shadow-glow" }), "SOVEREIGN C-137 PORTAL"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Talk to your twin. Tri-modal intelligence node."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right font-hud text-[10px] tracking-widest text-muted md:text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "NODE · DIMENSION-C137" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: online ? "text-primary" : "text-alert",
							children: online ? "UPLINK LIVE" : "UPLINK DARK"
						})]
					})]
				}),
				cloudLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl border border-accent/30 bg-void/70 px-3 py-2 font-hud text-[11px] tracking-widest text-accent",
					children: "CLOUD EDGE QUOTA-LOCKED · POCKET CORE IS ANSWERING"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid flex-1 grid-cols-1 items-stretch gap-4 md:grid-cols-[minmax(0,420px)_1fr] md:gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CharacterStage, {
						state: characterState,
						clips: CLIPS,
						posterUrl: POSTER,
						telemetry
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, {
						messages,
						input,
						onInput: setInput,
						onSend: handleSend,
						onClear: () => {
							stopSpeech();
							abortRef.current?.abort();
							allowSpeak.current = false;
							setMessages([]);
							setStatus("idle");
						},
						busy: status !== "idle"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "safe-footer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CyberHUD, {
						mode,
						onModeChange: setMode,
						voiceEnabled,
						onToggleVoice: () => {
							if (voiceEnabled) stopSpeech();
							setVoiceEnabled(!voiceEnabled);
						},
						isListening: isRecording,
						onToggleMic: toggleMic,
						webGpuReady,
						online,
						cloudLocked
					})
				})
			]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalConsole, {});
}
//#endregion
export { Home as component };
