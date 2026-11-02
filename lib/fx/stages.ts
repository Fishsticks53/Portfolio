// The five project demos. The server renders each one in its finished state; these effects replay
// the story while a demo is on screen. All examples are synthetic and labelled as such on the page.
import { $, qs, qsa, all, runStage, reducedMotion, type Disposer, type Wait } from "./util";
import { initTools } from "./tools";
import type { Tool } from "../resume";

const el = (id: string) => document.getElementById(id) as HTMLElement;

/* Gatekeeper: a beam sweeps the file and each analyzer flags what it really finds */
const GK_FLAGS: Record<number, "eslint" | "knip" | "dep" | "dup"> = { 2: "eslint", 5: "knip", 10: "dep", 12: "dup" };
const GK_CHIP = {
  eslint: ["ESLint", "no-unused-vars", "#8c93ff"],
  knip: ["Knip", "unused export", "#35d6c0"],
  dep: ["dependency-cruiser", "circular dependency", "#f0b45a"],
  dup: ["jscpd", "duplicated block", "#ff8aa0"],
} as const;
const GK_DONE = "4 findings, each with its evidence. Saved to compare with the next run.";

function gatekeeper(still: boolean): Disposer {
  const code = el("gkCode"), beam = el("gkBeam"), found = el("gkFound"), sum = el("gkSum");
  const rows = qsa(".cl", code);
  const flag = (f: keyof typeof GK_CHIP, n: number) => {
    (f === "dup" ? [7, 8, 11, 12] : [n]).forEach((k) => rows[k - 1].classList.add("f-" + f));
    const [tool, what, color] = GK_CHIP[f];
    const li = document.createElement("li");
    li.style.setProperty("--c", color);
    li.innerHTML = "<i></i>";
    li.append(tool + " ");
    const span = document.createElement("span");
    span.textContent = what;
    li.append(span);
    found.append(li);
  };
  const reset = () => {
    rows.forEach((r) => (r.className = "cl"));
    found.innerHTML = "";
    sum.className = "gk-sum";
    sum.textContent = "";
  };
  const finish = () => {
    reset();
    Object.entries(GK_FLAGS).forEach(([n, f]) => flag(f, +n));
    sum.textContent = GK_DONE;
    sum.classList.add("on");
  };
  return runStage(el("st-gk"), async (w) => {
    reset();
    await w(700);
    const H = code.clientHeight;
    beam.animate([{ transform: "translateY(0)", opacity: 0 }, { opacity: 1, offset: 0.05 }, { opacity: 1, offset: 0.95 }, { transform: `translateY(${H - 2}px)`, opacity: 0 }], { duration: 12 * 340, easing: "linear", fill: "forwards" });
    for (let n = 1; n <= 12; n++) {
      await w(340);
      if (GK_FLAGS[n]) flag(GK_FLAGS[n], n);
    }
    await w(300);
    sum.textContent = GK_DONE;
    sum.classList.add("on");
    await w(3400);
  }, finish, still);
}

/* CARESUM: draft, verify sentence by sentence, repair what fails */
const CS_NOTE = ["Reports headache for two days.", "Reports fatigue.", "Temperature recorded at 38 °C."];
const CS_FIX = "No fever reported.";
const MARK = '<i class="mk"><svg class="s-ok" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg><svg class="s-bad" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8"/></svg></i>';

