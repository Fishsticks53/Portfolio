# Portfolio

Monish S's portfolio, built with Next.js (static export) and deployed to GitHub Pages.
Live at https://fishsticks53.github.io/Portfolio/

## Update the content

Every fact on the site comes from one file: **`content/resume.md`**. Edit it, push to `main`,
and the site rebuilds and redeploys. No component needs touching.

| In the file | Becomes |
| --- | --- |
| header (`name`, `email`, `github`, `linkedin`, `resume`) | hero, header, contact; leave `linkedin:` empty to hide the button |
| `## Summary`, `## Facts` | the intro paragraph and the stat strip |
| `## Experience` > `### Role \| Company \| Dates \| now` | the scrolling timeline (add `\| now` to the current role) |
| `## Projects` > `### Name \| Tagline \| Dates` + `stack:` + paragraphs | the work section. Demos exist for Gatekeeper, CARESUM, ReviewOp + FACET and Cool Tools (matched by name); a new project still renders as text |
| the bullets under Cool Tools: `- Tool \| description` | the tool dock and its descriptions |
| `## Publication`, `## Education`, `## Certification` | the paper page, college card and certificate |
| `## Skills` > `### Group` > `- Name \| where I used it` | the tools board (the part after `\|` shows on hover) |

A mistake in the file fails the build with a message naming the section or line.
To replace the downloadable resume, overwrite `public/My_Resume.pdf` and keep `resume:` pointing at it.

## Commands

```bash
npm install        # once
npm run dev        # local site at http://localhost:3000
npm run typecheck  # TypeScript
npm test           # checks that content/resume.md parses (node's built-in test runner)
npm run build      # static site into ./out
npm run check      # all three above
```

To preview the build exactly as GitHub Pages serves it, build with the base path:
`BASE_PATH=/Portfolio npm run build` (in Git Bash on Windows, prefix with `MSYS_NO_PATHCONV=1`).

## Deploying

`.github/workflows/deploy.yml` runs on every push and pull request (typecheck, tests, build).
On `main` it also publishes `out/` to GitHub Pages.

One-time setup: **Settings > Pages > Build and deployment > Source: GitHub Actions**.

For a custom domain later, point the domain at Pages and drop `BASE_PATH` from the workflow
(the site then builds for the root).

## Layout

- `content/resume.md`: the single source of truth
- `lib/resume.ts`: parser and types; `lib/resume.test.ts`: its tests
- `app/`, `components/`: the page, rendered to static HTML at build time
- `lib/fx/`: client-side effects (project demos, the Pip mascot, scroll behavior). The page is complete without them and they respect `prefers-reduced-motion`.
- `lib/icons.ts`: brand icon paths (Simple Icons); lettered tiles stand in where no icon exists
