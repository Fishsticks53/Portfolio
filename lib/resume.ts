// Parses content/resume.md into a typed Resume. No dependencies: the format is small and strict,
// and a mistake in the file fails the build with a message that names the section and line.

export type Fact = { value: string; label: string };
export type Job = { role: string; org: string; dates: string; now: boolean; points: string[] };
export type Tool = { name: string; description: string };
export type Project = { name: string; tagline: string; dates: string; stack: string[]; paragraphs: string[]; tools: Tool[] };
export type Skill = { name: string; usedIn?: string };
export type SkillGroup = { group: string; items: Skill[] };
export type Resume = {
  name: string;
  title: string;
  company: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin?: string;
  resumeFile: string;
  summary: string;
  facts: Fact[];
  experience: Job[];
  projects: Project[];
  publication: { title: string; shortVenue: string; authors: string[]; venue: string; year: string; doi: string };
  education: { institution: string; dates: string; degree: string; location: string; cgpa: string };
  certification: { name: string; issuer: string };
  skills: SkillGroup[];
};

type Item = { head: string[]; props: Record<string, string>; bullets: string[]; paras: string[]; line: number };
type Section = { name: string; paras: string[]; bullets: string[]; items: Item[]; line: number };

const fail = (msg: string): never => {
  throw new Error(`content/resume.md: ${msg}`);
};

const parts = (s: string) => s.split("|").map((p) => p.trim());
const csv = (s: string) => s.split(",").map((p) => p.trim()).filter(Boolean);

/** Splits the file into a header and sections of items. Exported for tests. */
export function parseMarkdown(source: string) {
  // Comments can span lines; blank them but keep the newlines so reported line numbers stay right.
  const text = source.replace(/\r\n/g, "\n").replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ""));
  const lines = text.split("\n");
  const meta: Record<string, string> = {};
  let i = 0;
  if (lines[0]?.trim() === "---") {
    i = 1;
    while (i < lines.length && lines[i].trim() !== "---") {
      const m = lines[i].match(/^([A-Za-z]\w*):\s*(.*)$/);
      if (m) meta[m[1]] = m[2].trim();
      else if (lines[i].trim()) fail(`line ${i + 1}: expected "key: value" in the header`);
      i++;
    }
    if (i >= lines.length) fail('the header starts with "---" but is never closed');
    i++;
  }
  const sections: Section[] = [];
  let sec: Section | undefined;
  let item: Item | undefined;
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith("## ")) {
      sec = { name: line.slice(3).trim(), paras: [], bullets: [], items: [], line: i + 1 };
      sections.push(sec);
      item = undefined;
    } else if (line.startsWith("### ")) {
      if (!sec) fail(`line ${i + 1}: "###" item before any "## " section`);
      item = { head: parts(line.slice(4)), props: {}, bullets: [], paras: [], line: i + 1 };
      sec!.items.push(item);
    } else if (!sec) {
      fail(`line ${i + 1}: text before the first "## " section`);
    } else if (line.startsWith("- ")) {
      (item ?? sec).bullets.push(line.slice(2).trim());
    } else {
      const kv = item && line.match(/^([a-z][A-Za-z]*):\s*(.+)$/);
      if (kv && item) item.props[kv[1]] = kv[2].trim();
      else (item ?? sec).paras.push(line);
    }
  }
  return { meta, sections };
}

export function parseResume(source: string): Resume {
  const { meta, sections } = parseMarkdown(source);
  const section = (name: string) => sections.find((s) => s.name.toLowerCase() === name.toLowerCase()) ?? fail(`missing the "## ${name}" section`);
  const meta1 = (key: string) => meta[key] || fail(`the header needs "${key}:"`);
  const need = (value: string | undefined, where: string) => value?.trim() || fail(`${where} is empty`);
  const only = (name: string): Item => section(name).items[0] ?? fail(`"## ${name}" needs one "### ..." item`);

  const experience = section("Experience").items.map((it) => {
    const [role, org, dates, flag] = it.head;
    const where = `"### ${it.head[0]}" (line ${it.line})`;
    return { role: need(role, where), org: need(org, where), dates: need(dates, where), now: flag === "now", points: it.bullets };
  });
  if (!experience.length) fail('"## Experience" needs at least one "### Role | Company | Dates" item');

  const projects = section("Projects").items.map((it) => {
    const [name, tagline, dates] = it.head;
    const where = `project "${name}" (line ${it.line})`;
    return {
      name: need(name, where),
      tagline: need(tagline, `${where} tagline`),
      dates: need(dates, `${where} dates`),
      stack: csv(it.props.stack ?? ""),
      paragraphs: it.paras,
      tools: it.bullets.map((b) => {
        const [tname, description] = parts(b);
        return { name: need(tname, `a tool in ${where}`), description: description ?? "" };
      }),
    };
  });
  if (!projects.length) fail('"## Projects" needs at least one "### Name | Tagline | Dates" item');

  const pub = only("Publication");
  const edu = only("Education");
  const cert = only("Certification");
  const skills = section("Skills").items.map((it) => ({
    group: need(it.head[0], `a skills group (line ${it.line})`),
    items: it.bullets.map((b) => {
      const [name, usedIn] = parts(b);
      return usedIn ? { name, usedIn } : { name };
    }),
  }));
  if (!skills.length) fail('"## Skills" needs at least one "### Group" item');

  return {
    name: meta1("name"),
    title: meta1("title"),
    company: meta1("company"),
    location: meta1("location"),
    email: meta1("email"),
    phone: meta1("phone"),
    github: meta1("github"),
    linkedin: meta.linkedin || undefined,
    resumeFile: meta1("resume"),
    summary: need(section("Summary").paras.join(" "), '"## Summary"'),
    facts: section("Facts").bullets.map((b) => {
      const [value, label] = parts(b);
      return { value: need(value, "a fact value"), label: need(label, `the label for fact "${value}"`) };
    }),
    experience,
    projects,
    publication: {
      title: need(pub.head[0], "the publication title"),
      shortVenue: pub.head[1] ?? "",
      authors: csv(pub.props.authors ?? ""),
      venue: need(pub.props.venue, "the publication venue"),
      year: need(pub.props.year, "the publication year"),
      doi: need(pub.props.doi, "the publication doi"),
    },
    education: {
      institution: need(edu.head[0], "the education institution"),
      dates: need(edu.head[1], "the education dates"),
      degree: need(edu.props.degree, "the education degree"),
      location: need(edu.props.location, "the education location"),
      cgpa: need(edu.props.cgpa, "the education cgpa"),
    },
    certification: { name: need(cert.head[0], "the certification name"), issuer: need(cert.head[1], "the certification issuer") },
    skills,
  };
}
