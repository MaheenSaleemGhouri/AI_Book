# Feature Specification: Book Content — All 13 Weeks + Capstone (MDX Chapters)

**Feature Branch**: `002-book-content-chapters`
**Created**: 2026-02-19
**Status**: Draft
**Input**: User description: "Write the complete educational content for all 13 weeks plus the capstone chapter of the 'Physical AI & Humanoid Robotics' textbook. 15 complete MDX chapter files inside `book/docs/`. No frontend changes — just the textbook content."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student Reads a Weekly Chapter and Gains Measurable Knowledge (Priority: P1)

A student enrolled in the Physical AI & Humanoid Robotics course opens a weekly chapter in the browser. They read the introduction, work through core concepts, study code examples, and complete the hands-on exercise. By the end they answer the quiz and know whether they understood the material.

**Why this priority**: This is the primary learning loop of the entire textbook. Without complete, correct chapters, nothing else functions.

**Independent Test**: Can be tested by opening any single `.mdx` chapter in the deployed site, reading it end-to-end, and verifying every section is present, accurate, and coherent.

**Acceptance Scenarios**:

1. **Given** a student opens `week-03-ros2-architecture.mdx`, **When** they read the chapter, **Then** they can define every technical term, interpret the Mermaid diagram, run both code examples, and answer all 5 quiz questions with no external reference.
2. **Given** a student reads the learning objectives section at the start, **When** they finish the chapter, **Then** each stated objective is demonstrably satisfied by content within that same chapter.
3. **Given** a student is new to ROS 2 but knows Python, **When** they encounter a technical term for the first time in any chapter, **Then** that term is defined inline within that chapter — not assumed from prior reading.

---

### User Story 2 - Student Completes a Hands-On Exercise on Their Own Machine (Priority: P1)

A student follows the numbered exercise steps listed in the Hands-On Exercise section of a chapter. They run commands, write code, or configure software, and arrive at the documented expected output.

**Why this priority**: Practical exercises are the primary differentiator between passive reading and active skill development — they are central to the course's learning outcomes.

**Independent Test**: Any single exercise can be tested independently by following its numbered steps on a clean Ubuntu 22.04 environment and confirming the stated expected output is produced.

**Acceptance Scenarios**:

1. **Given** a student has the prerequisite software installed, **When** they follow the exercise steps for Week 3, **Then** they see ROS 2 messages flowing between `talker` and `listener` nodes exactly as described.
2. **Given** a [Beginner]-labeled exercise, **When** a student with basic Python knowledge attempts it, **Then** they can complete it without consulting external documentation beyond what the chapter provides.
3. **Given** a student encounters an unexpected result, **Then** the expected output description is specific enough that they can identify the discrepancy.

---

### User Story 3 - Student Validates Their Own Learning via the Chapter Quiz (Priority: P2)

After reading a chapter, a student attempts the 5 quiz questions. The questions challenge their conceptual understanding — not just memorization of definitions — and the correct answers are clearly marked.

**Why this priority**: Quizzes provide self-assessment and reinforce retention. They are a key quality signal for chapter completeness.

**Independent Test**: A subject-matter expert can review each chapter's 5 questions and verify: (a) they are answerable only by students who read the chapter, (b) they test understanding rather than recall, and (c) exactly one answer per question is unambiguously correct.

**Acceptance Scenarios**:

1. **Given** a student who read Week 4 carefully, **When** they attempt its 5 quiz questions, **Then** they can correctly identify the right answer through reasoning, not guessing.
2. **Given** the quiz section, **When** reviewed by any contributor, **Then** each question has exactly 4 options, exactly 1 marked correct with ✅, and no trick questions that contradict chapter content.
3. **Given** a student skipped the chapter and only reads definitions from external sources, **When** they attempt the quiz, **Then** they cannot answer application-level questions correctly without having done the reading.

---

