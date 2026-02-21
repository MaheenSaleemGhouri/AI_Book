# Quickstart: Docusaurus v3 Site Scaffold

**Feature**: 001-docusaurus-scaffold
**Date**: 2026-02-19

This guide lets a developer verify the scaffold is working correctly in < 5 minutes.

---

## Prerequisites

- Node.js 20 LTS installed (`node --version` → `v20.x.x`)
- pnpm installed (`pnpm --version` → `9.x.x`)
  - If not installed: `npm install -g pnpm@9` (one-time only)
- Git repository cloned and on branch `001-docusaurus-scaffold`

---

## Step 1 — Install Dependencies

```bash
# From repo root
cd book
pnpm install
```

Expected: no errors, `node_modules/` created inside `book/`, `pnpm-lock.yaml` present.

---

## Step 2 — Start Development Server

```bash
# Inside book/
pnpm start
```

Expected:
- Docusaurus compiles in ~10–15 seconds
- Console shows: `[SUCCESS] Docusaurus website is running at: http://localhost:3000/`
- Browser opens automatically (or navigate manually to `http://localhost:3000/`)

**Verification checklist**:
- [ ] Landing page renders (NOT the Docusaurus default "My Site" page)
- [ ] Hero section visible with "Physical AI & Humanoid Robotics" title
- [ ] Navbar shows robot logo + course title
- [ ] Dark mode is active by default
- [ ] Sidebar shows all 5 sections (Introduction, 4 Modules, Capstone)

---

## Step 3 — Verify All 15 Sidebar Links

Navigate to each sidebar item and confirm no 404 errors:

- [ ] Introduction (intro)
- [ ] Module 1: Week 1–5 (5 items)
- [ ] Module 2: Week 6–7 (2 items)
- [ ] Module 3: Week 8–10 (3 items)
- [ ] Module 4: Week 11–13 (3 items)
- [ ] Capstone: Autonomous Humanoid Project (1 item)

---

## Step 4 — Verify MDX Features

Navigate to the test MDX file (`/module-1-ros2/week-01-intro-physical-ai`):

- [ ] A Mermaid diagram renders (not raw text)
- [ ] A Python code block shows syntax colours + copy button
- [ ] A code block with `showLineNumbers` shows line numbers in the left gutter

---

## Step 5 — Verify Production Build

```bash
# Inside book/
pnpm build
```

Expected:
- Build completes with zero TypeScript errors
- Console shows: `[SUCCESS] Generated static files in "build".`
- `build/` directory created with HTML/CSS/JS output

```bash
# Preview the production build locally
pnpm serve
```

Navigate to the URL shown and repeat verification checklist from Step 2.

---

## Step 6 — Verify GitHub Actions Workflow (after merge to main)

1. Merge `001-docusaurus-scaffold` branch to `main` via PR
2. Go to repository → Actions tab
3. Observe "Deploy Book to GitHub Pages" workflow running
4. Workflow should complete in under 5 minutes
5. Navigate to `https://YOUR_ORG.github.io/YOUR_REPO/`
6. Confirm the live site matches the local preview

---

## Common Issues and Fixes

| Issue | Cause | Fix |
|---|---|---|
| `command not found: pnpm` | pnpm not installed | `npm install -g pnpm@9` |
| `Cannot find module '@fontsource/inter'` | Install not run | `pnpm install` inside `book/` |
| Mermaid shows raw text | Either `markdown.mermaid: true` OR `themes` array missing | Both must be present in `docusaurus.config.ts`; also confirm `pnpm add @docusaurus/theme-mermaid` was run |
| TS error: `'mermaid' does not exist in ThemeConfig` | Missing side-effect import | Add `import '@docusaurus/theme-mermaid'` at top of `docusaurus.config.ts` |
| 404 on sidebar link | MDX file missing | Create the file with placeholder content |
| TypeScript error on CSS Module import | Missing `@docusaurus/tsconfig` extend | Check `tsconfig.json` has `"extends": "@docusaurus/tsconfig"` |
| TS errors in `node_modules` during build | `skipLibCheck` missing | Add `"skipLibCheck": true` to `tsconfig.json` `compilerOptions` |
| GitHub Pages returns 404 | Wrong `baseUrl` in config | Set `baseUrl: '/YOUR_REPO/'` |
