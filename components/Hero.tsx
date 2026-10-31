import type { Resume } from "@/lib/resume";
import { asset } from "@/lib/paths";

export function Hero({ r }: { r: Resume }) {
  return (
    <div className="hero">
      <div className="aurora" aria-hidden="true" />
      <div style={{ position: "relative" }}>
        <div className="eyebrow" data-perch>
          <i />
          {r.title} at {r.company} · {r.location}
        </div>
        <h1>
          I build full-stack software and the tools that <span className="serif">check</span> what AI writes.
        </h1>
        <p className="lede">{r.summary}</p>
        <div className="cta">
          <a className="btn pri" data-perch data-react="excited" href={asset(r.resumeFile)} download>Download resume</a>
          <a className="btn" href="#work">See the work</a>
        </div>
        <div className="facts" data-perch>
          {r.facts.map((f, i) => (
            <div key={f.label} className="rv" data-react="excited" style={{ "--d": i } as React.CSSProperties}>
              <b className="num">{f.value}</b>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
