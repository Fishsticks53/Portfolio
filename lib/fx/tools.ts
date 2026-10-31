// Cool Tools: a scene and a dock icon for each tool. A tool listed in content/resume.md without a
// scene here still gets a card with its description, so adding a tool never breaks the build.
import { $, qs, qsa, runStage, reducedMotion, listen, all, type Disposer, type Wait } from "./util";
import type { Tool } from "../resume";

type Scene = { icon: string; html: string; run: (w: Wait, win: HTMLElement) => Promise<void> };
const svg = (p: string) => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const press = async (b: HTMLElement, w: Wait) => {
  b.classList.add("press");
  await w(170);
  b.classList.remove("press");
};

const SCENES: Record<string, Scene> = {
  CodePack: {
    icon: svg('<path d="M12 3l8 4v10l-8 4-8-4V7z"/><path d="M4 7l8 4 8-4M12 11v10"/>'),
    html: `<div class="cp"><ul>${[["src/App.tsx", 0], ["node_modules/", 1], ["src/api.ts", 0], ["dist/", 1], ["README.md", 0]].map(([f, x]) => `<li class="${x ? "x" : "k"}"><code>${f}</code><em></em></li>`).join("")}</ul><div class="cp-out" id="cpo">${[75, 90, 55, 80].map((w, i) => `<i style="--i:${i};width:${w}%"></i>`).join("")}<p>Focused bundle</p></div></div>`,
    async run(w, win) {
      await w(800);
      qsa(".cp li", win).forEach((l) => {
        const x = l.classList.contains("x");
        l.classList.add(x ? "ign" : "keep");
        qs("em", l).textContent = x ? "ignored" : "kept";
      });
      await w(900);
      $("cpo").classList.add("on");
      await w(2000);
    },
  },
  AgentSync: {
    icon: svg('<path d="M20 11a8 8 0 0 0-14-4M4 13a8 8 0 0 0 14 4"/><path d="M6 3v4h4M18 21v-4h-4"/>'),
    html: `<div class="ag-row">${[["Claude", [80, 60, 70], "source"], ["Codex", [80, 60, 45], "out of sync"], ["Antigravity", [80, 35, 70], "out of sync"]].map(([a, ws, s]) => `<div class="ag"><b>${a}</b>${(ws as number[]).map((x) => `<i style="--w:${x}%"></i>`).join("")}<em>${s}</em></div>`).join("")}</div>`,
    async run(w, win) {
      const cards = qsa(".ag", win);
      await w(900);
      const src = qsa("i", cards[0])[1];
      src.classList.add("hot");
      src.style.setProperty("--w", "78%");
      qs("em", cards[0]).textContent = "edited";
      cards[0].classList.add("src");
      await w(900);
      cards.slice(1).forEach((c, k) =>
        setTimeout(() => {
          [80, 78, 70].forEach((x, j) => qsa("i", c)[j].style.setProperty("--w", x + "%"));
          c.classList.add("ok");
          qs("em", c).textContent = "aligned";
        }, k * 260));
      await w(2400);
    },
  },
  JSONLab: {
    icon: svg('<path d="M9 4C6 4 6 6 6 8v2c0 1-1 2-2 2 1 0 2 1 2 2v2c0 2 0 4 3 4M15 4c3 0 3 2 3 4v2c0 1 1 2 2 2-1 0-2 1-2 2v2c0 2 0 4-3 4"/>'),
    html: `<div class="jl-tabs">${["Validate", "Format", "Compare", "Query"].map((t) => `<span>${t}</span>`).join("")}</div><pre class="jl" id="jl"></pre><p class="jl-q" id="jq"></p>`,
    async run(w, win) {
      const tabs = qsa(".jl-tabs span", win), jl = $("jl"), jq = $("jq");
      const on = (k: number) => tabs.forEach((t, i) => t.classList.toggle("on", i === k));
      on(0);
      jl.innerHTML = '{"tool": "JSONLab" <span class="err">"local"</span>: true}';
      jq.textContent = "";
      await w(1200);
      jq.textContent = "Expected a comma after the value on line 1.";
      await w(1100);
      on(1);
      jl.textContent = '{\n  "tool": "JSONLab",\n  "local": true,\n  "version": 2\n}';
      jq.textContent = "Valid. Formatted with 2 spaces.";
      await w(1500);
      on(2);
      jl.innerHTML = '{\n  "tool": "JSONLab",\n  "local": true,\n  <span class="hl">"version": 3</span>\n}';
      jq.textContent = "1 value changed: version 2 to 3.";
      await w(1500);
      on(3);
      jl.innerHTML = '{\n  "tool": <span class="hl">"JSONLab"</span>,\n  "local": true,\n  "version": 3\n}';
      jq.textContent = 'Query result for the tool key: "JSONLab"';
      await w(1600);
    },
  },
  "API Key Vault": {
    icon: svg('<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l3 3"/>'),
    html: `<div class="kv" id="kv"><span class="kn">OPENAI_API_KEY</span><code id="kc">••••••••••••••••</code><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path id="shk" d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></div><div class="wh" id="wh"><i class="ring"></i><span id="whT">Windows Hello</span></div><p class="vnote">Encrypted and stored on this machine only.</p>`,
    async run(w) {
      const kv = $("kv"), kc = $("kc"), sh = $("shk"), wh = $("wh"), t = $("whT");
      await w(800);
      wh.classList.add("on", "scan");
      t.textContent = "Windows Hello: looking for you";
      await w(1400);
      wh.classList.remove("scan");
      wh.classList.add("ok");
      t.textContent = "Windows Hello: verified";
      kv.classList.add("open");
      sh.setAttribute("d", "M8 11V8a4 4 0 0 1 7.5-2");
      kc.textContent = "sk-proj-••••••a41f";
      await w(1700);
      kv.classList.remove("open");
      sh.setAttribute("d", "M8 11V8a4 4 0 0 1 8 0v3");
      kc.textContent = "••••••••••••••••";
      wh.classList.remove("on", "ok");
      await w(900);
    },
  },
  PortPilot: {
    icon: svg('<rect x="4" y="8" width="16" height="9" rx="2"/><path d="M8 8V5M12 8V5M16 8V5M8 17v2M16 17v2"/>'),
    html: `<ul class="pm"><li><code>:3000</code><span>node</span><em>listening</em></li><li><code>:5173</code><span>vite</span><em>listening</em></li><li data-k><code>:8000</code><span>uvicorn</span><em>listening</em></li></ul><span class="mini">Stop safely</span>`,
    async run(w, win) {
      const r = qs("[data-k]", win), b = qs(".mini", win);
      await w(800);
      r.classList.add("sel");
      qs("em", r).textContent = "stop this process?";
      await w(900);
      await press(b, w);
      r.classList.remove("sel");
      r.classList.add("gone");
      qs("em", r).textContent = "freed";
      await w(1700);
    },
  },
  MarkItDown: {
    icon: svg('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 15V9l2.5 3L12 9v6M16 9v6m0 0l-2-2m2 2l2-2"/>'),
    html: `<div class="md"><div class="md-doc"><i class="h"></i><i></i><i style="width:88%"></i><i style="width:94%"></i><i style="width:50%"></i><i class="scan"></i></div><pre class="md-out" id="mdo"></pre></div>`,
    async run(w, win) {
      const sc = qs(".scan", win), out = $("mdo");
      await w(800);
      sc.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(118px)", opacity: 1 }], { duration: 1000, easing: "linear", fill: "forwards" });
      for (const l of ["# Meeting notes", "", "Converted on this computer.", "", "- first point", "- second point"]) {
        out.textContent += l + "\n";
        await w(260);
      }
      await w(1900);
    },
  },
  WorkspacePilot: {
    icon: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 10l3 2.5L7 15M12 15h5"/>'),
    html: `<div class="ws"><ul class="ws-list"><li><b>my-project</b></li><li><code>npm run dev</code></li><li><code>uvicorn app:app</code></li><li><code>docker compose up</code></li></ul><div class="ws-stack" id="wss">${["npm run dev", "uvicorn app:app", "docker compose up"].map((c, i) => `<div class="tm" style="--i:${i}">$ ${c}<span class="caret">█</span></div>`).join("")}</div></div><span class="mini">Open together</span>`,
    async run(w, win) {
      await w(1000);
      await press(qs(".mini", win), w);
      $("wss").classList.add("go");
      await w(2900);
    },
  },
  SyncPilot: {
    icon: svg('<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 8v8M18 10c0 4-6 3-6 6"/>'),
    html: `${["api", "web", "tools"].map((r) => `<div class="sy-row"><b>${r}</b><span class="sy-bar"><i></i></span><span class="st">behind 2</span></div>`).join("")}<p class="sy-foot" id="syf"></p>`,
    async run(w, win) {
      await w(700);
      for (const r of qsa(".sy-row", win)) {
        const s = qs(".st", r);
        s.textContent = "clean tree";
        await w(400);
        r.classList.add("go");
        s.textContent = "pulling";
        await w(800);
        r.classList.add("done");
        s.textContent = "up to date";
        await w(150);
      }
      $("syf").textContent = "Running setup commands: npm install";
      await w(1100);
      $("syf").textContent = "Setup finished.";
      await w(1500);
    },
  },
};