function caresum(still: boolean): Disposer {
  const note = el("csNote"), talk = qsa("#csTalk p"), steps = qsa("#csSteps span");
  const order = ["g", "v", "j"];
  const step = (k: string) => steps.forEach((s) => s.classList.toggle("on", order.indexOf(s.dataset.s!) <= order.indexOf(k)));
  const row = () => {
    const p = document.createElement("p");
    p.className = "ns";
    p.innerHTML = `<span class="tx"></span>${MARK}`;
    return p;
  };
  const tx = (p: HTMLElement) => qs(".tx", p);
  const type = async (e: HTMLElement, t: string, w: Wait) => {
    e.textContent = "";
    for (const c of t) {
      e.textContent += c;
      await w(15);
    }
  };
  const finish = () => {
    note.innerHTML = "";
    CS_NOTE.forEach((t, i) => {
      const p = row();
      tx(p).textContent = i === 2 ? CS_FIX : t;
      p.classList.add("ok");
      note.append(p);
    });
    steps.forEach((s) => s.classList.add("on"));
    talk.forEach((p) => (p.className = ""));
  };
  return runStage(el("st-cs"), async (w) => {
    note.innerHTML = "";
    talk.forEach((p) => (p.className = "off"));
    steps.forEach((s) => s.classList.remove("on"));
    await w(500);
    step("g");
    for (const p of talk) {
      p.className = "";
      await w(380);
    }
    await w(300);
    const rs = CS_NOTE.map(() => {
      const r = row();
      note.append(r);
      return r;
    });
    for (let i = 0; i < 3; i++) {
      await type(tx(rs[i]), CS_NOTE[i], w);
      await w(120);
    }
    await w(450);
    step("v");
    for (let i = 0; i < 3; i++) {
      const r = rs[i];
      r.classList.add("chk");
      await w(540);
      r.classList.remove("chk");
      if (i < 2) r.classList.add("ok");
      else {
        r.classList.add("bad");
        talk[3].classList.add("ev");
        await w(1100);
      }
    }
    await w(300);
    step("j");
    rs[2].classList.add("old");
    await w(700);
    rs[2].classList.remove("bad", "old");
    await type(tx(rs[2]), CS_FIX, w);
    rs[2].classList.add("ok");
    talk[3].classList.remove("ev");
    await w(3200);
  }, finish, still);
}

/* ReviewOp + FACET: implicit aspects find their prototype; an unseen aspect founds a new group */
const PROTOS = [
  { n: "Battery", x: 130, y: 120, c: "#8c93ff" },
  { n: "Screen", x: 395, y: 105, c: "#35d6c0" },
  { n: "Delivery", x: 125, y: 245, c: "#f0b45a" },
  { n: "Price", x: 400, y: 240, c: "#ff8aa0" },
];
const REVIEWS: [text: string, mark: string, proto: number, caption: string][] = [
  ["It never needed charging all week.", "never needed charging", 0, "Implicit aspect, nearest prototype: Battery"],
  ["Arrived in two days, no fuss.", "Arrived in two days", 2, "Implicit aspect, nearest prototype: Delivery"],
];
const UNSEEN: [string, string] = ["The strap rubbed my wrist raw.", "strap rubbed my wrist"];
const NEW_CAPTION = "FACET groups it as a new aspect, no domain label needed.";
const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

