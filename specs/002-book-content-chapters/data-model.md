# Data Model: MDX Chapter Content Schema

**Phase**: 1 (Design)
**Date**: 2026-02-19
**Feature**: 002-book-content-chapters

---

## Chapter Content Schema

Every chapter file is an MDX document conforming to the following schema. This is the authoritative content contract — deviations are a blocking defect.

### Frontmatter Schema

```yaml
---
title: "<Full chapter title>"         # Required. Displayed in browser tab and sidebar.
sidebar_label: "<Short label>"         # Required. Displayed in sidebar navigation.
description: "<One sentence for SEO>" # Optional but recommended. Used for meta description.
---
```

### Standard Chapter Schema (13 weekly chapters)

```
Chapter File
├── Frontmatter (YAML)
├── H1: Chapter Title
├── Section: Learning Objectives   [## 🎯 Learning Objectives]
│   └── 3–5 bullet "By the end..." items
├── Section: Introduction          [## Introduction]
│   └── 2–3 prose paragraphs (NO bullet points)
├── Section: Core Concepts         [## Core Concepts]
│   ├── H3 subsections (###)
│   ├── At least 1 Mermaid diagram with caption
│   ├── Admonitions as needed (:::note, :::warning, :::info)
│   └── Cross-reference admonitions (:::tip)
├── Section: Code Examples         [## Code Examples]
│   ├── ### Example 1: <Title>
│   │   └── ```python showLineNumbers (full, runnable snippet)
│   ├── ### Example 2: <Title>
│   │   └── ```python showLineNumbers (full, runnable snippet)
│   └── (optional additional examples)
├── Section: Hands-On Exercise     [## 🛠️ Hands-On Exercise]
│   ├── Difficulty: [Beginner/Intermediate/Advanced]
│   ├── Goal: one sentence
│   ├── Numbered steps
│   └── Expected Output block
├── Section: Summary               [## Summary]
│   └── 4–6 bullet key takeaways
├── Section: Quiz                  [## 📝 Quiz]
│   └── Exactly 5 questions × 4 options × 1 ✅ correct
└── Section: Further Reading       [## 📚 Further Reading]
    └── Exactly 3 authoritative links with one-line descriptions
```

### Capstone Chapter Schema (variant)

```
Capstone File
├── Frontmatter (YAML)
├── H1: "Capstone: The Autonomous Humanoid"
├── Section: Learning Objectives   [## 🎯 Learning Objectives]
├── Section: Introduction          [## Introduction]
├── Section: Core Concepts         [## Project Overview]
│   ├── System architecture Mermaid diagram
│   └── Milestone dependency Mermaid diagram
├── Section: Code Examples         [## Implementation Guide]
│   ├── Milestone 1: Voice Pipeline
│   ├── Milestone 2: LLM Task Planner
│   ├── Milestone 3: ROS 2 Navigation
│   ├── Milestone 4: Object Detection
│   └── Milestone 5: Grasping Execution
├── Section: Hands-On Exercise     [## Integration Guide]
│   └── Wiring all milestones via MainOrchestrator node
├── Section: Summary               [## Summary]
├── Section: Submission Checklist  [## ✅ Submission Checklist]  ← REPLACES QUIZ
│   └── 10 verifiable checklist items
└── Section: Further Reading       [## 📚 Further Reading]
    └── Exactly 3 links
```

### Intro Page Schema (variant)

```
Intro File (intro.md)
├── Frontmatter (YAML)
├── H1: "Welcome to Physical AI & Humanoid Robotics"
├── Section: What is Physical AI
├── Section: Course Structure (Mermaid learning journey diagram)
├── Section: Prerequisites
├── Section: How to Use This Book
└── Section: Getting Help
NOTE: No Learning Objectives section. No Quiz section.
```

---

## Content Entities

### Chapter

| Field | Type | Constraint |
|-------|------|------------|
| filename | string | Pattern: `week-NN-<slug>.mdx` or `intro.md` or `capstone/autonomous-humanoid-project.mdx` |
| title | string | Matches existing placeholder |
| sidebar_label | string | Matches existing placeholder |
| module | enum | module-1-ros2 \| module-2-simulation \| module-3-isaac \| module-4-vla \| capstone |
| word_count | int | prose ≥ 1500 words (excluding code blocks); intro ≥ 800 |
| mermaid_count | int | ≥ 1 per chapter |
| code_example_count | int | ≥ 2 per chapter |
| quiz_question_count | int | == 5 for weekly chapters; == 0 for intro and capstone |
| further_reading_count | int | == 3 for weekly chapters and capstone; == 0 for intro |