const GENERIC: Scene = { icon: svg('<path d="M12 6v12M6 12h12"/>'), html: "", run: (w) => w(3000) };

export function initTools(tools: Tool[], still: boolean): Disposer {
  const win = $("ctWin"), dock = $("ctDock");
  const chips = qsa("[data-tool-chip]");
  const T = tools.map((t) => ({ ...t, ...(SCENES[t.name] ?? GENERIC) }));
  if (!T.length) return () => {};
  let forced: number | null = null;
  let idx = 0;
  dock.innerHTML = T.map((t, i) => `<button class="tl" data-i="${i}" aria-label="${esc(t.name)}" title="${esc(t.name)}">${t.icon}</button>`).join("");
  const tiles = qsa(".tl", dock);
  const show = (i: number) => {
    idx = i;
    win.innerHTML = `<p class="ct-h">${esc(T[i].name)}</p><p class="ct-sub">${esc(T[i].description)}</p>${T[i].html}`;
    tiles.forEach((t, k) => t.classList.toggle("on", k === i));
    chips.forEach((c, k) => c.classList.toggle("on", k === i));
  };
  const ds: Disposer[] = [];
  tiles.forEach((t, i) => ds.push(listen(t, "click", () => (forced = i))));
  chips.forEach((c, i) => ds.push(listen(c, "click", () => (forced = i))));
  if (!still && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    ds.push(listen(dock, "pointermove", (e) =>
      tiles.forEach((t) => {
        const r = t.getBoundingClientRect(), d = (e as PointerEvent).clientX - (r.left + r.width / 2);
        t.style.transform = `scale(${(1 + 0.45 * Math.exp(-(d * d) / (2 * 40 * 40))).toFixed(3)})`;
      })));
    ds.push(listen(dock, "pointerleave", () => tiles.forEach((t) => (t.style.transform = ""))));
  }
  ds.push(runStage($("st-ct"), async (w) => {
    if (forced != null) {
      idx = forced;
      forced = null;
    }
    show(idx);
    const ww: Wait = (ms) => w(ms).then(() => { if (forced != null) throw "skip"; });
    try {
      await T[idx].run(ww, win);
    } catch (e) {
      if (e !== "skip") throw e;
      return;
    }
    idx = (idx + 1) % T.length;
  }, () => show(0), still));
  return all(...ds);
}