### User Story 4 - Educator Assigns Chapters as a Structured 13-Week Curriculum (Priority: P2)

An educator assigns one chapter per week to students. Each chapter stands alone as a complete lesson and connects logically to adjacent weeks. The 4 modules progress from fundamentals to advanced topics in a coherent sequence.

**Why this priority**: Structural coherence and pedagogical progression determine whether this is a real textbook or a collection of disconnected articles.

**Independent Test**: An educator can review the full chapter list, confirm each builds on the previous, and build a complete 13-week syllabus without needing to supplement with external resources.

**Acceptance Scenarios**:

1. **Given** Weeks 1–5 (Module 1), **When** read in sequence, **Then** each chapter references concepts from previous weeks via inline cross-reference notes, and no chapter assumes knowledge that was not yet introduced.
2. **Given** the 4-module structure (ROS 2 → Gazebo → NVIDIA Isaac → VLA), **When** an educator reviews it, **Then** the module boundaries are clear, each module has a distinct focus, and the capstone integrates all 4 modules.

---

### User Story 5 - Student Completes the Capstone Project (Priority: P3)

A student who has completed all 13 weeks uses the Capstone chapter as a project guide to build a simulated humanoid that receives voice commands, plans tasks via an LLM, navigates obstacles, detects objects with computer vision, and grasps them using MoveIt2. They check off all 10 items in the Submission Checklist before submitting.

**Why this priority**: The capstone is the culminating deliverable that demonstrates mastery. It must integrate all prior learning.

**Independent Test**: A student who has completed Weeks 1–13 can open the capstone chapter and, with no additional instruction, implement all 5 milestones and satisfy all 10 checklist items.

**Acceptance Scenarios**:

1. **Given** a student starts Milestone 1 (Voice pipeline), **When** they follow the implementation steps, **Then** they produce a working Whisper-based transcription pipeline that feeds into Milestone 2.
2. **Given** the 10-item Submission Checklist, **When** all items are checked, **Then** the student has demonstrably built a functioning integrated system — not just run isolated scripts.
3. **Given** the "Common Failure Modes" section, **When** a student's integration fails, **Then** they can identify the most likely cause from the documented list and apply the suggested fix.

---

### Edge Cases

- What happens when a chapter's Mermaid diagram syntax is malformed? The build step (`pnpm build`) must pass clean — any syntax error fails the acceptance criteria.
- How should cross-references handle concepts that need both a link and a brief recap? Each cross-reference must include a one-line inline summary, not just a bare link.
- What if a code example requires physical hardware (e.g., a real RealSense camera)? Every exercise must include a simulation or mock-data fallback so students without hardware can complete it.
- How does the capstone handle students who skipped earlier modules? The capstone must include explicit prerequisite callouts per milestone so students know what prior chapters to revisit.

---

## Requirements *(mandatory)*

### Functional Requirements

**Content Completeness**

- **FR-001**: All 15 MDX files MUST be written with complete, substantive content — no placeholder text, "Coming Soon" notices, or TODO markers.
- **FR-002**: Every chapter file MUST contain the 8 mandatory sections in this exact order: Learning Objectives, Introduction, Core Concepts, Code Examples, Hands-On Exercise, Summary, Quiz, Further Reading.
- **FR-003**: The Capstone chapter MUST use the variant structure: the Quiz section is replaced by a 10-item Submission Checklist; all other 7 sections are present.
- **FR-004**: The Intro page (`docs/intro.md`) MUST NOT contain a Quiz section — it is an orientation page only.

**Diagrams**

- **FR-005**: Every chapter MUST contain at least one Mermaid.js diagram that renders correctly in Docusaurus.
- **FR-006**: Every Mermaid diagram MUST have a prose caption immediately following it, explaining what the diagram illustrates.

**Code Examples**

