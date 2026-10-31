import type { CSSProperties } from "react";
import type { Resume } from "@/lib/resume";
import { AWS_PATH } from "@/lib/icons";

const v = (k: string, n: number | string) => ({ [k]: n }) as CSSProperties;
const Bars = ({ widths, from = 0 }: { widths: number[]; from?: number }) => (
  <>{widths.map((w, n) => <i key={n} className="sk" style={{ ...v("--w", w + "%"), ...v("--i", n + from) }} />)}</>
);

export function Research({ r }: { r: Resume }) {
  const { publication: pub, education: edu, certification: cert } = r;
  return (
    <section id="writing">
      <div className="sh">
        <h2 data-perch>Research &amp; <span className="serif">study</span></h2>
        <span className="kick">{pub.shortVenue} {pub.year}</span>
      </div>
      <div className="rs" id="rs">
        <article className="paper" data-perch aria-label="The published paper, laid out like an IEEE conference page">
          <div className="pp-top"><span>{pub.year} International Conference on Signal Processing, Computation, Electronics, Power and Telecommunication</span><span>{pub.shortVenue}</span></div>
          <h3 className="pp-title">{pub.title}</h3>
          <p className="pp-au">
            {pub.authors.map((a, n) => (
              <span key={a}>{n > 0 && ", "}{a === r.name ? <b className="me">{a}</b> : <b>{a}</b>}</span>
            ))}
          </p>
          <div className="pp-cols">
            <div><h4>Abstract</h4><Bars widths={[100, 96, 100, 92, 98, 100, 64]} /></div>
            <div>
              <h4>I. Introduction</h4>
              <Bars widths={[100, 94, 100, 88]} from={8} />
              <div className="fig"><span>Generator</span><em>→</em><span className="v">Verifier</span><em>→</em><span>Judge</span></div>
              <p className="figc">Fig. 1. Generator–Verifier–Judge pipeline.</p>
              <Bars widths={[98, 100, 70]} from={12} />
            </div>
          </div>
          <div className="pp-ft"><span className="num">DOI {pub.doi}</span><a href={`https://doi.org/${pub.doi}`}>Open the paper</a></div>
        </article>
        <div className="side">
          <article className="vit" data-perch>
            <h3>{edu.institution}</h3>
            <p className="deg">{edu.degree}</p>
            <dl>
              <dt>Period</dt><dd className="num">{edu.dates}</dd>
              <dt>Location</dt><dd>{edu.location}</dd>
              <dt>CGPA</dt><dd><span className="num">{edu.cgpa.replace("/", " / ")}</span></dd>
            </dl>
            <div className="scale" aria-hidden="true">
              {Array.from({ length: 10 }, (_, n) => <i key={n} style={v("--i", n)}><b style={v("--f", n < Math.floor(parseFloat(edu.cgpa)) ? 1 : n === Math.floor(parseFloat(edu.cgpa)) ? +(parseFloat(edu.cgpa) % 1).toFixed(2) : 0)} /></i>)}
            </div>
          </article>
          <article className="cert" data-perch>
            <div className="cert-in">
              <span className="seal">
                <svg className="aws" viewBox="0 0 24 24" role="img" aria-label="Amazon Web Services logo"><path d={AWS_PATH} /></svg>
                <i className="ok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></i>
              </span>
              <div><h3>{cert.name}</h3><p>{cert.issuer}</p></div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
