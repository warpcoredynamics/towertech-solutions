# SSG Migration Plan (Astro-first)

This repository now has quality gates and a partial-based static build. The next evolutionary step is a lightweight SSG.

## Recommendation

Use **Astro** as the default migration target because it supports static output, componentized templates, and minimal JS by default.

## Scope

1. Move section partials into Astro components (`src/components/*`).
2. Keep current visual behavior by importing `styles/main.css` and `scripts/main.js`.
3. Export static assets for Vercel (`output: 'static'`).
4. Preserve URLs and anchor structure to avoid SEO/marketing disruptions.

## Rollout Phases

- **Phase 1 (safe)**: Create Astro branch with pixel-identical output.
- **Phase 2**: Replace monolithic content with data-driven sections.
- **Phase 3**: Add content collections for updates/news.

## Exit Criteria

- Visual parity with current page.
- Lighthouse accessibility >= 90.
- Build time under 30 seconds in CI.
