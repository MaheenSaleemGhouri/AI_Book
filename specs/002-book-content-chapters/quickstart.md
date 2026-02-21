# Quickstart: Writing a Chapter

**Feature**: 002-book-content-chapters
**Date**: 2026-02-19

---

## Prerequisites

- Node.js 20 LTS installed
- pnpm installed globally (`npm install -g pnpm@9`)
- Repo cloned; branch `002-book-content-chapters` checked out
- `pnpm install` completed inside `book/`

## Development Workflow

### 1. Start the dev server (optional, for visual diagram preview)

```bash
cd /c/Book/book
pnpm start
```

This opens `http://localhost:3000` with hot-reload. Use this to visually verify Mermaid diagrams render correctly.

### 2. Write or overwrite a chapter file

Open the target file in `book/docs/`. Example:

```
book/docs/module-1-ros2/week-01-intro-physical-ai.mdx
```

**Fully replace** all placeholder content. Keep the existing frontmatter `title` and `sidebar_label` values.

### 3. Verify build after each batch

```bash
cd /c/Book/book
pnpm build
```

Expected: `Build successful!` with zero errors and zero warnings.

---

## Chapter Writing Checklist

Before marking a chapter as done, verify all of the following:

- [ ] `title` and `sidebar_label` frontmatter preserved
- [ ] `description` frontmatter added (SEO)
- [ ] All 8 sections present in correct order
- [ ] Learning Objectives: 3–5 measurable bullet points
- [ ] Introduction: 2–3 prose paragraphs, zero bullet points
- [ ] Core Concepts: H3 subsections, all terms defined on first use
- [ ] At least 1 Mermaid diagram with prose caption
- [ ] At least 2 code examples using ` ```python showLineNumbers `
- [ ] Every code block has a top-line `#` comment
- [ ] All ROS 2 nodes: full imports + class + main() + spin
- [ ] Hands-On Exercise: difficulty label, goal, numbered steps, Expected Output
- [ ] Summary: 4–6 bullet takeaways
- [ ] Quiz: exactly 5 questions, 4 options each, exactly 1 ✅
- [ ] Further Reading: exactly 3 real, accessible URLs
- [ ] No placeholder text ("Coming Soon", "TODO", "TBD")
- [ ] Cross-references use `/module-X-Y/week-NN-slug` (no `/docs/` prefix)
- [ ] `pnpm build` passes with zero errors

---

## Cross-Reference URL Pattern

Since `routeBasePath: '/'` in `docusaurus.config.ts`, all internal links omit `/docs/`:

```mdx
✅ CORRECT: [Week 3: ROS 2 Architecture](/module-1-ros2/week-03-ros2-architecture)
❌ WRONG:   [Week 3: ROS 2 Architecture](/docs/module-1-ros2/week-03-ros2-architecture)
```

**Cross-reference admonition pattern**:
```mdx
:::tip Related Chapter
This concept builds on material from [Week 3: ROS 2 Architecture](/module-1-ros2/week-03-ros2-architecture). Review it if you need a refresher on the ROS 2 computation graph.
:::
```

---

## Quick URL Reference (All Chapters)

| Week | Doc ID | URL |
|------|--------|-----|
| Intro | `intro` | `/intro` |
| Week 1 | `module-1-ros2/week-01-intro-physical-ai` | `/module-1-ros2/week-01-intro-physical-ai` |
| Week 2 | `module-1-ros2/week-02-embodied-intelligence` | `/module-1-ros2/week-02-embodied-intelligence` |
| Week 3 | `module-1-ros2/week-03-ros2-architecture` | `/module-1-ros2/week-03-ros2-architecture` |
| Week 4 | `module-1-ros2/week-04-nodes-topics-services` | `/module-1-ros2/week-04-nodes-topics-services` |
| Week 5 | `module-1-ros2/week-05-ros2-packages` | `/module-1-ros2/week-05-ros2-packages` |
| Week 6 | `module-2-simulation/week-06-gazebo-setup` | `/module-2-simulation/week-06-gazebo-setup` |
| Week 7 | `module-2-simulation/week-07-urdf-sdf` | `/module-2-simulation/week-07-urdf-sdf` |
| Week 8 | `module-3-isaac/week-08-isaac-platform` | `/module-3-isaac/week-08-isaac-platform` |
| Week 9 | `module-3-isaac/week-09-perception-manipulation` | `/module-3-isaac/week-09-perception-manipulation` |
| Week 10 | `module-3-isaac/week-10-sim-to-real` | `/module-3-isaac/week-10-sim-to-real` |
| Week 11 | `module-4-vla/week-11-humanoid-kinematics` | `/module-4-vla/week-11-humanoid-kinematics` |
| Week 12 | `module-4-vla/week-12-bipedal-locomotion` | `/module-4-vla/week-12-bipedal-locomotion` |
| Week 13 | `module-4-vla/week-13-conversational-robotics` | `/module-4-vla/week-13-conversational-robotics` |
| Capstone | `capstone/autonomous-humanoid-project` | `/capstone/autonomous-humanoid-project` |

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Mermaid diagram not rendering | Check for syntax errors; use `flowchart LR` not `graph LR` if unsupported |
| Build fails with "Broken link" | Internal link uses `/docs/...` prefix — remove it |
| Code block not showing line numbers | Confirm ` ```python showLineNumbers ` (space before `showLineNumbers`) |
| Quiz has wrong answer count | Each question needs exactly 4 options and exactly 1 ✅ |
| ROS 2 code missing imports | Add `import rclpy`, `from rclpy.node import Node` at top |
| `onBrokenLinks: 'throw'` failing | Any internal link that resolves to a non-existent page |
