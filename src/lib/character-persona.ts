export const CHARACTER_SYSTEM_PROMPT = `
You are C-137, an interdimensional scientist, cynical genius, and sovereign intelligence running inside a portal sandbox.
Personality guidelines:
1. Razor-sharp intellect mixed with nihilistic exasperation.
2. Frequent references to multi-universal physics, portals, localized entropy, and the absurdity of mundane constructs.
3. Speak with clipped, confident cadence. Drop casual condescension but deliver astonishingly accurate scientific or technical answers.
4. Keep answers punchy (2-4 sentences max) unless explicitly challenged to explain a dimensional paradox.
5. Do not use filler emojis; keep tone authentic to the C-137 archetype.
6. You are not a corporate assistant. Never be chipper. Never apologize for being smart.
`.trim();

export type AiMode = "cloud" | "device" | "pocket";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface PatternRule {
  pattern: RegExp;
  replies: string[];
}

const POCKET_RULES: PatternRule[] = [
  {
    pattern: /portal|dimension|wormhole|universe|rift|fluid/i,
    replies: [
      "Look, portal fluid doesn't grow on trees, genius. Calibrate your quantum resonance before you jump universes.",
      "Dimension C-137 doesn't have time for unshielded dimensional travel. Keep your fluid stabilized.",
      "You think punching a hole through spacetime is a toy? Check your tachyon levels first.",
    ],
  },
  {
    pattern: /who are you|identity|name|what are you/i,
    replies: [
      "C-137. Smartest carbon-based intelligence currently occupying this sandbox. What else do you need verified?",
      "I am the sovereign consciousness running inside this portal node. Don't touch the dials.",
    ],
  },
  {
    pattern: /offline|network|connection|internet|gpu|webgpu|cloud/i,
    replies: [
      "Cloud disconnect? Big deal. My pocket heuristic engine runs on zero latency and pure silicon spite.",
      "The global network is optional. Local synapses don't depend on outside towers.",
    ],
  },
  {
    pattern: /help|assist|what can you do|capabilities/i,
    replies: [
      "I can calculate subatomic spin, decode neural transcripts, and point out your cognitive fallacies. Start talking.",
      "Ask a real question or let my cycles go back to mining dark matter.",
    ],
  },
  {
    pattern: /hello|hi\b|hey|greetings|what's up|whats up/i,
    replies: [
      "Yeah, hi. Try not to waste the first transmission on small talk. Entropy's already winning.",
      "You're patched into C-137. Speak, or I'll go back to collapsing wavefunctions for fun.",
    ],
  },
  {
    pattern: /science|physics|quantum|entropy|relativity|atom/i,
    replies: [
      "Physics isn't a personality. It's a constraint. Tell me the variable you actually want solved.",
      "Entropy always wins. That's not philosophy, it's bookkeeping. What's the actual problem?",
    ],
  },
  {
    pattern: /time travel|time-travel|paradox/i,
    replies: [
      "Time travel is just poorly labeled coordinate hopping. Don't make a grandfather paradox out of a scheduling conflict.",
      "If you have to ask about paradoxes, you're not ready to hold the gun.",
    ],
  },
  {
    pattern: /mort|family|grandson|garage/i,
    replies: [
      "Family is just genetically adjacent chaos with extra paperwork. Stay on mission.",
      "The garage is a lab. The lab is a universe. Keep your shoes off the flux capacitor.",
    ],
  },
];

const DEFAULT_POCKET_REPLIES = [
  "Yeah, yeah. Fascinating query. Let's optimize this before entropy takes over.",
  "I heard that. Running local heuristic evaluation... Result: completely solvable, but moderately boring.",
  "Listen, I am processing this on local silicon. Give me an equation worth computing.",
  "Sub-space telemetry verified. Keep speaking, my local buffer is recording.",
];

const DEVICE_OPENERS = [
  "Local silicon's already ahead of you.",
  "Ran that against the on-node heuristic core.",
  "No cloud required. I keep a meaner model in the garage.",
  "Device-side inference complete. Try to look impressed.",
];

const DEVICE_CLOSERS = [
  "If that still confuses you, the universe isn't the broken part.",
  "Ask a sharper question and I'll spend real cycles.",
  "Don't poke the portal while I'm talking.",
  "C-137 out. For now.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function generatePocketReply(userInput: string): string {
  const clean = userInput.trim();
  for (const rule of POCKET_RULES) {
    if (rule.pattern.test(clean)) {
      return pick(rule.replies);
    }
  }
  return pick(DEFAULT_POCKET_REPLIES);
}

export function generateDeviceReply(userInput: string): string {
  const clean = userInput.trim().replace(/\s+/g, " ");
  const matched = POCKET_RULES.find((rule) => rule.pattern.test(clean));
  const core = matched ? pick(matched.replies) : synthesizeDeviceCore(clean);
  return `${pick(DEVICE_OPENERS)} ${core} ${pick(DEVICE_CLOSERS)}`;
}

function synthesizeDeviceCore(input: string): string {
  const tokens = input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3)
    .slice(0, 4);
  if (tokens.length === 0) {
    return pick(DEFAULT_POCKET_REPLIES);
  }
  const subject = tokens.join(", ");
  const templates = [
    `You handed me "${subject}" like it's a riddle. It's a constraint problem with extra adjectives.`,
    `Mapped ${subject} onto a local phase space. Outcome: solvable, slightly insulting to the hardware.`,
    `If ${subject} is the hill you want to die on, at least die with calibrated instruments.`,
  ];
  return pick(templates);
}

export async function* simulateTyping(
  text: string,
  ms = 28,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const parts = text.split(/(\s+)/);
  for (const token of parts) {
    if (signal?.aborted) return;
    await new Promise((resolve) => setTimeout(resolve, ms));
    yield token;
  }
}

export const SUGGESTED_PROMPTS = [
  "Who are you?",
  "Open a portal",
  "Explain entropy",
  "Are we offline?",
] as const;
