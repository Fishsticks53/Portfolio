// Small helpers shared by the client-side effects. Everything here returns a Disposer so React
// can undo it (strict mode runs effects twice in development).
export type Disposer = () => void;
export type Wait = (ms: number) => Promise<void>;

export const $ = (id: string) => document.getElementById(id)!;
export const qs = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;
export const qsa = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const nap = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function listen(t: EventTarget, ev: string, fn: EventListenerOrEventListenerObject, opts?: AddEventListenerOptions): Disposer {
  t.addEventListener(ev, fn, opts);
  return () => t.removeEventListener(ev, fn, opts);
}

export const all = (...ds: Disposer[]): Disposer => () => ds.forEach((d) => d());

/** Runs a looping demo only while it is on screen; reduced motion gets the finished frame. */
export function runStage(el: Element, play: (w: Wait) => Promise<void>, finish: () => void, still: boolean): Disposer {
  if (still) {
    finish();
    return () => {};
  }
  let seen = false;
  let tok = 0;
  const alive = (t: number) => seen && !document.hidden && t === tok;
  async function loop() {
    const t = ++tok;
    const w: Wait = (ms) =>
      nap(ms).then(() => {
        if (!alive(t)) throw 0;
      });
    while (alive(t)) {
      try {
        await play(w);
      } catch {
        break;
      }
    }
  }
  const io = new IntersectionObserver(([e]) => {
    seen = e.isIntersecting;
    if (seen) loop();
    else tok++;
  }, { threshold: 0.4 });
  io.observe(el);
  const off = listen(document, "visibilitychange", () => {
    if (!document.hidden && seen) loop();
    else tok++;
  });
  return () => {
    tok++;
    io.disconnect();
    off();
  };
}
