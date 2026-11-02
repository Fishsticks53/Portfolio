"use client";

import { useEffect } from "react";
import type { Tool } from "@/lib/resume";

/** Attaches every client-side effect after hydration. The page is complete without it. */
export function Fx({ email, tools }: { email: string; tools: Tool[] }) {
  useEffect(() => {
    let stopped = false;
    const stop: Array<() => void> = [];
    const cleanup = () => stop.splice(0).forEach((s) => s());
    const load = async () => {
      try {
        const [page, stages] = await Promise.all([import("@/lib/fx/page"), import("@/lib/fx/stages")]);
        if (stopped) return;
        stop.push(page.initPage(email));
        stop.push(stages.initStages(tools));
        if (!matchMedia("(hover:none) and (pointer:coarse)").matches) {
          const pip = await import("@/lib/fx/pip");
          if (!stopped) stop.push(pip.initPip());
        }
      } catch {
        cleanup();
      }
    };
    const run = () => { void load(); };
    let cancelSchedule: () => void;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 700 });
      cancelSchedule = () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(run, 100);
      cancelSchedule = () => clearTimeout(id);
    }
    return () => {
      stopped = true;
      cancelSchedule();
      cleanup();
    };
  }, [email, tools]);
  return null;
}