function reviewop(still: boolean): Disposer {
  const svg = el("roSvg") as unknown as SVGSVGElement, rev = el("roRev"), cap = el("roCap"), tags = qsa("#roTags span");
  let seed = 1;
  const points = (cx: number, cy: number, c: string, n: number, rad: number, cls = "") =>
    Array.from({ length: n }, () => {
      const a = rnd(seed++) * 6.283, r = 10 + rnd(seed++) * rad;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      const dx = (rnd(seed++) * 8 - 4).toFixed(1), dy = (rnd(seed++) * 8 - 4).toFixed(1), dur = (3 + rnd(seed++) * 3).toFixed(1), dl = (rnd(seed++) * 4).toFixed(1);
      return `<g class="pt ${cls}" style="transform:translate(${x.toFixed(1)}px,${y.toFixed(1)}px)"><circle r="3.2" fill="${c}" style="--dx:${dx}px;--dy:${dy}px;--dur:${dur}s;--dl:-${dl}s"/></g>`;
    }).join("");
  svg.innerHTML =
    PROTOS.map((p, i) => `<g data-i="${i}"><circle class="ring" cx="${p.x}" cy="${p.y}" r="52" stroke="${p.c}"/>${points(p.x, p.y, p.c, 12, 34)}<text x="${p.x}" y="${p.y - 62}" text-anchor="middle">${p.n}</text></g>`).join("") +
    `<g id="roL"></g><g class="nw" id="roNw"><circle class="ring" cx="260" cy="292" r="44" stroke="#c9a6ff" style="opacity:.9"/>${points(260, 292, "#c9a6ff", 8, 26, "np")}<text x="260" y="232" text-anchor="middle" style="fill:#c9a6ff">Comfort</text></g>` +
    `<g class="rq" id="roQ" style="transform:translate(260px,26px)"><circle r="7" fill="none" stroke="#fff" stroke-width="1.6"/><circle r="2.6" fill="#fff"/></g>`;
  const q = $("roQ"), L = $("roL"), nw = $("roNw");
  const rings = qsa(".ring", svg).slice(0, 4);
  const setRev = ([t, m]: [string, string]) => (rev.innerHTML = t.replace(m, `<mark>${m}</mark>`));
  const tag = (k: string) => tags.forEach((s) => s.classList.toggle("on", s.dataset.t === k));
  const put = (x: number, y: number, on: boolean, anim = true) => {
    q.style.transition = anim ? "" : "none";
    q.style.transform = `translate(${x}px,${y}px)`;
    q.style.opacity = on ? "1" : "0";
  };
  const reset = () => {
    qsa(".added", svg).forEach((e) => e.remove());
    rings.forEach((r) => r.setAttribute("class", "ring"));
    nw.classList.remove("on");
    L.innerHTML = "";
    put(260, 26, false, false);
    rev.textContent = "";
    cap.textContent = "";
  };
  const finish = () => {
    tag("f");
    nw.classList.add("on");
    setRev(UNSEEN);
    cap.textContent = "No prototype is close enough. " + NEW_CAPTION;
  };
  const dispose = runStage(el("st-ro"), async (w) => {
    reset();
    tag("r");
    await w(500);
    for (const r of REVIEWS) {
      const [, , i, c] = r, p = PROTOS[i];
      setRev([r[0], r[1]]);
      await w(900);
      put(260, 26, true, false);
      await w(60);
      put(p.x, p.y, true);
      rings[i].classList.add("hit");
      cap.textContent = c;
      await w(1000);
      qs(`[data-i="${i}"]`, svg).insertAdjacentHTML("beforeend", `<g class="pt added" style="transform:translate(${p.x + 12}px,${p.y + 10}px)"><circle r="3.2" fill="${p.c}"/></g>`);
      put(p.x, p.y, false);
      await w(900);
      rings[i].classList.remove("hit");
      cap.textContent = "";
      await w(250);
    }
    setRev(UNSEEN);
    await w(900);
    put(260, 292, true, false);
    await w(450);
    L.innerHTML = PROTOS.map((p) => `<line class="rl" x1="260" y1="292" x2="${p.x}" y2="${p.y}"/>`).join("");
    for (const l of qsa<SVGLineElement>(".rl", L)) {
      l.style.opacity = ".7";
      await w(170);
      l.style.opacity = "0";
    }
    rings.forEach((r) => r.classList.add("miss"));
    cap.textContent = "No prototype is close enough.";
    await w(1100);
    tag("f");
    nw.classList.add("on");
    put(260, 292, false);
    cap.textContent = NEW_CAPTION;
    await w(3600);
  }, finish, still);
  return () => {
    dispose();
    svg.innerHTML = "";
  };
}

/* Space7: invite acceptance, server membership check, then room connection */
function space7(still: boolean): Disposer {
  const messages = [el("s7Message1"), el("s7Message2"), el("s7Message3")];
  const states = [el("s7Invite"), el("s7Verify"), el("s7Connected")];
  const sync = el("s7Sync");
  const reset = () => {
    messages.forEach((message) => message.classList.add("waiting"));
    states.forEach((state) => state.classList.remove("active"));
    states[0].classList.add("active");
    sync.classList.remove("active");
  };
  const finish = () => {
    messages.forEach((message) => message.classList.remove("waiting"));
    states.forEach((state) => state.classList.remove("active"));
    states[2].classList.add("active");
    sync.classList.remove("active");
  };
  return runStage(el("st-s7"), async (w) => {
    reset();
    await w(1200);
    states[0].classList.remove("active");
    states[1].classList.add("active");
    await w(1400);
    states[1].classList.remove("active");
    states[2].classList.add("active");
    sync.classList.add("active");
    for (const message of messages) {
      await w(550);
      message.classList.remove("waiting");
    }
    await w(2200);
  }, finish, still);
}

export function initStages(tools: Tool[]): Disposer {
  const still = reducedMotion();
  return all(gatekeeper(still), caresum(still), reviewop(still), space7(still), initTools(tools, still));
}
