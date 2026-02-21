# Research: Dark Brown & Beige Theme Overhaul

**Feature**: `003-dark-beige-theme`
**Date**: 2026-02-20
**Phase**: 0 — Pre-Design Research

---

## Finding 1: Landing Page Is Component-Based, Not Monolithic

**Decision**: Phase C must target 5 separate component CSS modules — NOT `pages/index.module.css`.

**Rationale**: The approved plan assumed `book/src/pages/index.tsx` contained inline JSX with classNames, which could be updated via Phase E. Investigation of the actual codebase reveals:

- `book/src/pages/index.tsx` is a thin shell that delegates to 5 sub-components
- Each sub-component owns its own CSS module in `book/src/components/landing/`
- `book/src/pages/index.module.css` **exists but is not imported by any file** — it is a legacy/unused artifact
- No component imports from `pages/index.module.css`

**Actual component → CSS module mapping:**

| Component | CSS Module | Key ClassNames |
|-----------|-----------|---------------|
| `HeroSection.tsx` | `HeroSection.module.css` | `.hero`, `.heroInner`, `.heroTitle`, `.heroTagline`, `.heroButton` |
| `WhyPhysicalAI.tsx` | `WhyPhysicalAI.module.css` | `.featuresSection`, `.featureGrid`, `.featureCard`, `.featureIcon`, `.featureTitle`, `.featureDescription` |
| `CourseModules.tsx` | `CourseModules.module.css` | `.modulesSection`, `.moduleGrid`, `.moduleCard`, `.moduleNumber`, `.moduleTitle`, `.moduleWeeks`, `.moduleSummary` |
| `LearningOutcomes.tsx` | `LearningOutcomes.module.css` | `.outcomesSection`, `.outcomeList`, `.sectionTitle` |
| `HardwareOverview.tsx` | `HardwareOverview.module.css` | `.hardwareSection`, `.hardwareGrid`, `.hardwareDescription`, `.ctaSection`, `.ctaTitle`, `.ctaButton` |

**Alternatives considered**: Consolidating all JSX into `index.tsx` and all CSS into `index.module.css` — **rejected** because it violates "zero structural changes" and "zero JSX changes".

**Impact on plan**: Phase C expands to cover 5 component CSS files. Phase E (update `index.tsx` classNames) is **eliminated** — components already reference their own modules. Total modified files increases from 4 to 8 (sidebars.ts + docusaurus.config.ts + custom.css + 5 component CSS modules).

---

## Finding 2: className Mismatches Between Plan and Actual Code

**Decision**: Use actual component classNames when writing replacement CSS. Do NOT introduce new classNames unless adding new functionality.

**Rationale**: The approved plan's CSS used some className names that do not match the actual component code:

| Plan className | Actual className in component | Component |
|---------------|------------------------------|-----------|
| `.featureDesc` | `.featureDescription` | `WhyPhysicalAI.tsx` |
| `.moduleDesc` | `.moduleWeeks` + `.moduleSummary` (two fields) | `CourseModules.tsx` |
| `.heroCta` | `.heroButton` | `HeroSection.tsx` |
| `.footerCta` | `.ctaButton` | `HardwareOverview.tsx` |
| `.footerCtaSection` | `.ctaSection` | `HardwareOverview.tsx` |
| `.footerCtaTitle` | `.ctaTitle` | `HardwareOverview.tsx` |
| `.footerCtaSubtitle` | (does not exist) | — |
| `.modulesGrid` | `.moduleGrid` | `CourseModules.tsx` |

**Impact on plan**: Each component CSS rewrite must use the actual className from the TSX (zero JSX changes = zero className changes in TSX). The new CSS values (colors, animations) apply to the actual classNames.

---

## Finding 3: Sidebar Key Must Stay `courseSidebar`

**Decision**: Keep `courseSidebar` as the sidebar identifier in `sidebars.ts`.

**Rationale**: `docusaurus.config.ts` references `sidebarId: 'courseSidebar'` in the navbar items. Changing to `tutorialSidebar` (as in the approved plan) would cause a build error unless `docusaurus.config.ts` is also updated. Phase A limits config changes to `headTags` + `colorMode` only.

**Correct approach**: Update the sidebar doc IDs, labels, and `collapsed` states — but keep the key as `courseSidebar`. The doc IDs themselves are correct in the current file.

**Verification**: Current `sidebars.ts` already has the correct 15 doc IDs in the correct format. The only changes needed are:
- `collapsed: false → true` for Modules 2, 3, 4 and Capstone
- Add emoji labels (optional but specified by user)
- Wrap `intro` in a `type: 'doc'` object with label

---

## Finding 4: `colorMode` Already Partially Correct

**Decision**: Update only `disableSwitch` and `respectPrefersColorScheme`. Do not modify `defaultMode`.

**Rationale**: Current config has:
```typescript
colorMode: {
  defaultMode: 'dark',     // ✅ already correct
  disableSwitch: false,    // ❌ must be true
  respectPrefersColorScheme: true,  // ❌ must be false
},
```
Only 2 of 3 fields need changing. The `defaultMode: 'dark'` is already set correctly.

---

## Finding 5: Font Stack Replacement

**Decision**: Remove `@fontsource/inter` imports from `custom.css`. Keep `@fontsource/jetbrains-mono`.

**Rationale**: Current `custom.css` imports Inter font (4 weights: 400, 400-italic, 500, 600) and JetBrains Mono (400, 500 weights). The new theme uses:
- Syne + Space Grotesk → loaded via Google Fonts `headTags` (no CSS import needed)
- JetBrains Mono → loaded via `@fontsource/jetbrains-mono` CSS imports

The Inter imports must be removed to eliminate the unused font download. JetBrains Mono import changes from weights `400 + 500` to `400 + 600`.

---

## Finding 6: Prism Code Theme Override

**Decision**: Use `custom.css` `.token.*` selectors to override Prism colors. Do NOT change `prismThemes.dracula` in config.

**Rationale**: The config currently specifies `darkTheme: prismThemes.dracula`. The `custom.css` `.token.*` overrides in Phase B will override Dracula's colors with the Dark Brown & Beige palette at the CSS level. This is simpler than changing the Prism theme in config and avoids touching any non-specified config fields.

---

## Summary of Adaptation

| Original Plan | Adapted Plan |
|--------------|-------------|
| Modify 4 files | Modify 8 files |
| Rewrite `pages/index.module.css` | Rewrite 5 component CSS modules |
| Phase E: update `index.tsx` classNames | Phase E: eliminated (not needed) |
| Use `tutorialSidebar` key | Keep `courseSidebar` key |
| Use plan classNames (featureDesc, etc.) | Use actual component classNames |

All 23 functional requirements from the spec remain achievable. The visual output is identical — only the file targeting changes.
