# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Delegated by the user ("completely your choice"). Chosen: Next.js (static export) + TypeScript + Tailwind CSS + Motion. Reason: matches the owner's resume skills, static output deploys free anywhere, and a build-time content step makes the resume file the single source of truth. Dependency list still needs explicit approval before install.

## Users
Monish S, a CS graduate (VIT, B.Tech, CGPA 9.01/10, Jul 2026) working as a full-stack developer, presenting themself for two purposes:
- Job hunting: recruiters and hiring managers skimming quickly for full-stack, AI-agent and NLP engineering fit.
- Master's applications: admissions committees weighing research ability, publication, academic record and project depth.

## Product Purpose
A personal portfolio site that proves the claims on Monish's resume with depth the PDF cannot hold (project write-ups, a publication, skills), and converts a visitor into a contact, a resume download, or a GitHub visit. Success: a recruiter or admissions reader understands who Monish is, what they've built and where to reach them within about a minute, and can go deeper on any project.

## Positioning
A single engineer who spans applied research (published clinical-NLP work, aspect-based sentiment models) and production software (React/FastAPI agent platforms, a 15-package TypeScript tool with 1,200+ tests). The site itself is the demonstration: it is generated from one editable resume file.

## Operating Context
- All site content is generated at build time from one human-edited Markdown resume file; updating the resume means editing that file and rebuilding.
- The downloadable resume PDF is currently `My_Resume.pdf` in the project root.

## Capabilities and Constraints
- Single source of truth: edit one `.md` file, rebuild, every section updates. No resume fact lives anywhere else in the code.
- Content sections (from the resume): summary, education, experience (3 roles), projects (4), publication (IConSCEPT 2025, DOI 10.1109/IConSCEPT66142.2025.11436852), technical skills, certification (AWS Certified Cloud Practitioner), contact links.
- Static hosting, no backend. No contact form in v1.
- Undecided: deploy host and domain; live demo URLs; project screenshots; LinkedIn URL on the resume (`linkedin.com/in/Monish`) looks like a placeholder and needs confirmation.
- Reduced-motion and no-WebGL fallbacks required.

## Brand Commitments
- Dark theme preferred over light (user statement; binding).
- Name: Monish S. GitHub: github.com/Fishsticks53.

## Evidence on Hand
- `My_Resume.pdf` (two pages): the only confirmed content.
- No testimonials, screenshots, demo URLs, metrics beyond those printed on the resume, or customer names. None may be invented; unfilled slots render as clearly marked placeholders or are omitted.

## Product Principles
1. Every fact on the site traces to the resume file; nothing is added that the resume does not say.
2. Serve the 60-second skim first, the deep read second.
3. Show engineering depth through real structure (pipelines, packages, papers), not decoration.
4. Dark, quiet and fast beats loud and heavy.
5. Updating content must never require touching components.

## Accessibility & Inclusion
Target WCAG 2.2 AA, full keyboard navigation, `prefers-reduced-motion` respected.