### Mermaid Diagram

| Field | Type | Constraint |
|-------|------|------------|
| syntax | string | Valid Mermaid v10 (flowchart, graph, sequenceDiagram) |
| caption | string | Non-empty prose sentence immediately after diagram block |
| renders | bool | Must render without error in `pnpm build` |

### Code Example

| Field | Type | Constraint |
|-------|------|------------|
| language | string | `python` (unless topic requires otherwise) |
| show_line_numbers | bool | Must be `true` (use `python showLineNumbers`) |
| header_comment | string | First line is a `#` comment explaining snippet purpose |
| completeness | enum | Full (all imports, class, main(), spin) for ROS 2 nodes |
| python_version | string | Compatible with Python 3.11+ |
| ros_version | string | ROS 2 Humble (when applicable) |

### Quiz Question

| Field | Type | Constraint |
|-------|------|------------|
| question_number | int | 1–5 |
| text | string | Non-empty; tests understanding, not rote recall |
| options | string[] | Exactly 4 (A, B, C, D) |
| correct_option | string | Exactly 1 marked with ✅ |

### Further Reading Link

| Field | Type | Constraint |
|-------|------|------------|
| title | string | Descriptive |
| url | string | Real, accessible URL (not fabricated) |
| description | string | One-line description of what it covers |
| source_type | enum | official-docs \| arxiv-paper \| vendor-guide \| tutorial |

---

## File Manifest (Complete)

| Batch | Doc ID | File Path | Chapter Title |
|-------|--------|-----------|---------------|
| 1 | `intro` | `docs/intro.md` | Welcome & Course Overview |
| 1 | `module-1-ros2/week-01-intro-physical-ai` | `docs/module-1-ros2/week-01-intro-physical-ai.mdx` | Week 1: Introduction to Physical AI |
| 1 | `module-1-ros2/week-02-embodied-intelligence` | `docs/module-1-ros2/week-02-embodied-intelligence.mdx` | Week 2: Embodied Intelligence & Sensor Systems |
| 2 | `module-1-ros2/week-03-ros2-architecture` | `docs/module-1-ros2/week-03-ros2-architecture.mdx` | Week 3: ROS 2 Architecture & Core Concepts |
| 2 | `module-1-ros2/week-04-nodes-topics-services` | `docs/module-1-ros2/week-04-nodes-topics-services.mdx` | Week 4: Nodes, Topics, Services & Actions |
| 2 | `module-1-ros2/week-05-ros2-packages` | `docs/module-1-ros2/week-05-ros2-packages.mdx` | Week 5: Building ROS 2 Packages with Python |
| 3 | `module-2-simulation/week-06-gazebo-setup` | `docs/module-2-simulation/week-06-gazebo-setup.mdx` | Week 6: Gazebo Simulation Environment |
| 3 | `module-2-simulation/week-07-urdf-sdf` | `docs/module-2-simulation/week-07-urdf-sdf.mdx` | Week 7: URDF/SDF & Physics Simulation |
| 4 | `module-3-isaac/week-08-isaac-platform` | `docs/module-3-isaac/week-08-isaac-platform.mdx` | Week 8: NVIDIA Isaac Sim & Isaac SDK |
| 4 | `module-3-isaac/week-09-perception-manipulation` | `docs/module-3-isaac/week-09-perception-manipulation.mdx` | Week 9: AI Perception, Manipulation & RL |
| 4 | `module-3-isaac/week-10-sim-to-real` | `docs/module-3-isaac/week-10-sim-to-real.mdx` | Week 10: Sim-to-Real Transfer |
| 5 | `module-4-vla/week-11-humanoid-kinematics` | `docs/module-4-vla/week-11-humanoid-kinematics.mdx` | Week 11: Humanoid Kinematics & Bipedal Locomotion |
| 5 | `module-4-vla/week-12-bipedal-locomotion` | `docs/module-4-vla/week-12-bipedal-locomotion.mdx` | Week 12: Manipulation, Grasping & HRI |
| 5 | `module-4-vla/week-13-conversational-robotics` | `docs/module-4-vla/week-13-conversational-robotics.mdx` | Week 13: Conversational Robotics |
| 6 | `capstone/autonomous-humanoid-project` | `docs/capstone/autonomous-humanoid-project.mdx` | Capstone: The Autonomous Humanoid |
