import type { Resume } from "@/lib/resume";
import { asset } from "@/lib/paths";

export function Contact({ r }: { r: Resume }) {
  return (
    <section id="contact" className="contact">
      <h2 data-perch>Let’s <span className="serif">talk.</span></h2>
      <p className="lede" style={{ marginTop: 0 }}>Open to full-stack and AI engineering roles.</p>
      <div className="mail">
        <code id="mail" data-perch>{r.email}</code>
        <button className="btn" id="copy" type="button" data-react="wink">Copy email</button>
      </div>
      <div className="cta">
        <a className="btn pri" data-react="excited" href={asset(r.resumeFile)} download>Download resume</a>
        <a className="btn" href={r.github} rel="noopener noreferrer">GitHub</a>
        {r.linkedin && <a className="btn" href={r.linkedin} rel="noopener noreferrer">LinkedIn</a>}
      </div>
    </section>
  );
}
