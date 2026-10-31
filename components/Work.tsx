import type { Resume } from "@/lib/resume";
import { STAGES } from "./stages";

export function Work({ r }: { r: Resume }) {
  const tools = r.projects.find((p) => p.tools.length)?.tools ?? [];
  return (
    <section id="work">
      <div className="sh">
        <h2 data-perch>Selected <span className="serif">work</span></h2>
        <span className="kick">2025 – present · each demo uses an illustrative example</span>
      </div>
      <div id="feats">
        {r.projects.map((p) => {
          const stage = STAGES[p.name];
          return (
            <article key={p.name} className={`feat rv${stage?.flip ? " flip" : ""}`}>
              <div className="copy">
                <h3>{p.name}</h3>
                <p className="tag">{p.tagline} · {p.dates}</p>
                {p.paragraphs.map((t) => <p key={t}>{t}</p>)}
                <div className="chips">
                  {p.tools.length
                    ? p.tools.map((t) => <span key={t.name} data-tool-chip data-react="think">{t.name}</span>)
                    : p.stack.map((s) => <span key={s} data-react="think">{s}</span>)}
                </div>
              </div>
              {stage && (
                <div>
                  {stage.render(tools)}
                  <p className="cap">Illustrative example, not real data.</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
