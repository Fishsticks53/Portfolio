import type { Resume } from "@/lib/resume";
import { asset } from "@/lib/paths";

export function Header({ r }: { r: Resume }) {
  return (
    <header>
      <div className="wrap nav">
        <a className="brand" href="#top">{r.name}</a>
        <ul>
          <li><a href="#work" data-react="curious">Work</a></li>
          <li><a href="#experience" data-react="curious">Experience</a></li>
          <li><a href="#writing" data-react="curious">Research</a></li>
          <li><a href="#contact" data-react="curious">Contact</a></li>
        </ul>
        <a className="btn" href={asset(r.resumeFile)} download>Resume</a>
      </div>
    </header>
  );
}

export function Footer({ r }: { r: Resume }) {
  return (
    <footer>
      <div className="wrap">
        <span>{r.name} · {r.location}</span>
        <span>Built from <span className="num">content/resume.md</span></span>
      </div>
    </footer>
  );
}
