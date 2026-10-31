"use client";

import { useEffect } from "react";
import { initPage } from "@/lib/fx/page";
import { initStages } from "@/lib/fx/stages";
import { initPip } from "@/lib/fx/pip";
import type { Tool } from "@/lib/resume";

/** Attaches every client-side effect after hydration. The page is complete without it. */
export function Fx({ email, tools }: { email: string; tools: Tool[] }) {
  useEffect(() => {
    const stop = [initPage(email), initStages(tools), initPip()];
    return () => stop.forEach((s) => s());
  }, [email, tools]);
  return null;
}
