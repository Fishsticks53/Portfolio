import { loadResume } from "@/lib/content";
import { Header, Footer } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Experience } from "@/components/Experience";
import { Research } from "@/components/Research";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Pip } from "@/components/Pip";
import { Fx } from "@/components/Fx";

export default function Page() {
  const r = loadResume();
  const tools = r.projects.find((p) => p.tools.length)?.tools ?? [];
  return (
    <>
      <div className="glow" id="glow" aria-hidden="true" />
      <Header r={r} />
      <main id="top">
        <div className="wrap">
          <Hero r={r} />
          <Work r={r} />
          <Experience r={r} />
          <Research r={r} />
          <Skills r={r} />
          <Contact r={r} />
        </div>
      </main>
      <Footer r={r} />
      <Pip />
      <Fx email={r.email} tools={tools} />
    </>
  );
}
