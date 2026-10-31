import type { CSSProperties } from "react";
import type { Resume } from "@/lib/resume";
import { ICONS, MONOGRAM, SHORT_LABEL, SKILL_ICON } from "@/lib/icons";

const lum = (hex: string) => {
  const n = parseInt(hex, 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};
// Brand color for the hover glow; marks too dark to read on this background are lightened.
function brand(slug?: string) {
  if (!slug) return "#c9cde0";
  const hex = ({ cplusplus: "00599C", nodedotjs: "5FA04E", nextdotjs: "ffffff" } as Record<string, string>)[slug] ?? ICONS[slug]?.[1] ?? "c9cde0";
  return lum(hex) < 0.2 ? `color-mix(in srgb,#${hex},#fff 62%)` : `#${hex}`;
}

export function Skills({ r }: { r: Resume }) {
  return (
    <section id="skills">
      <div className="sh"><h2 data-perch>Tools I <span className="serif">reach for</span></h2></div>
      <div className="stack" id="stack">
        {r.skills.map((g) => (
          <div className="sg" key={g.group} data-perch data-react="think">
            <h3>{g.group}</h3>
            <div className="tiles">
              {g.items.map((s, i) => {
                const slug = SKILL_ICON[s.name];
                const icon = slug ? ICONS[slug] : undefined;
                return (
                  <button key={s.name} className="ti" type="button" data-n={s.name} data-use={s.usedIn} style={{ "--c": brand(icon ? slug : undefined), "--i": i } as CSSProperties}>
                    {icon ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon[0]} /></svg> : <b className="mono" aria-hidden="true">{MONOGRAM[s.name] ?? s.name.slice(0, 2)}</b>}
                    <span>{SHORT_LABEL[s.name] ?? s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="stack-info" id="stackInfo" aria-live="polite">Hover or focus a tool to see where I used it.</p>
    </section>
  );
}
