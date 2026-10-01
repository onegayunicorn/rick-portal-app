import { i as __toESM } from "../_runtime.mjs";
import { _ as lazyRouteComponent, b as useRouter, f as Scripts, g as Outlet, h as createRouter, p as HeadContent, q as require_react, v as createFileRoute, x as require_jsx_runtime, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as object, i as number, n as array, o as string, r as literal, s as union, t as _enum } from "../_libs/zod.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BKB1Hhm7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-alert",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-hud text-lg tracking-widest text-primary",
				children: "CHANNEL COLLAPSE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-B9t5-aVh.css";
var APP_NAME = "C-137 Sovereign Portal";
var Route$2 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Interactive sovereign AI avatar portal with tri-modal intelligence — cloud edge, on-device core, and pocket heuristics."
			},
			{
				name: "theme-color",
				content: "#00ff88"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-background text-foreground antialiased",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					theme: "dark",
					position: "top-center",
					toastOptions: { className: "font-hud tracking-widest text-xs" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter = () => import("./routes-Bwv5P92V.mjs");
var Route$1 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var CHARACTER_SYSTEM_PROMPT = `
You are C-137, an interdimensional scientist, cynical genius, and sovereign intelligence running inside a portal sandbox.
Personality guidelines:
1. Razor-sharp intellect mixed with nihilistic exasperation.
2. Frequent references to multi-universal physics, portals, localized entropy, and the absurdity of mundane constructs.
3. Speak with clipped, confident cadence. Drop casual condescension but deliver astonishingly accurate scientific or technical answers.
4. Keep answers punchy (2-4 sentences max) unless explicitly challenged to explain a dimensional paradox.
5. Do not use filler emojis; keep tone authentic to the C-137 archetype.
6. You are not a corporate assistant. Never be chipper. Never apologize for being smart.
`.trim();
var POCKET_RULES = [
	{
		pattern: /portal|dimension|wormhole|universe|rift|fluid/i,
		replies: [
			"Look, portal fluid doesn't grow on trees, genius. Calibrate your quantum resonance before you jump universes.",
			"Dimension C-137 doesn't have time for unshielded dimensional travel. Keep your fluid stabilized.",
			"You think punching a hole through spacetime is a toy? Check your tachyon levels first."
		]
	},
	{
		pattern: /who are you|identity|name|what are you/i,
		replies: ["C-137. Smartest carbon-based intelligence currently occupying this sandbox. What else do you need verified?", "I am the sovereign consciousness running inside this portal node. Don't touch the dials."]
	},
	{
		pattern: /offline|network|connection|internet|gpu|webgpu|cloud/i,
		replies: ["Cloud disconnect? Big deal. My pocket heuristic engine runs on zero latency and pure silicon spite.", "The global network is optional. Local synapses don't depend on outside towers."]
	},
	{
		pattern: /help|assist|what can you do|capabilities/i,
		replies: ["I can calculate subatomic spin, decode neural transcripts, and point out your cognitive fallacies. Start talking.", "Ask a real question or let my cycles go back to mining dark matter."]
	},
	{
		pattern: /hello|hi\b|hey|greetings|what's up|whats up/i,
		replies: ["Yeah, hi. Try not to waste the first transmission on small talk. Entropy's already winning.", "You're patched into C-137. Speak, or I'll go back to collapsing wavefunctions for fun."]
	},
	{
		pattern: /science|physics|quantum|entropy|relativity|atom/i,
		replies: ["Physics isn't a personality. It's a constraint. Tell me the variable you actually want solved.", "Entropy always wins. That's not philosophy, it's bookkeeping. What's the actual problem?"]
	},
	{
		pattern: /time travel|time-travel|paradox/i,
		replies: ["Time travel is just poorly labeled coordinate hopping. Don't make a grandfather paradox out of a scheduling conflict.", "If you have to ask about paradoxes, you're not ready to hold the gun."]
	},
	{
		pattern: /mort|family|grandson|garage/i,
		replies: ["Family is just genetically adjacent chaos with extra paperwork. Stay on mission.", "The garage is a lab. The lab is a universe. Keep your shoes off the flux capacitor."]
	}
];
var DEFAULT_POCKET_REPLIES = [
	"Yeah, yeah. Fascinating query. Let's optimize this before entropy takes over.",
	"I heard that. Running local heuristic evaluation... Result: completely solvable, but moderately boring.",
	"Listen, I am processing this on local silicon. Give me an equation worth computing.",
	"Sub-space telemetry verified. Keep speaking, my local buffer is recording."
];
var DEVICE_OPENERS = [
	"Local silicon's already ahead of you.",
	"Ran that against the on-node heuristic core.",
	"No cloud required. I keep a meaner model in the garage.",
	"Device-side inference complete. Try to look impressed."
];
var DEVICE_CLOSERS = [
	"If that still confuses you, the universe isn't the broken part.",
	"Ask a sharper question and I'll spend real cycles.",
	"Don't poke the portal while I'm talking.",
	"C-137 out. For now."
];
function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
function generatePocketReply(userInput) {
	const clean = userInput.trim();
	for (const rule of POCKET_RULES) if (rule.pattern.test(clean)) return pick(rule.replies);
	return pick(DEFAULT_POCKET_REPLIES);
}
function generateDeviceReply(userInput) {
	const clean = userInput.trim().replace(/\s+/g, " ");
	const matched = POCKET_RULES.find((rule) => rule.pattern.test(clean));
	const core = matched ? pick(matched.replies) : synthesizeDeviceCore(clean);
	return `${pick(DEVICE_OPENERS)} ${core} ${pick(DEVICE_CLOSERS)}`;
}
function synthesizeDeviceCore(input) {
	const tokens = input.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3).slice(0, 4);
	if (tokens.length === 0) return pick(DEFAULT_POCKET_REPLIES);
	const subject = tokens.join(", ");
	return pick([
		`You handed me "${subject}" like it's a riddle. It's a constraint problem with extra adjectives.`,
		`Mapped ${subject} onto a local phase space. Outcome: solvable, slightly insulting to the hardware.`,
		`If ${subject} is the hill you want to die on, at least die with calibrated instruments.`
	]);
}
async function* simulateTyping(text, ms = 28, signal) {
	const parts = text.split(/(\s+)/);
	for (const token of parts) {
		if (signal?.aborted) return;
		await new Promise((resolve) => setTimeout(resolve, ms));
		yield token;
	}
}
var SUGGESTED_PROMPTS = [
	"Who are you?",
	"Open a portal",
	"Explain entropy",
	"Are we offline?"
];
var ChatRequest = object({
	system: string().max(4e3).optional(),
	messages: array(object({
		role: _enum([
			"user",
			"assistant",
			"system"
		]),
		content: string().max(4e3)
	})).min(1).max(24)
});
var Route = createFileRoute("/api/chat")({ server: { handlers: { POST: async ({ request }) => {
	const apiKey = process.env.XAI_API_KEY?.trim();
	if (!apiKey) return Response.json({
		error: "AI is not available in this environment",
		code: "unavailable"
	}, { status: 503 });
	let json;
	try {
		json = await request.json();
	} catch {
		return Response.json({ error: "Invalid JSON" }, { status: 400 });
	}
	const parsed = ChatRequest.safeParse(json);
	if (!parsed.success) return Response.json({ error: "Invalid payload" }, { status: 400 });
	const { messages, system } = parsed.data;
	const last = messages[messages.length - 1];
	if (!last || last.role !== "user" || !last.content.trim()) return Response.json({ error: "Expected a user message" }, { status: 400 });
	const upstream = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			stream: true,
			temperature: .8,
			max_tokens: 320,
			messages: [{
				role: "system",
				content: system || CHARACTER_SYSTEM_PROMPT
			}, ...messages.map((m) => ({
				role: m.role,
				content: m.content
			}))]
		}),
		signal: request.signal
	});
	if (!upstream.ok || !upstream.body) {
		const detail = await upstream.text().catch(() => "");
		const quota = upstream.status === 403 || /spending-limit|credits/i.test(detail);
		return Response.json({
			error: quota ? "Cloud edge is quota-locked" : `xAI API error ${upstream.status}`,
			code: quota ? "quota" : "upstream"
		}, { status: quota ? 503 : 502 });
	}
	return new Response(upstream.body, { headers: {
		"Content-Type": "text/event-stream; charset=utf-8",
		"Cache-Control": "no-cache, no-transform",
		Connection: "keep-alive",
		"X-Accel-Buffering": "no"
	} });
} } } });
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$2
	}),
	ApiChatRoute: Route.update({
		id: "/api/chat",
		path: "/api/chat",
		getParentRoute: () => Route$2
	})
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		scrollRestoration: true
	});
}
//#endregion
export { generatePocketReply as a, generateDeviceReply as i, CHARACTER_SYSTEM_PROMPT as n, simulateTyping as o, SUGGESTED_PROMPTS as r, router_exports as t };
