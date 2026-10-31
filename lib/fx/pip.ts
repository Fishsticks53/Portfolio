// Pip: a calm robot explorer that perches on the page, hops between perches, sleeps when idle,
// reacts to what you hover and hunts the odd glitch bug. Perches are elements marked data-perch;
// hover reactions come from data-react; stages can set data-prop and data-mood on their frame.
import { $, qs, qsa, listen, all, clamp, reducedMotion, type Disposer } from "./util";

const FEET = 0.925;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const cw = () => document.documentElement.clientWidth;
const sz = () => (innerWidth < 600 ? 56 : 72);
const LINES = ["Hello. Observing.", "Everything looks stable.", "Take your time.", "Noted.", "Quiet is a feature.", "All systems nominal."];
const BUG = '<svg viewBox="0 0 22 22" aria-hidden="true"><g class="legs" stroke="#ff7a8a" stroke-width="1.4" stroke-linecap="round"><path d="M6 9L2 7M6 12H1M6 15L2 18M16 9l4-2M16 12h5M16 15l4 3"/></g><ellipse cx="11" cy="13" rx="5" ry="6.5" fill="#ff7a8a"/><circle cx="11" cy="6" r="3" fill="#ff7a8a"/><path d="M9.5 3.5L8 1M12.5 3.5L14 1" stroke="#ff7a8a" stroke-width="1.2" stroke-linecap="round"/><path d="M11 8v10" stroke="#0a0b10" stroke-width="1" opacity=".5"/></svg>';

type Pt = { x: number; y: number };
type Hop = { x0: number; y0: number; t: number; dur: number; get: () => Pt; after: () => void; h: number };
type Bug = { el: HTMLElement; x: number; y: number; a: number };

