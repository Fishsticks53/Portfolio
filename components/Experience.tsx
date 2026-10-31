import type { CSSProperties } from "react";
import type { Resume } from "@/lib/resume";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export function Experience({ r }: { r: Resume }) {
  return (
    <section id="experience">
      <div className="sh">
        <h2 data-perch>Where I’ve <span className="serif">worked</span></h2>
        <span className="kick">{r.experience.length} roles</span>
      </div>
      <div className="tline" id="tline">
        <i className="tl-rail" />
        <i className="tl-fill" id="tlFill" />
        {r.experience.map((j) => (
          <article key={j.role + j.dates} className={`tj${j.now ? " cur" : ""}`} data-perch data-react="think">
            <div className="when num pp" style={i(0)}>{j.dates}</div>
            <span className="dot" style={i(0)} />
            <div className="tb">
              <h3 className="pp" style={i(1)}>{j.role}{j.now && <span className="now">Now</span>}</h3>
              <p className="org pp" style={i(2)}>{j.org}</p>
              <ul>{j.points.map((p, k) => <li key={p} className="pp" style={i(3 + k)}>{p}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
