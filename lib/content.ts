import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseResume, type Resume } from "./resume";

// Server-only: runs at build time, so a mistake in content/resume.md fails the build.
export function loadResume(): Resume {
  return parseResume(readFileSync(join(process.cwd(), "content", "resume.md"), "utf8"));
}