export function initPip(): Disposer {
  const still = reducedMotion();
  const pip = $("pip"), pf = qs("button.pip-f", pip), pbd = qs(".pip-b", pip), pbub = $("pbub");
  const pl = $("pl"), pr = $("pr");
  const ds: Disposer[] = [];
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timers.delete(t);
      fn();
    }, ms);
    timers.add(t);
    return t;
  };
  const now0 = performance.now();
  const P = {
    x: 0, y: 0, mode: "perch" as "perch" | "hop" | "wait", perch: null as HTMLElement | null, f: 0.8, fT: 0.8, walk: false,
    dwell: now0 + 4000, hop: null as Hop | null, hunt: false, asleep: false, bugs: 0, mood: "idle", prop: "", tmp: "", tmpUntil: 0,
    reactEl: null as Element | null, mouse: { x: 0, y: 0, t: -1e9 }, input: now0, nextAct: now0 + 3000, startle: 0, sy: scrollY, st: now0, until: 0,
    eye: { x: 0, y: 0 }, said: new Set<Element>(), last: now0,
  };
  let bug: Bug | null = null;
  let lastBug: Pt = { x: 0, y: 0 };
  let sayTimer: ReturnType<typeof setTimeout> | undefined;
  let reactTimer: ReturnType<typeof setTimeout> | undefined;
  let raf = 0;

  const floorPt = (): Pt => ({ x: cw() - sz() * 0.9, y: innerHeight - 14 });
  const perchPt = (el: Element, f: number): Pt => {
    const r = el.getBoundingClientRect(), s = sz();
    return { x: clamp(r.left + r.width * f, s * 0.6, cw() - s * 0.6), y: r.top };
  };
  const okEl = (el: Element) => {
    const r = el.getBoundingClientRect();
    return r.width > 30 && r.top > sz() + 72 && r.top < innerHeight - 26;
  };
  function pickPerch(avoid: Element | null): HTMLElement | null {
    const c = qsa("[data-perch]").filter((e) => e !== avoid && okEl(e));
    if (!c.length) return null;
    const w = c.map((e) => {
      const r = e.getBoundingClientRect();
      let k = e.classList.contains("stage") ? 2.6 : 1;
      k *= 0.4 + Math.min(1.6, Math.abs(r.top - P.y) / 220);
      k *= 1 - Math.abs(r.top / innerHeight - 0.45) * 0.6;
      return Math.max(0.05, k);
    });
    let t = Math.random() * w.reduce((a, b) => a + b, 0), i = 0;
    for (; i < c.length - 1; i++) {
      t -= w[i];
      if (t <= 0) break;
    }
    return c[i];
  }
  function say(text: string, ms = 2800) {
    pbub.textContent = text;
    pbub.className = "pbub " + (P.x < 150 ? "al" : P.x > cw() - 150 ? "ar" : "") + " show";
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => pbub.classList.remove("show"), ms);
  }
  const setMood = (m: string, ms: number) => {
    P.tmp = m;
    P.tmpUntil = performance.now() + ms;
  };
  const squash = (sx: number, sy: number, rot: number) => {
    pbd.style.transform = `scale(${sx.toFixed(3)},${sy.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`;
  };
  function startHop(get: () => Pt, after: () => void) {
    const t = get(), d = Math.hypot(t.x - P.x, t.y - P.y);
    P.hop = { x0: P.x, y0: P.y, t: 0, dur: clamp(520 + d * 0.45, 640, 1250), get, after, h: clamp(d * 0.32, 46, 170) };
    P.mode = "hop";
    P.walk = false;
    pip.classList.remove("walk");
  }
  function goPerch(el: HTMLElement) {
    P.perch = el;
    P.fT = P.f = 0.12 + Math.random() * 0.76;
    startHop(() => perchPt(el, P.fT), () => {
      P.dwell = performance.now() + 2600 + Math.random() * 4200;
      const line = el.dataset.say;
      if (line && (!P.said.has(el) || Math.random() < 0.25)) {
        P.said.add(el);
        say(line);
      }
    });
  }
  function goFloor() {
    P.perch = null;
    startHop(floorPt, () => {
      P.dwell = performance.now() + 500;
    });
  }
  function stepHop(dt: number) {
    const h = P.hop!;
    h.t += dt;
    const p = Math.min(1, h.t / h.dur), T = h.get();
    let sx = 1, sy = 1, rot = 0;
    if (p < 0.12) {
      const a = p / 0.12;
      sx = 1 + 0.14 * a;
      sy = 1 - 0.2 * a;
      P.x = h.x0;
      P.y = h.y0;
    } else if (p < 0.88) {
      const q = (p - 0.12) / 0.76, e = ease(q), s = Math.sin(Math.PI * q);
      P.x = lerp(h.x0, T.x, e);
      P.y = lerp(h.y0, T.y, e) - s * h.h;
      sy = 1 + 0.2 * s;
      sx = 1 - 0.12 * s;
      rot = clamp((T.x - h.x0) / 200, -1, 1) * 10 * s;
    } else {
      const a = (p - 0.88) / 0.12;
      P.x = T.x;
      P.y = T.y;
      sx = 1.14 - 0.14 * a;
      sy = 0.8 + 0.2 * a;
    }
    squash(sx, sy, rot);
    if (p >= 1) {
      const af = h.after;
      P.hop = null;
      P.mode = "perch";
      af();
    }
  }
  function hunt() {
    P.hunt = true;
    startHop(() => (bug ? (lastBug = { x: bug.x, y: bug.y + 9 }) : lastBug), () => {
      P.hunt = false;
      if (bug) catchBug(false);
      P.mode = "wait";
      P.until = performance.now() + 1100;
      setMood("excited", 1200);
    });
  }

  function stepPerch(dt: number, now: number) {
    const el = P.perch;
    if (!el) {
      const T = floorPt();
      P.x = T.x;
      P.y = T.y;
      if (now > P.dwell) {
        P.dwell = now + 500;
        const n = pickPerch(null);
        if (n) goPerch(n);
      }
      return;
    }
    if (!okEl(el)) {
      const n = pickPerch(el);
      if (n) goPerch(n);
      else goFloor();
      return;
    }
    if (bug && !P.asleep && !P.walk) {
      hunt();
      return;
    }
    const r = el.getBoundingClientRect();
    if (P.walk) {
      const d = P.fT - P.f, sp = (dt / 1000) * 95 / Math.max(60, r.width);
      P.f += Math.sign(d) * Math.min(Math.abs(d), sp);
      if (Math.abs(P.fT - P.f) < 1e-3) {
        P.walk = false;
        pip.classList.remove("walk");
      }
    }
    const T = perchPt(el, P.f);
    P.x = T.x;
    P.y = T.y;
    if (!P.asleep && now > P.dwell && !P.walk) {
      if (Math.random() < 0.3 && r.width > 240) {
        P.fT = clamp(P.f + (Math.random() < 0.5 ? -1 : 1) * (90 + Math.random() * 160) / r.width, 0.08, 0.92);
        P.walk = true;
        pip.classList.add("walk");
        P.dwell = now + 2200 + Math.random() * 3000;
      } else {
        const n = pickPerch(el);
        if (n) goPerch(n);
        else P.dwell = now + 2000;
      }
    }
    if (!P.asleep && !P.walk && now > P.nextAct) {
      const a = ["yawn", "wave", "ant", "think", "wink"][(Math.random() * 5) | 0];
      if (a === "wave" || a === "ant") {
        pip.classList.add(a);
        later(() => pip.classList.remove(a), 1500);
      } else setMood(a, 1100);
      P.nextAct = now + 2400 + Math.random() * 3800;
    }
  }

  /* sleep, wake, startle */
  const sleep = () => {
    P.asleep = true;
    P.walk = false;
    pip.classList.remove("walk");
  };
  const poke = () => {
    P.input = performance.now();
    if (P.asleep) {
      P.asleep = false;
      setMood("yawn", 1000);
      say("Back online.");
    }
  };
  const place = () => {
    if (!P.perch || !okEl(P.perch)) P.perch = pickPerch(null);
    const T = P.perch ? perchPt(P.perch, P.f) : floorPt();
    P.x = T.x;
    P.y = T.y;
    render(performance.now());
  };

  /* the bug */
  function burst(x: number, y: number) {
    if (still) return;
    for (let i = 0; i < 9; i++) {
      const e = document.createElement("i");
      e.className = "px";
      document.body.append(e);
      const a = (i / 9) * 6.283, d = 22 + Math.random() * 26;
      e.animate([{ transform: `translate(${x}px,${y}px)`, opacity: 1 }, { transform: `translate(${x + Math.cos(a) * d}px,${y + Math.sin(a) * d}px) scale(.3)`, opacity: 0 }], { duration: 520, easing: "cubic-bezier(.23,1,.32,1)" }).onfinish = () => e.remove();
    }
  }
  function catchBug(byUser: boolean) {
    const b = bug;
    if (!b) return;
    burst(b.x, b.y);
    b.el.remove();
    bug = null;
    P.bugs++;
    setMood("excited", 1500);
    say(byUser ? `You got that one. Bugs squashed: ${P.bugs}` : `Found one. Bugs squashed: ${P.bugs}`, 3200);
  }
  function spawnBug() {
    if (bug || P.asleep || document.hidden || still || P.mode !== "perch") return;
    const el = document.createElement("button");
    el.className = "bug";
    el.setAttribute("aria-label", "Squash the bug");
    el.innerHTML = BUG;
    document.body.append(el);
    bug = { el, x: 140 + Math.random() * (innerWidth - 280), y: 170 + Math.random() * (innerHeight - 340), a: Math.random() * 6.283 };
    el.addEventListener("click", () => catchBug(true));
  }
  function crawl(dt: number) {
    if (!bug) return;
    bug.a += (Math.random() - 0.5) * 0.35;
    const v = (34 * dt) / 1000;
    bug.x += Math.cos(bug.a) * v;
    bug.y += Math.sin(bug.a) * v;
    if (bug.x < 90 || bug.x > innerWidth - 90) bug.a = Math.PI - bug.a;
    if (bug.y < 150 || bug.y > innerHeight - 90) bug.a = -bug.a;
    bug.x = clamp(bug.x, 80, innerWidth - 80);
    bug.y = clamp(bug.y, 140, innerHeight - 80);
    bug.el.style.transform = `translate3d(${bug.x - 11}px,${bug.y - 11}px,0) rotate(${bug.a + 1.57}rad)`;
  }

  /* eyes, mood, render */
  function look(now: number) {
    let tx: number, ty: number;
    if (P.asleep) {
      tx = P.x;
      ty = P.y;
    } else if (P.reactEl) {
      const r = P.reactEl.getBoundingClientRect();
      tx = r.left + r.width / 2;
      ty = r.top + r.height / 2;
    } else if (bug) {
      tx = bug.x;
      ty = bug.y;
    } else if (now - P.mouse.t < 2500) {
      tx = P.mouse.x;
      ty = P.mouse.y;
    } else if (P.perch?.classList.contains("stage")) {
      const r = P.perch.getBoundingClientRect();
      tx = r.left + r.width * (0.3 + 0.4 * Math.sin(now / 900));
      ty = r.top + r.height * 0.5;
    } else {
      tx = P.x + Math.sin(now / 1700) * 220;
      ty = P.y - 30 + Math.cos(now / 2300) * 60;
    }
    const dx = tx - P.x, dy = ty - (P.y - sz() * 0.5), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 160);
    P.eye.x = lerp(P.eye.x, P.asleep ? 0 : (dx / d) * 3.2 * k, 0.18);
    P.eye.y = lerp(P.eye.y, P.asleep ? 0 : (dy / d) * 2.6 * k, 0.18);
    const t = `translate(${P.eye.x.toFixed(2)}px,${P.eye.y.toFixed(2)}px)`;
    pl.style.transform = pr.style.transform = t;
  }
  function render(now: number) {
    const s = sz();
    pip.style.transform = `translate3d(${(P.x - s / 2).toFixed(1)}px,${(P.y - s * FEET).toFixed(1)}px,0)`;
    const m = P.asleep ? "sleep" : now < P.tmpUntil ? P.tmp : P.perch?.dataset.mood || "idle";
    if (m !== P.mood) {
      P.mood = m;
      pip.dataset.mood = m;
    }
    const prop = P.hunt ? "mag" : (P.mode === "perch" && P.perch?.dataset.prop) || "";
    if (prop !== P.prop) {
      P.prop = prop;
      pip.dataset.prop = prop;
    }
    if (P.mode !== "hop") {
      let sy = 1 + Math.sin(now / (P.asleep ? 900 : 620)) * (P.asleep ? 0.02 : 0.014), rot = 0;
      const sx = 1 / sy;
      if (P.walk) {
        rot = Math.sin(now / 85) * 5;
        sy *= 1 + Math.abs(Math.sin(now / 85)) * 0.04;
      }
      squash(sx, sy, rot);
    }
  }
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) {
      P.last = now;
      return;
    }
    const dt = Math.min(50, now - P.last);
    P.last = now;
    crawl(dt);
    if (!P.asleep && P.mode === "perch" && !P.walk && !P.hunt && !bug && now - P.input > 14000) sleep();
    if (P.mode === "hop") stepHop(dt);
    else if (P.mode === "wait") {
      if (now > P.until) {
        const n = pickPerch(null);
        P.mode = "perch";
        if (n) goPerch(n);
        else goFloor();
      }
    } else stepPerch(dt, now);
    look(now);
    render(now);
  }
  function blink() {
    if (!P.asleep) {
      pip.classList.add("blink");
      later(() => pip.classList.remove("blink"), 120);
    }
    later(blink, 3000 + Math.random() * 3600);
  }
  function spawnLoop() {
    spawnBug();
    later(spawnLoop, 16000 + Math.random() * 16000);
  }

  /* events */
  for (const ev of ["pointerdown", "keydown", "wheel", "touchstart"]) ds.push(listen(window, ev, poke, { passive: true }));
  ds.push(listen(window, "pointermove", (e) => {
    const p = e as PointerEvent;
    P.mouse = { x: p.clientX, y: p.clientY, t: performance.now() };
    poke();
  }, { passive: true }));
  ds.push(listen(window, "scroll", () => {
    const n = performance.now(), v = Math.abs(scrollY - P.sy) / Math.max(1, n - P.st);
    P.sy = scrollY;
    P.st = n;
    poke();
    if (v > 2.4 && n - P.startle > 5000 && P.mode === "perch" && !P.asleep && !still) {
      P.startle = n;
      setMood("startled", 900);
      pf.animate([{ transform: "translateY(0)" }, { transform: "translateY(-14px)" }, { transform: "translateY(0)" }], { duration: 380, easing: "cubic-bezier(.23,1,.32,1)" });
    }
    if (still) place();
  }, { passive: true }));
  ds.push(listen(document, "pointerover", (e) => {
    const el = (e.target as Element | null)?.closest?.("[data-react]") as HTMLElement | null;
    if (el && el !== P.reactEl) {
      P.reactEl = el;
      setMood(el.dataset.react!, 1400);
      clearTimeout(reactTimer);
      reactTimer = setTimeout(() => (P.reactEl = null), 1400);
    }
  }));
  ds.push(listen(pf, "click", () => {
    poke();
    if (!still) pf.animate([{ transform: "translateY(0) rotate(0)" }, { transform: "translateY(-44px) rotate(-180deg)", offset: 0.5 }, { transform: "translateY(0) rotate(-360deg)" }], { duration: 640, easing: "cubic-bezier(.23,1,.32,1)" });
    setMood("excited", 1200);
    say(LINES[(Math.random() * LINES.length) | 0]);
  }));
  const word = document.querySelector<HTMLElement>("h1 .serif");
  if (word) ds.push(listen(word, "click", () => {
    if (!still) pf.animate([{ transform: "translateY(0)" }, { transform: "translateY(-22px)" }, { transform: "translateY(0)" }], { duration: 420, easing: "cubic-bezier(.23,1,.32,1)" });
    say("Checked.");
  }));
  if (still) ds.push(listen(window, "resize", place));

  /* start */
  P.perch = document.querySelector<HTMLElement>(".cta .btn.pri");
  if (P.perch) {
    const T = perchPt(P.perch, P.f);
    P.x = T.x;
    P.y = T.y;
  }
  render(performance.now());
  if (!still) {
    pf.animate([{ opacity: 0, transform: "scale(.5) translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: 500, easing: "cubic-bezier(.23,1,.32,1)", fill: "backwards" });
    raf = requestAnimationFrame(frame);
    later(blink, 2600);
    later(() => say("Hello. I am Pip. I help check things."), 1300);
    later(spawnLoop, 9000);
  }
  return all(...ds, () => {
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    clearTimeout(sayTimer);
    clearTimeout(reactTimer);
    bug?.el.remove();
    bug = null;
    qsa(".px").forEach((e) => e.remove());
  });
}