- **FR-007**: Every chapter MUST contain at minimum 2 code examples (the capstone may have more, distributed across milestones).
- **FR-008**: All Python code examples MUST use `python showLineNumbers` code fences.
- **FR-009**: Every code block MUST begin with a comment line explaining the purpose of the entire snippet.
- **FR-010**: ROS 2 Python examples MUST include complete node setup: all imports, a class inheriting from `Node`, a `main()` function, and `rclpy.spin()` or equivalent.

**Quiz Standards**

- **FR-011**: Every non-capstone, non-intro chapter MUST contain exactly 5 multiple-choice questions.
- **FR-012**: Each quiz question MUST have exactly 4 answer options (A, B, C, D) with exactly 1 correct answer marked with ✅.
- **FR-013**: Quiz questions MUST test conceptual understanding and application, not rote recall of definitions.

**Writing Standards**

- **FR-014**: Every technical term MUST be defined on its first appearance within each chapter, regardless of whether it was defined in a previous chapter.
- **FR-015**: When a concept from a prior week is referenced, an inline cross-reference note MUST be included (e.g., `(see Week 3: ROS 2 Architecture)`).
- **FR-016**: The Introduction section of each chapter MUST be written as flowing prose — no bullet points permitted.
- **FR-017**: Each chapter's prose content MUST be substantial enough to represent 45–90 minutes of reading and exercise time (approximately 1500–3000 words of prose, excluding code blocks).

**Further Reading**

- **FR-018**: Every chapter except the Capstone and Intro MUST contain exactly 3 Further Reading links.
- **FR-019**: Every Further Reading link MUST point to a real, authoritative source (official documentation, peer-reviewed papers, or vendor guides) — no broken or fabricated URLs.

**Build Integrity**

- **FR-020**: Running `pnpm build` inside `book/` MUST complete with zero errors and zero warnings after all chapter files are written.
- **FR-021**: All internal cross-reference links between chapters MUST resolve to valid pages in the deployed site.

**Scope Boundary**

- **FR-022**: This feature MUST NOT modify any Docusaurus configuration files, React components, backend code, authentication systems, or CI/CD pipelines.
- **FR-023**: This feature MUST NOT create or modify any file outside of `book/docs/`.

### Key Entities

- **Chapter File**: An MDX file in `book/docs/` representing one week's lesson or the capstone project guide. Contains 8 structured sections (or the capstone variant). Identified by filename.
- **Module**: A grouping of thematically related weekly chapters. There are 4 modules: Module 1 — ROS 2 (Weeks 1–5), Module 2 — Gazebo (Weeks 6–7), Module 3 — NVIDIA Isaac (Weeks 8–10), Module 4 — VLA (Weeks 11–13).
- **Learning Objective**: A measurable, specific statement of what a student will be able to do after reading the chapter. Each chapter has 3–5 objectives.
- **Mermaid Diagram**: A code-fenced diagram using Mermaid.js syntax that renders as an SVG in Docusaurus. Each chapter has at least 1, with a caption.
- **Code Example**: A complete, runnable Python snippet in a `python showLineNumbers` code fence, with a top-level comment. Each chapter has at least 2.
- **Quiz Question**: A multiple-choice question with 4 options and 1 correct answer (marked ✅). Non-intro, non-capstone chapters have exactly 5.
- **Submission Checklist**: The capstone's 10-item checklist replacing the Quiz section. Each item is a verifiable, concrete deliverable the student must complete before submission.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 15 chapter files exist with substantive content — the site builds cleanly and every chapter page loads correctly.
- **SC-002**: A student with Python experience but no robotics background can complete any single chapter (reading, code examples, and exercise) within 45–90 minutes.
- **SC-003**: Every quiz question is independently verifiable as answerable by a student who read the chapter, and not reliably answerable without that reading.
- **SC-004**: All code examples produce the documented expected output when run in the specified environment, with zero unexplained errors.
- **SC-005**: The 4-module structure forms a coherent learning progression: each module builds demonstrably on the previous, and the capstone integrates concepts from all 4 modules.
- **SC-006**: `pnpm build` inside `book/` completes with zero warnings or errors after all 15 files are written.
- **SC-007**: Every Mermaid diagram renders correctly in the deployed site — no syntax errors, no blank diagram boxes.
- **SC-008**: All Further Reading links resolve to live, authoritative external pages at time of writing.

