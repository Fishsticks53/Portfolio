---
name: Monish S
title: Full Stack Developer
company: Justo Global
location: Vellore, India
email: smonish2003@gmail.com
phone: +91 94886 26333
github: https://github.com/Fishsticks53
linkedin:
resume: My_Resume.pdf
---

<!--
  THE SINGLE SOURCE OF TRUTH FOR THE SITE.
  Edit this file, run `npm run build` (or push to main), and every section updates.
  Format: "## Section", "### Item | field | field", "key: value" lines, "- bullets", plain paragraphs.
  Leave `linkedin:` empty to hide the link. HTML comments like this one are ignored.
-->

## Summary
Computer Science graduate with experience in natural language processing, AI agents, and full-stack software development. Co-authored a conference paper on verifying the factual accuracy of clinical summaries and currently developing tools to evaluate AI-generated code.

## Facts
- 9.01 | CGPA out of 10, VIT
- 1 | published conference paper

## Experience

### Full Stack Developer | Justo Global · Vellore | Aug 2026 – Present | now
- Develop the frontend of an unreleased AI workflow platform for education, taking responsibility for application architecture, feature development, and user experience.
- Reduced the frontend bundle size and improved page-loading and rendering performance across the platform.
- Build and release new features for ARK Connect, the company’s public mobile application.

### Full Stack Developer Intern | Justo Global · Vellore | Feb 2026 – Aug 2026
- Built a visual multi-agent workflow builder using React Flow, FastAPI, and CrewAI, with live updates.
- Developed an AI-assisted profile and resume builder with LangChain and LangGraph; presented at an internal AI workshop.
- Implemented API rate limiting, including distributed support, unit tests, logging, and fallback handling.
- Delivered features and fixed production bugs in an AI agent platform built with React, Node.js/Express, and FastAPI.

### Front-End Web Developer Intern | Valsco Technology · Remote | Jul 2024 – Sep 2024
- Developed the home page and notes pages for a React web application where students can buy and sell study notes.
- Built responsive layouts for desktop, tablet and mobile, and integrated interactive 3D visuals using Spline.

## Projects

### Gatekeeper | Code-quality checks for AI coding agents | Jun 2026 – Present
stack: TypeScript, PostgreSQL, React, MCP
An independent tool that checks AI-generated code and tracks changes in a codebase’s structure and quality over time.
Fifteen TypeScript packages sit behind a command line, an MCP server, a REST API and a React dashboard. ESLint, Knip, dependency-cruiser and jscpd run in a sandbox and every finding carries its evidence. Over 1,200 automated unit, security and integration tests, all written independently.

### CARESUM | Verification-driven clinical dialogue summarization | Jun 2025 – Aug 2025
stack: Python, Transformers, FastAPI, Docker
Turns doctor–patient conversations into structured clinical notes, with a focus on catching factual errors in the generated summary.
A Generator–Verifier–Judge pipeline: a model drafts the note, a fine-tuned classifier checks each sentence for factual consistency, and a language model reviews and refines the output. Published at IConSCEPT 2025.

### ReviewOp + FACET | Aspect-based sentiment analysis | Jan 2026 – Jun 2026
stack: PyTorch, FastAPI, React
ReviewOp analyzes reviews with a few-shot Prototypical Network that finds implicit aspects and categories it never saw in training.
FACET is a mixture-of-experts model that groups review aspects across different domains without needing domain labels. The work began in a team project on model-agnostic meta-learning for aspect-based sentiment analysis, using the SemEval and MAMS datasets.

### Cool Tools | Local developer toolkit | Sep 2026 – Present
stack: FastAPI, React, TypeScript
Eight local-first utilities for common development tasks, built with FastAPI, React and TypeScript. Everything runs on your own machine. Pick a tool to watch it work.
- CodePack | Builds a focused, filtered project bundle for sharing with AI coding tools.
- AgentSync | Keeps AI agent instructions and skills aligned across Claude, Codex, and Antigravity.
- JSONLab | Validates, formats, transforms, compares, and queries JSON.
- API Key Vault | Stores API keys locally with encryption and Windows Hello protection.
- PortPilot | Shows which apps use local ports and helps manage those processes safely.
- MarkItDown | Converts documents into Markdown on your computer.
- WorkspacePilot | Saves a project’s terminal commands and opens them together.
- SyncPilot | Updates followed Git repositories safely, then runs their setup or rebuild commands.

## Publication

### CARESUM: A Verification-Driven Framework for Clinical Dialogue Summarization with an Intelligent Chatbot Interface | IConSCEPT
authors: Ivan Dominic, Monish S, Rishi Gattu Nandakumar, Rajeshkannan Regunathan
venue: 2025 International Conference on Signal Processing, Computation, Electronics, Power and Telecommunication
year: 2025
doi: 10.1109/IConSCEPT66142.2025.11436852

## Education

### Vellore Institute of Technology | Sep 2022 – Jul 2026
degree: B.Tech Computer Science and Engineering
location: Vellore, India
cgpa: 9.01/10

## Certification

### AWS Certified Cloud Practitioner | Amazon Web Services

<!-- Skills: "- Name | where I used it". The part after | is optional and shows on hover. -->
## Skills

### Languages
- Python | CARESUM
- TypeScript | Gatekeeper · Cool Tools
- JavaScript | Valsco responsive layouts
- Java
- C
- C++
- SQL
- R
- HTML | Valsco responsive layouts
- CSS | Valsco responsive layouts

### AI and data
- PyTorch | ReviewOp + FACET
- Transformers | CARESUM
- LangChain | Justo resume builder
- LangGraph | Justo resume builder
- CrewAI | Justo workflow builder
- Model Context Protocol | the Gatekeeper MCP server
- Faster-Whisper
- pandas
- NumPy

### Web and mobile
- React | Gatekeeper · ReviewOp · Cool Tools · the Valsco notes app · Justo platforms
- Next.js
- React Native | the Justo internship mobile app
- Expo | the Justo internship mobile app
- Node.js | Justo agent platform
- Express.js | Justo agent platform
- FastAPI | ReviewOp · CARESUM · Cool Tools · Justo workflow builder
- Celery
- Tailwind CSS
- Shiny

### Databases and tools
- PostgreSQL | Gatekeeper
- MySQL
- Redis
- Prisma
- Git
- Docker | CARESUM
- Bun
- Vitest
- pytest
- Playwright
