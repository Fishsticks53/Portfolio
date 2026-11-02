import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseResume, parseMarkdown } from "./resume.ts";

const real = readFileSync(new URL("../content/resume.md", import.meta.url), "utf8");

test("the real resume file parses into every section the site needs", () => {
  const r = parseResume(real);
  assert.equal(r.name, "Monish S");
  assert.equal(r.experience.length, 3);
  assert.equal(r.experience.filter((j) => j.now).length, 1);
  assert.deepEqual(r.projects.map((p) => p.name), ["Gatekeeper", "CARESUM", "ReviewOp + FACET", "Cool Tools", "Space7"]);
  assert.equal(r.projects[3].tools.length, 8);
  assert.ok(r.projects.every((p) => p.stack.length > 0 && p.paragraphs.length > 0));
  assert.equal(r.publication.authors.length, 4);
  assert.equal(r.publication.doi, "10.1109/IConSCEPT66142.2025.11436852");
  assert.equal(r.education.cgpa, "9.01/10");
  assert.equal(r.certification.name, "AWS Certified Cloud Practitioner");
  assert.equal(r.skills.length, 4);
  assert.equal(r.linkedin, undefined);
  assert.equal(r.facts.length, 2);
});

test("skills keep an optional 'used in' note", () => {
  const r = parseResume(real);
  const py = r.skills[0].items.find((s) => s.name === "Python");
  assert.equal(py?.usedIn, "CARESUM");
  assert.equal(r.skills[0].items.find((s) => s.name === "Java")?.usedIn, undefined);
});

test("multi-line comments are ignored", () => {
  const { sections } = parseMarkdown("## A\n<!-- one\ntwo -->\nhello");
  assert.deepEqual(sections[0].paras, ["hello"]);
});

test("a mistake fails with a message that names the problem", () => {
  assert.throws(() => parseResume(real.replace("## Experience", "## Work")), /missing the "## Experience" section/);
  assert.throws(() => parseResume(real.replace("email: smonish2003@gmail.com\n", "")), /header needs "email:"/);
  assert.throws(() => parseResume(real.replace(/^---$/m, "---\nnot a pair")), /expected "key: value"/);
  assert.throws(() => parseMarkdown("stray text\n## A"), /text before the first/);
  assert.throws(() => parseMarkdown("---\nname: x\n"), /never closed/);
  assert.throws(() => parseResume(real.replace("### Gatekeeper | Code-quality checks for AI coding agents | ", "### Gatekeeper | | ")), /tagline is empty/);
});
