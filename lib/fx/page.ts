// Page-level behavior: cursor glow, scroll reveals, the experience timeline, magnetic buttons,
// the tools board hover text and the copy-email button. Content stays visible without any of this.
import { $, qs, qsa, listen, all, clamp, reducedMotion, type Disposer } from "./util";

export function initPage(email: string): Disposer {
  const still = reducedMotion();
  const ds: Disposer[] = [];

  /* Cursor glow: run frames only while the pointer is moving. */
  const glow = $("glow");
  let tx = innerWidth * 0.62, ty = innerHeight * 0.28, x = tx, y = ty, raf = 0;
  glow.style.transform = `translate3d(${x}px,${y}px,0)`;
  if (!still && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const follow = () => {
      raf = 0;
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      glow.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.5) raf = requestAnimationFrame(follow);
    };
    ds.push(listen(window, "pointermove", (e) => {
      tx = (e as PointerEvent).clientX;
      ty = (e as PointerEvent).clientY;
      if (!raf) raf = requestAnimationFrame(follow);
    }, { passive: true }));
  }
  ds.push(() => cancelAnimationFrame(raf));

  /* reveal: only elements already below the fold are lowered, so the first screen is complete at load */
  if (!still) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.remove("pre");
        io.unobserve(e.target);
      }
    }), { rootMargin: "0px 0px -8% 0px" });
    qsa(".rv").forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight * 0.92) {
        el.classList.add("pre");
        io.observe(el);
      }
    });
    ds.push(() => io.disconnect());

    /* pop-in groups: timeline roles, paper, college and certificate cards, tool groups */
    const timers: ReturnType<typeof setTimeout>[] = [];
    const pop = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        el.classList.add("in");
        pop.unobserve(el);
        timers.push(setTimeout(() => el.classList.remove("js", "in"), 2600));
      }
    }), { rootMargin: "0px 0px -12% 0px" });
    qsa(".tj,.paper,.vit,.cert,.sg").forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight * 0.92) {
        el.classList.add("js");
        pop.observe(el);
      }
    });
    ds.push(() => {
      pop.disconnect();
      timers.forEach(clearTimeout);
    });
  }

  /* the timeline line fills as the section scrolls past */
  const tl = document.getElementById("tline"), fill = document.getElementById("tlFill");
  if (tl && fill) {
    const upd = () => {
      const r = tl.getBoundingClientRect();
      fill.style.setProperty("--p", (still ? 1 : clamp((innerHeight * 0.62 - r.top) / r.height, 0, 1)).toFixed(3));
    };
    ds.push(listen(window, "scroll", upd, { passive: true }), listen(window, "resize", upd));
    upd();
  }

  /* magnetic buttons lean toward the cursor on devices that hover */
  if (!still && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    qsa(".btn").forEach((b) => {
      ds.push(listen(b, "pointermove", (e) => {
        const r = b.getBoundingClientRect(), p = e as PointerEvent;
        b.style.translate = `${(p.clientX - r.left - r.width / 2) * 0.14}px ${(p.clientY - r.top - r.height / 2) * 0.22}px`;
      }), listen(b, "pointerleave", () => (b.style.translate = "")));
    });
  }

  /* tools board: hover or focus shows where a tool was used */
  const board = document.getElementById("stack"), info = document.getElementById("stackInfo");
  if (board && info) {
    const hint = info.textContent ?? "";
    const tile = (e: Event) => (e.target as Element).closest?.<HTMLElement>(".ti") ?? null;
    const hi = (t: HTMLElement, on: boolean) => {
      qsa(".ti.on").forEach((o) => o !== t && o.classList.remove("on"));
      t.classList.toggle("on", on);
      info.textContent = "";
      if (on) {
        const b = document.createElement("b");
        b.textContent = t.dataset.n ?? "";
        info.append(b);
        if (t.dataset.use) info.append(` · used in ${t.dataset.use}`);
      } else info.textContent = hint;
    };
    ds.push(
      listen(board, "pointerover", (e) => { const t = tile(e); if (t) hi(t, true); }),
      listen(board, "pointerout", (e) => { const t = tile(e); if (t && !t.contains((e as PointerEvent).relatedTarget as Node | null)) hi(t, false); }),
      listen(board, "focusin", (e) => { const t = tile(e); if (t) hi(t, true); }),
      listen(board, "focusout", (e) => { const t = tile(e); if (t) hi(t, false); }),
      listen(board, "click", (e) => { const t = tile(e); if (t) hi(t, !t.classList.contains("on")); }),
    );
  }

  /* copy email, with a text-selection fallback when the clipboard is blocked */
  const copy = document.getElementById("copy");
  if (copy) {
    ds.push(listen(copy, "click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        copy.textContent = "Copied";
        setTimeout(() => (copy.textContent = "Copy email"), 1600);
      } catch {
        const r = document.createRange();
        r.selectNodeContents(qs("#mail"));
        const s = getSelection();
        s?.removeAllRanges();
        s?.addRange(r);
        copy.textContent = "Press Ctrl+C";
      }
    }));
  }
  return all(...ds);
}
