---
id: 001
title: Dark Brown Beige Theme Spec
stage: spec
date: 2026-02-20
surface: agent
model: claude-sonnet-4-6
feature: 003-dark-beige-theme
branch: 003-dark-beige-theme
user: user
command: /sp.specify
labels: ["theme", "typography", "docusaurus", "css", "spec"]
links:
  spec: specs/003-dark-beige-theme/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-dark-beige-theme/spec.md
  - specs/003-dark-beige-theme/checklists/requirements.md
  - history/prompts/003-dark-beige-theme/001-dark-beige-theme-spec.spec.prompt.md
tests:
  - "pnpm build inside book/ must pass with zero errors (post-implementation)"
---

## Prompt

Apply the Dark Brown & Beige theme and premium typography system to the Physical AI & Humanoid Robotics Docusaurus book site. This spec replaces ALL colors and fonts across the entire site to match the approved preview design (Option 3). Only styling files are touched — zero structural, content, or MDX changes.

WHAT WE ARE BUILDING: A complete visual overhaul using Dark Brown & Beige color palette (espresso brown backgrounds, warm beige accent, cream text), Typography (Syne 800 for headings, Space Grotesk for body/UI, JetBrains Mono for code), smooth animated hover effects on all interactive elements, and all 15 sidebar links correctly wired.

APPROVED COLOR PALETTE: Darkest #0F0804, Base #1A0F0A, Surface #2C1810, Elevated #3D2314, Border #5C3D2A. Accent Primary #C8A882. Text Primary #F5E6D0. Code Background #0A0503.

APPROVED TYPOGRAPHY: Syne 700/800 for headings, Space Grotesk 400/600/700 for body, JetBrains Mono 400/600 for code.

FILES TO MODIFY (ONLY THESE 4): book/docusaurus.config.ts, book/src/css/custom.css, book/src/pages/index.tsx, book/src/pages/index.module.css, book/sidebars.ts.

DO NOT TOUCH: docs/**, static/**, package.json, .github/**, any backend files.

DEFINITION OF DONE: 12-point checklist including dark espresso background, beige accent, Syne headings, Space Grotesk body, JetBrains Mono code, all 4 module cards animate, all 3 feature cards animate, both CTA buttons animate, sidebar links animate, all 15 sidebar links open correct pages, pnpm build passes zero errors, visual match to approved preview.

## Response snapshot

Created feature branch `003-dark-beige-theme` and wrote a complete specification covering 4 prioritized user stories (P1: Global Palette, P2: Typography, P3: Animations, P4: Sidebar Links). Spec includes 23 functional requirements, 7 measurable success criteria, 4 edge cases, and a full assumptions section. Quality checklist validated — all items pass, no NEEDS CLARIFICATION markers.

Key spec decisions:
- Color mode locked to dark-only (disableSwitch: true) — single palette, no light mode
- 5-file scope strictly bounded: docusaurus.config.ts, custom.css, index.module.css, index.tsx (classNames only), sidebars.ts
- All animations pure CSS — FR-021 explicitly prohibits JavaScript
- FR-022 specifies the exact 15-chapter structure (5+2+3+3+1+intro)

## Outcome

- ✅ Impact: Complete feature specification ready for planning — zero ambiguity, all requirements testable
- 🧪 Tests: Build exit code 0 and visual inspection after implementation
- 📁 Files: specs/003-dark-beige-theme/spec.md, specs/003-dark-beige-theme/checklists/requirements.md
- 🔁 Next prompts: `/sp.plan` to generate implementation plan; `/sp.clarify` if any requirements need refinement
- 🧠 Reflection: User provided an exceptionally detailed spec with exact hex values, pixel values, and file constraints — no clarification needed; all 23 FRs derived directly from user input

## Evaluation notes (flywheel)

- Failure modes observed: PowerShell 5 Join-Path multi-arg limitation caused script error (prompts dir not created by script); workaround: manual mkdir
- Graders run and results (PASS/FAIL): Quality checklist — all 12 items PASS
- Prompt variant (if applicable): null
- Next experiment: Pre-check PowerShell version before running create-new-feature.ps1 to handle PS5 vs PS7 Join-Path differences