---

## Assumptions

- The Docusaurus site (`book/`) is already fully configured and deployed (Spec 1 complete). No configuration changes are needed.
- The `book/docs/` directory already exists. Chapter files will be created within it.
- The Mermaid plugin is already enabled in the Docusaurus configuration.
- Students are assumed to have: basic Python programming ability, a Linux/Ubuntu environment (or WSL2 on Windows), and familiarity with command-line tools.
- ROS 2 Humble (LTS) is the target distribution for all ROS 2 code examples.
- Where exercises require specific hardware (e.g., Intel RealSense camera), a software mock or dataset alternative is provided within the chapter.
- Code examples are correct and runnable assuming documented prerequisites are installed — they are not self-contained installers.
- Further reading URLs are verified as live as of 2026-02-19; link rot may occur over time.
- The capstone is intended for students who have completed all 13 weekly chapters; prerequisites are documented per milestone within the capstone.
- The filename `week-12-bipedal-locomotion.mdx` is used as specified in the requirements, even though its content covers Manipulation/HRI — this naming discrepancy is accepted as-is per user specification.

---

## Out of Scope

- Changes to `docusaurus.config.ts`, `sidebars.ts`, or any other Docusaurus configuration files
- New React components or UI changes
- The RAG chatbot / ChatWidget
- Backend / FastAPI server
- Authentication or user accounts
- GitHub Actions or CI/CD pipeline changes
- Physical hardware setup guides beyond references within chapter exercises
- Video content, downloadable datasets, or interactive coding environments
- Translations or localization of any chapter

---

## File Manifest

The following 15 files will be created in `book/docs/`:

| # | Filename | Module | Chapter Title |
|---|----------|--------|---------------|
| 1 | `intro.md` | Orientation | Welcome & Course Overview |
| 2 | `week-01-intro-physical-ai.mdx` | Module 1: ROS 2 | Introduction to Physical AI |
| 3 | `week-02-embodied-intelligence.mdx` | Module 1: ROS 2 | Embodied Intelligence & Sensor Systems |
| 4 | `week-03-ros2-architecture.mdx` | Module 1: ROS 2 | ROS 2 Architecture & Core Concepts |
| 5 | `week-04-nodes-topics-services.mdx` | Module 1: ROS 2 | Nodes, Topics, Services & Actions |
| 6 | `week-05-ros2-packages.mdx` | Module 1: ROS 2 | Building ROS 2 Packages with Python |
| 7 | `week-06-gazebo-setup.mdx` | Module 2: Gazebo | Gazebo Simulation Environment |
| 8 | `week-07-urdf-sdf.mdx` | Module 2: Gazebo | URDF/SDF & Physics Simulation |
| 9 | `week-08-isaac-platform.mdx` | Module 3: Isaac | NVIDIA Isaac Sim & Isaac SDK |
| 10 | `week-09-perception-manipulation.mdx` | Module 3: Isaac | AI Perception, Manipulation & RL |
| 11 | `week-10-sim-to-real.mdx` | Module 3: Isaac | Sim-to-Real Transfer |
| 12 | `week-11-humanoid-kinematics.mdx` | Module 4: VLA | Humanoid Kinematics & Bipedal Locomotion |
| 13 | `week-12-bipedal-locomotion.mdx` | Module 4: VLA | Manipulation, Grasping & HRI |
| 14 | `week-13-conversational-robotics.mdx` | Module 4: VLA | Conversational Robotics |
| 15 | `capstone/autonomous-humanoid-project.mdx` | Capstone | Autonomous Humanoid Project |
