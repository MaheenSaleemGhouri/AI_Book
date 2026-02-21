# Tasks: Book Content — All 13 Weeks + Capstone (MDX Chapters)

**Input**: Design documents from `specs/002-book-content-chapters/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**Tests**: No TDD tests requested. Build verification (`pnpm build`) serves as the automated gate between batches.

**Organization**: Tasks are grouped by user story and implementation batch. Weeks within a batch are parallelizable; batches are strictly sequential (build gate between each).

**User Story Mapping**:
- **US1** (P1): Student reads a weekly chapter and gains measurable knowledge
- **US2** (P1): Student completes hands-on exercise on their own machine
- **US3** (P2): Student validates their learning via the chapter quiz
- **US4** (P2): Educator assigns chapters as a structured 13-week curriculum
- **US5** (P3): Student completes the capstone project

---

## Phase 1: Setup

**Purpose**: Verify the development environment is working before writing any content.

- [X] T001 Verify all 15 placeholder MDX files exist under `book/docs/` by running `find book/docs -name "*.mdx" -o -name "*.md" | sort` and confirming the file manifest from `specs/002-book-content-chapters/data-model.md`
- [X] T002 Start dev server with `cd book && pnpm start` and confirm site loads at `http://localhost:3000`; verify Mermaid diagrams render in the existing placeholder Week 1 file

**Checkpoint**: Dev server running, all 15 placeholder files confirmed present.

---

## Phase 2: Foundational — Course Introduction Page

**Purpose**: The intro page (`intro.md`) must be written first — it sets the learning journey narrative that all chapter cross-references point back to.

**⚠️ CRITICAL**: `intro.md` must be complete before any chapter's "How to Use This Book" cross-references can be validated.

- [X] T003 Write `book/docs/intro.md` — replace placeholder with complete Welcome & Course Overview page: H1 title, "What is Physical AI" (2 paragraphs), "Course Structure" section with a `flowchart LR` Mermaid diagram showing Module 1 (Weeks 1-5) → Module 2 (Weeks 6-7) → Module 3 (Weeks 8-10) → Module 4 (Weeks 11-13) → Capstone, "Prerequisites" section (Ubuntu 22.04/WSL2, Python 3.11+, Node.js 20, NVIDIA GPU for Module 3+, 16GB RAM), "How to Use This Book" section, "Getting Help" section — NO quiz section, NO Further Reading section — 800–1200 prose words — frontmatter: `title: "Welcome to Physical AI & Humanoid Robotics"`, `sidebar_label: "Course Introduction"`, `description: "A 13-week hands-on course bridging ROS 2, Gazebo simulation, NVIDIA Isaac, and conversational robotics."`
- [X] T004 Run `cd book && pnpm build` and confirm zero errors after writing `intro.md`

**Checkpoint**: Intro page complete and build passes.

---

## Phase 3: US1 + US2 + US3 (P1/P2) — Batch 1: Foundation Chapters (Weeks 1–2)

**Goal**: Deliver the first two complete chapters so a student can read Week 1, run the `SensePlanActRobot` exercise, and pass the 5-question quiz — the earliest independently testable MVP.

**Independent Test**: Open Week 1 in the deployed site. Read all 8 sections. Run `python sense_plan_act_demo.py`. Answer 5 quiz questions. Confirm full experience works end-to-end.

### Implementation — Batch 1 Chapters

- [X] T005 [P] [US1][US2][US3] Write `book/docs/module-1-ros2/week-01-intro-physical-ai.mdx` — complete 8-section chapter: frontmatter (`title: "Week 1: Introduction to Physical AI"`, `sidebar_label: "Week 1: Intro to Physical AI"`, `description`), Learning Objectives (5 bullets: define Physical AI, contrast with LLMs, explain Sense-Plan-Act loop, identify 3+ real humanoid robots, articulate why embodied form matters), Introduction (3 prose paragraphs: what Physical AI is, why 2024-2025 is the inflection point, what this course builds), Core Concepts with subsections ("What Is Physical AI?", "Embodied Intelligence", "The Sense → Plan → Act Loop" with `flowchart LR` Mermaid diagram showing Sense→Plan→Act→[World]→Sense feedback loop and *Caption: The Sense-Plan-Act feedback loop — the fundamental cognitive cycle of every physical AI system*, "The Humanoid Robot Landscape" covering Atlas/Figure 01/Tesla Optimus/Unitree G1, "Why Humanoids?"), Code Examples (Example 1: `SensePlanActRobot` Python class with `sense() -> dict`, `plan(data: dict) -> str`, `act(action: str) -> None` methods in `python showLineNumbers` block with top-comment; Example 2: running the loop 5 times with mock distance/temperature sensor data printing each action), Hands-On Exercise [Beginner] (research 3 humanoid robots, build Python dict `humanoid_robots`, print formatted comparison table using f-strings with 5 columns: manufacturer, locomotion type, payload, use case, year; Expected Output: formatted table in terminal), Summary (5 bullets), Quiz (exactly 5 questions × 4 options × 1 ✅ each — testing application not recall), Further Reading (3 real links: ROS 2 official docs, NVIDIA Isaac robotics overview, peer-reviewed paper on embodied cognition) — 2000–2500 prose words
- [X] T006 [P] [US1][US2][US3] Write `book/docs/module-1-ros2/week-02-embodied-intelligence.mdx` — complete 8-section chapter: frontmatter (`title: "Week 2: Embodied Intelligence & Sensor Systems"`, `sidebar_label: "Week 2: Sensors & Embodiment"`, `description`), Learning Objectives (5 bullets), Introduction (3 prose paragraphs connecting to Week 1 Sense-Plan-Act), Core Concepts with subsections ("What Makes Intelligence Embodied?" with Gibson's affordances and sensorimotor coupling, "LiDAR" with time-of-flight principle + point clouds + SLAM defined, "Depth Cameras (RGB-D)" with Intel RealSense D435i + structured light vs time-of-flight, "IMU" with accelerometer + gyroscope + quaternion output + balance role, "Force/Torque Sensors" with contact detection, "Monocular and Stereo Cameras" with image pipeline, "Sensor Fusion" with complementary filter and EKF overview) with `flowchart TD` Mermaid diagram showing LiDAR→, Camera→, IMU→ all feeding into Sensor Fusion Node→World Model→ROS 2 Topic (with *Caption* explaining the multi-sensor fusion architecture) and :::tip cross-reference to Week 1 (Sense-Plan-Act sensors), Code Examples (Example 1: Python dataclasses `LiDARReading`, `IMUReading`, `CameraFrame`, `SensorFusion` class with `update()` method — full type-hinted code in `python showLineNumbers`; Example 2: `generate_lidar_scan(n_rays: int = 360) -> np.ndarray` function with Gaussian noise simulation), Hands-On Exercise [Intermediate] (install `open3d`, generate 10,000-point random cloud, visualize with `o3d.visualization.draw_geometries()`; Expected Output: Open3D window showing colored 3D point cloud), Summary (5 bullets), Quiz (5 questions), Further Reading (3 links) — 2000–2500 prose words
- [X] T007 Run `cd book && pnpm build` after writing both Batch 1 files — zero errors required before proceeding to Batch 2

**Checkpoint**: Weeks 1–2 complete. Student can independently read, exercise, and quiz on both chapters.

---

## Phase 4: US1 + US2 + US3 (P1/P2) — Batch 2: ROS 2 Core (Weeks 3–5)

**Goal**: Deliver the three ROS 2 core chapters — the pedagogical backbone of Module 1 — bringing a student from theory (Week 1-2) to building real ROS 2 packages with launch files (Week 5).

**Independent Test**: After Week 3, a student can install ROS 2 Humble and verify the talker/listener demo. After Week 5, they can build and launch the `robot_monitor` package with two nodes.

### Implementation — Batch 2 Chapters

- [X] T008 [P] [US1][US2][US3] Write `book/docs/module-1-ros2/week-03-ros2-architecture.mdx` — complete 8-section chapter: frontmatter (`title: "Week 3: ROS 2 Architecture & Core Concepts"`, `sidebar_label: "Week 3: ROS 2 Architecture"`, `description`), Learning Objectives (5 bullets including: explain why ROS 2 replaced ROS 1, describe the computation graph, use key CLI tools, install ROS 2 Humble on Ubuntu 22.04, create and run a minimal Python node), Introduction (3 paragraphs: why middleware matters for multi-robot systems, why ROS 2 is the industry standard, what the student will be able to do by end of chapter), Core Concepts with subsections ("Why ROS 2 Over ROS 1" covering DDS/real-time/security/multi-robot advantages, "The ROS 2 Computation Graph" defining nodes/topics/services/actions/parameters, "DDS: The Communication Backbone" covering QoS profiles and domain isolation, "ROS 2 Distributions" covering Humble LTS/Iron/Jazzy with EOL dates and recommendation, "Installing ROS 2 Humble on Ubuntu 22.04" as a full numbered installation guide in `bash` blocks with :::warning for sudo and :::info for .bashrc sourcing, "The `rclpy` Client Library" overview, "Essential CLI Tools" with `ros2 node list`, `ros2 topic echo`, `ros2 topic hz`, `ros2 run`, `ros2 topic pub`) with `graph TD` Mermaid diagram of 3-node computation graph (SensorNode →|/sensor_data| ProcessorNode →|/cmd_vel| ActuatorNode) plus *Caption*, :::tip cross-reference to Week 2 sensors, Code Examples (Example 1: complete `MinimalNode` rclpy class with timer logging "Hello from ROS 2" every 1 second — full imports, class inheriting Node, `__init__` with `create_timer`, `timer_callback`, `main()`, `rclpy.spin()`, `destroy_node()`, `rclpy.shutdown()`; Example 2: `bash` block with full sequence: source setup.bash + mkdir workspace + colcon build + run node), Hands-On Exercise [Beginner] (install ROS 2 Humble → `ros2 run demo_nodes_py talker` in terminal 1 → `ros2 run demo_nodes_py listener` in terminal 2 → verify with `ros2 topic echo /chatter`; Expected Output: "Hello World: N" messages printed by listener), Summary (5 bullets), Quiz (5 questions), Further Reading (3 links) — 2500–3000 prose words
- [X] T009 [P] [US1][US2][US3] Write `book/docs/module-1-ros2/week-04-nodes-topics-services.mdx` — complete 8-section chapter: frontmatter (`title: "Week 4: Nodes, Topics, Services & Actions"`, `sidebar_label: "Week 4: ROS 2 Communication"`, `description`), Learning Objectives (5 bullets), Introduction (3 paragraphs connecting to Week 3 computation graph), Core Concepts with subsections ("Nodes: The Basic Unit of Computation" with lifecycle nodes, "Topics: Asynchronous Pub/Sub" with QoS policies RELIABLE/BEST_EFFORT/TRANSIENT_LOCAL + common message types `std_msgs`/`sensor_msgs`/`geometry_msgs`, "Services: Synchronous Request/Response" with blocking nature + when to use, "Actions: Long-Running Tasks with Feedback" with goal/feedback/result pattern + `NavigateToPose` example, "Parameters: Runtime Configuration" with declare/get/set, "Choosing the Right Pattern" as a decision table Topic vs Service vs Action) with `graph TD` Mermaid diagram using three subgraphs showing Topic (async), Service (bidirectional sync), Action (goal/feedback/result) side by side plus *Caption*, Code Examples (Example 1: `VelocityPublisher` node publishing `geometry_msgs/msg/Twist` at 10Hz with alternating forward/turn commands — full node; Example 2: `VelocitySubscriber` node subscribing and logging linear.x and angular.z — full node; Example 3 labeled "Bonus Example — Service Communication": `ReverseStringServer` service server returning reversed string — full server + client), Hands-On Exercise [Intermediate] (`BatteryPublisher` publishing random float 0-100 every 2 seconds + `BatteryMonitor` subscriber printing "⚠️ LOW BATTERY: X.X" when value < 20; Expected Output: terminal showing battery values and low-battery alerts), Summary (5 bullets), Quiz (5 questions), Further Reading (3 links) — 2500–3000 prose words
- [X] T010 [P] [US1][US2][US3] Write `book/docs/module-1-ros2/week-05-ros2-packages.mdx` — complete 8-section chapter: frontmatter (`title: "Week 5: Building ROS 2 Packages with Python"`, `sidebar_label: "Week 5: ROS 2 Packages"`, `description`), Learning Objectives (5 bullets including: create a ROS 2 Python package from scratch, write package.xml and setup.py, build with colcon, write a launch file, load parameters from YAML), Introduction (3 paragraphs: why packages matter for modular robotics software), Core Concepts with subsections ("The ROS 2 Workspace Structure" covering src/build/install/log roles, "Creating a Package with `ros2 pkg create`" with `--build-type ament_python` flag, "`package.xml` Deep Dive" with format 3 tags exec_depend/build_depend/test_depend, "`setup.py` and Entry Points" registering nodes as console scripts, "The `colcon build` Command" with `--packages-select` and `--symlink-install`, "Launch Files (`.launch.py`)" with LaunchDescription/Node/DeclareLaunchArgument/LaunchConfiguration, "Parameter YAML Files" with `parameters=[config_file]` pattern, "Package Best Practices" naming and single responsibility) with `flowchart LR` Mermaid diagram: `src/<pkg>/` → [colcon build] → `install/<pkg>/` → [source setup.bash] → [ros2 run] plus *Caption*, Code Examples (Example 1: complete `package.xml` for `robot_monitor` package in `xml` code fence with all required tags; Example 2: complete `setup.py` with `entry_points` for `joint_publisher` and `joint_subscriber` console scripts; Example 3: `robot_monitor.launch.py` using `DeclareLaunchArgument` for `publish_frequency` and launching both nodes with parameters), Hands-On Exercise [Intermediate] (build `robot_monitor` package: `joint_publisher.py` publishing `sensor_msgs/JointState` for 6 joints with random positions every N seconds; `joint_subscriber.py` writing to `joint_log.csv`; launch file defaulting `publish_frequency` to 1.0; Expected Output: `joint_log.csv` accumulating joint state rows + launch command starting both nodes), Summary (5 bullets), Quiz (5 questions), Further Reading (3 links) — 2500–3000 prose words
- [X] T011 Run `cd book && pnpm build` after writing all Batch 2 files — zero errors required before proceeding to Batch 3

**Checkpoint**: Weeks 3–5 complete. Student can build a complete ROS 2 Python package with a launch file.

---

## Phase 5: US1 + US2 + US3 (P1/P2) — Batch 3: Simulation (Weeks 6–7)

**Goal**: Deliver both Gazebo chapters — equipping students to launch a simulated robot world and describe robots with URDF.

**Independent Test**: After Week 6, student can launch Gazebo Harmonic and drive a TurtleBot3. After Week 7, student can build a URDF humanoid skeleton and visualize it in RViz2 with correct TF frames.

### Implementation — Batch 3 Chapters

- [X] T012 [P] [US1][US2][US3] Write `book/docs/module-2-simulation/week-06-gazebo-setup.mdx` — complete 8-section chapter: frontmatter (`title: "Week 6: Gazebo Simulation Environment"`, `sidebar_label: "Week 6: Gazebo Setup"`, `description`), Learning Objectives (4 bullets), Introduction (3 paragraphs: why simulation is essential before hardware, Gazebo's role in the robotics stack, what the student will simulate by end of chapter), Core Concepts with subsections ("Why Simulation?" covering safe testing/scalability/synthetic data, "Gazebo Classic vs Gazebo Harmonic" comparison table with rendering/physics/GPU/ROS integration columns, "Physics Engines" covering ODE/Bullet/DART with use cases, "The Three Building Blocks" worlds/models/plugins, "Installing Gazebo Harmonic" with apt commands + :::info Ubuntu 22.04 requirement, "The `ros_gz_bridge`" with type mapping table, "SDF Format Overview" key tags world/model/link/joint/plugin, "Your First Simulation Launch") with `flowchart LR` Mermaid: Python Controller →|/cmd_vel| Bridge →|/cmd_vel| Gazebo Physics → sensor outputs → Bridge →|/odom /scan| Python Controller plus *Caption*, :::tip cross-reference to Week 5 (launch files), Code Examples (Example 1: minimal SDF world XML with ground plane/directional light/box obstacle in `xml` block with top comment; Example 2: `sim.launch.py` starting Gazebo Harmonic + world file + bridging /cmd_vel and /odom topics in `python showLineNumbers`), Hands-On Exercise [Intermediate] (install TurtleBot3 packages → launch simulation → drive with `ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.2}}"` → record with `ros2 bag record /odom`; Expected Output: `ros2 bag info` showing recorded /odom messages), Summary (5 bullets), Quiz (5 questions), Further Reading (3 links) — 2000–2500 prose words
- [X] T013 [P] [US1][US2][US3] Write `book/docs/module-2-simulation/week-07-urdf-sdf.mdx` — complete 8-section chapter: frontmatter (`title: "Week 7: URDF/SDF Robot Description & Physics Simulation"`, `sidebar_label: "Week 7: URDF & SDF"`, `description`), Learning Objectives (5 bullets), Introduction (3 paragraphs: why robots need a formal description, URDF as the lingua franca), Core Concepts with subsections ("URDF: The Robot Description Language" with link-joint model, "URDF Link Elements" visual/collision/inertial with geometry types, "URDF Joint Types" fixed/revolute/prismatic/continuous with limits+dynamics, "Calculating Inertia Tensors" with table showing box/cylinder/sphere formulas (Ixx/Iyy/Izz) plus URDF `<inertia>` XML snippets for each, "Xacro: DRY Robot Description" with macros/properties/includes, "Converting URDF to SDF" with `gz sdf -p` command, "Visualizing in RViz2" with robot_state_publisher + joint_state_publisher_gui launch pattern, "Adding Sensor Plugins" camera plugin + LiDAR plugin URDF snippets) with `graph TD` Mermaid link-joint tree: base_link → shoulder_joint → upper_arm_link → elbow_joint → forearm_link plus *Caption*, :::tip cross-reference to Week 6 (Gazebo SDF), Code Examples (Example 1: complete 2-DOF arm URDF XML with base_link/shoulder_joint/upper_arm/elbow_joint/forearm — proper inertia/visual cylinder geometry/collision in `xml` block; Example 2: Xacro macro `<xacro:macro name="leg" params="side">` generating hip_link/knee_joint/lower_leg_link in `xml` block), Hands-On Exercise [Advanced] (build simplified humanoid URDF: torso + upper_arm_left + upper_arm_right + lower_arm_left + lower_arm_right + upper_leg_left + upper_leg_right + lower_leg_left + lower_leg_right = 9 links, 8 joints; visualize with `ros2 launch urdf_tutorial display.launch.py` or equivalent; run `ros2 run tf2_tools view_frames`; Expected Output: TF tree PDF/PNG showing all 9 links with correct parent-child relationships), Summary (5 bullets), Quiz (5 questions), Further Reading (3 links) — 2500–3000 prose words
- [X] T014 Run `cd book && pnpm build` after writing both Batch 3 files — zero errors required before proceeding to Batch 4

**Checkpoint**: Weeks 6–7 complete. Student can simulate a robot world and describe robot geometry with URDF.

---

## Phase 6: US1 + US2 + US3 (P1/P2) — Batch 4: NVIDIA Isaac (Weeks 8–10)

**Goal**: Deliver all three NVIDIA Isaac chapters — from platform overview to sim-to-real deployment.

**Independent Test**: After Week 8, student can launch Isaac Sim and verify Franka joint topics in ROS 2. After Week 10, student can export an RL policy to ONNX and run inference with onnxruntime.

### Implementation — Batch 4 Chapters

- [X] T015 [P] [US1][US2][US3] Write `book/docs/module-3-isaac/week-08-isaac-platform.mdx` — complete 8-section chapter: frontmatter (`title: "Week 8: NVIDIA Isaac Sim & Isaac SDK"`, `sidebar_label: "Week 8: NVIDIA Isaac"`, `description`), Learning Objectives (4 bullets), Introduction with opening :::info hardware requirement callout "This module requires an NVIDIA RTX GPU with at least 8 GB of VRAM. If you don't have an RTX GPU, you can follow along with the conceptual sections and screenshots", Core Concepts with subsections ("The NVIDIA Isaac Platform" three tools/three purposes, "Isaac Sim vs Gazebo" comparison table with rendering quality/physics accuracy/GPU requirement/ROS integration/use case rows, "USD: Universal Scene Description" Pixar-originated format/USD stages/prims/schemas, "Isaac ROS: Hardware-Accelerated Nodes" NITROS zero-copy transport/cuVSLAM/cuDNN, "Isaac Lab: GPU-Parallel RL" thousands of parallel envs on one GPU, "System Requirements and Installation" Docker-based + NVIDIA container toolkit, "Connecting Isaac Sim to ROS 2" `isaacsim.ros2_bridge` extension + topic namespacing) with `graph TD` Mermaid: Isaac Sim (photorealistic) ↔ ROS 2 Bridge ↔ Isaac ROS (NITROS); Isaac Lab (GPU RL) → trained policy → Isaac Sim (validation) plus *Caption*, :::tip cross-references to Week 6 (Gazebo comparison) and Week 3 (ROS 2 topics), Code Examples (Example 1: Isaac Sim Python API script to spawn Franka robot and step simulation 100 times using `omni.isaac.core` World + Robot classes — `python showLineNumbers` with top comment; Example 2: complete ROS 2 node subscribing to `/rgb` image topic from Isaac Sim bridge and logging `image.height × image.width` — full rclpy node), Hands-On Exercise [Advanced] (Docker launch of Isaac Sim → open asset browser → load Franka robot → enable ROS 2 bridge extension → `ros2 topic list`; Expected Output: `/joint_states`, `/franka/cmd_joint_position` topics visible in topic list), Summary (4 bullets), Quiz (5 questions), Further Reading (3 links) — 2000–2500 prose words
- [X] T016 [P] [US1][US2][US3] Write `book/docs/module-3-isaac/week-09-perception-manipulation.mdx` — complete 8-section chapter: frontmatter (`title: "Week 9: AI Perception, Manipulation & Reinforcement Learning"`, `sidebar_label: "Week 9: Perception & RL"`, `description`), Learning Objectives (5 bullets), Introduction (3 paragraphs connecting sensor data to action decisions), Core Concepts with subsections ("The Perception Pipeline" raw pixels → feature extraction → object detection → 3D localization, "YOLOv8 in a ROS 2 Node" ultralytics package + subscriber pattern, "RGB-D to 3D Position" backprojection formula `(u, v, depth) → (x, y, z)` using camera intrinsics with math notation, "Grasp Planning Overview" GraspNet-1Billion/antipodal grasp quality metric, "Reinforcement Learning for Robotics" MDP formulation/reward shaping/policy networks, "The Actor-Critic Architecture" policy network + value network + PPO overview, "Isaac Lab Training Loop" env vectorization + `_setup_scene()`/`_get_observations()`/`_get_rewards()`/`_get_dones()` lifecycle) with `flowchart LR` Mermaid RL loop: Environment State → [Observation] → Policy Network → [Action] → Environment Step → [Reward + Next State] → back to start plus *Caption*, :::tip cross-references to Week 8 (Isaac Lab) and Week 2 (sensor types), Code Examples (Example 1: complete `ColorObjectDetector` ROS 2 node using `cv2.inRange` on `/camera/image_raw`, computing centroid, publishing `geometry_msgs/msg/Point` to `/detected_object` — full imports/class/subscriber/publisher/main/spin; Example 2: `ReachEnv(DirectRLEnv)` Isaac Lab environment class with `_setup_scene()`, `_get_observations()`, `_get_rewards()`, `_get_dones()` stub implementations showing correct return types), Hands-On Exercise [Advanced] (run `cartpole_direct` Isaac Lab example → add Python callback logging mean reward every 100 episodes → produce matplotlib reward curve plot → save as `reward_curve.png`; Expected Output: `reward_curve.png` showing episodic reward converging upward over training), Summary (5 bullets), Quiz (5 questions), Further Reading (3 links) — 2500–3000 prose words
- [X] T017 [P] [US1][US2][US3] Write `book/docs/module-3-isaac/week-10-sim-to-real.mdx` — complete 8-section chapter: frontmatter (`title: "Week 10: Sim-to-Real Transfer"`, `sidebar_label: "Week 10: Sim-to-Real"`, `description`), Learning Objectives (4 bullets), Introduction (3 paragraphs: the dangerous assumption that simulation == reality, what happens when a trained policy meets the real world), Core Concepts with subsections ("The Sim-to-Real Gap" physics modeling errors/visual domain gap/actuation delays/sensor noise, "Domain Randomization" physics params gravity/friction/mass/joint stiffness + visual params lighting/textures/camera noise with Python config dict example, "Domain Adaptation" real data fine-tuning/DAGGER algorithm, "Synthetic Data Generation" Isaac Sim replicator/label generation, "System Identification" measuring real robot mass/CoM/motor friction, "The Deployment Pipeline" training→checkpoint→ONNX→edge→onnxruntime, "Latency Considerations" A100 vs Jetson Orin throughput vs latency/quantization tradeoffs) with :::warning "Quantizing to INT8 can reduce inference latency 4× but validate before deployment", `flowchart LR` Mermaid: Isaac Lab Training → [PyTorch checkpoint .pth] → ONNX Export → [.onnx file] → copy to Jetson Orin → onnxruntime inference → Robot Action plus *Caption*, :::tip cross-references to Week 9 (trained policy) and Week 8 (Isaac Lab), Code Examples (Example 1: Isaac Lab domain randomization config dict with `gravity_range`, `friction_range`, `joint_damping_range` keys — `python showLineNumbers` with top comment; Example 2: ONNX export script — load checkpoint → instantiate policy → `torch.onnx.export` with input names/output names/dynamic axes/opset_version=17 → save `.onnx` file), Hands-On Exercise [Advanced] (load Week 9 cartpole policy checkpoint → export to `cartpole_policy.onnx` → create static observation tensor `np.array([[0.0, 0.0, 0.1, -0.05]])` → `onnxruntime.InferenceSession` → `session.run()` → print output; Expected Output: printed numpy array with action values e.g. `[[0.42 -0.38]]`), Summary (4 bullets), Quiz (5 questions), Further Reading (3 links) — 2000–2500 prose words
- [X] T018 Run `cd book && pnpm build` after writing all Batch 4 files — zero errors required before proceeding to Batch 5

**Checkpoint**: Weeks 8–10 complete. Student understands the full Isaac platform and can export a policy for edge deployment.

---

## Phase 7: US1 + US2 + US3 (P1/P2) — Batch 5: VLA & Humanoids (Weeks 11–13)

**Goal**: Deliver the three advanced VLA chapters covering humanoid kinematics, manipulation, and conversational robotics.

**Independent Test**: After Week 11, student can compute FK for a 3-DOF arm with numpy and plan a MoveIt2 trajectory. After Week 13, student can chain Whisper + LLM planner to produce a structured action plan from a voice command.

### Implementation — Batch 5 Chapters

- [X] T019 [P] [US1][US2][US3] Write `book/docs/module-4-vla/week-11-humanoid-kinematics.mdx` — complete 8-section chapter: frontmatter (`title: "Week 11: Humanoid Kinematics & Bipedal Locomotion"`, `sidebar_label: "Week 11: Kinematics"`, `description`), Learning Objectives (5 bullets: compute FK for N-DOF arm, explain ZMP criterion, describe IK solution approaches, use MoveIt2 Python API, explain gait planning concepts), Introduction (3 paragraphs: how mathematics underpins every robot movement), Core Concepts with subsections ("Degrees of Freedom (DOF)" per joint/total humanoid DOF 29-44/redundancy, "Forward Kinematics (FK)" DH parameters/transformation matrix multiplication/end-effector pose, "Inverse Kinematics (IK)" geometric vs numerical vs Jacobian pseudoinverse/singularities, "Bipedal Locomotion Challenges" dynamic stability vs static/CoM management, "Zero-Moment Point (ZMP)" definition/criterion/measurement, "Gait Planning" static vs dynamic gait/contact scheduling, "Model Predictive Control (MPC) for Balance" prediction horizon/constraints/LIPM model, "MoveIt2 Overview" OMPL planners/planning scene/collision objects) with DH parameter table (joint/a/d/α/θ for 3-DOF arm), `graph LR` Mermaid using subgraphs: FK subgraph [θ₁,θ₂,θ₃] → [T matrices] → [x,y,z,R] and IK subgraph [x,y,z,R] → [IK solver] → [θ₁,θ₂,θ₃] plus *Caption*, :::tip cross-references to Week 7 (URDF joints) and Week 6 (simulation), Code Examples (Example 1: pure Python FK for 3-DOF planar arm — `rotation_z(theta)`, `translation(dx, dy, dz)`, `forward_kinematics(theta1, theta2, theta3, l1, l2, l3) -> np.ndarray` returning 4×4 homogeneous transform with full type hints in `python showLineNumbers`; Example 2: MoveIt2 Python API — `moveit2 = MoveIt2(node=node, joint_names=[...], base_link_name="panda_link0", end_effector_name="panda_hand")` planning pose goal and executing with `moveit2.move_to_pose()`), Hands-On Exercise [Advanced] (in RViz2 with Panda robot via MoveIt2 motion planning panel: drag end-effector Interactive Marker to 5 different poses; observe IK solution joint angles in Joints panel; plan and execute for each; Expected Output: RViz2 showing successful planned trajectories for each of the 5 target poses), Summary (5 bullets), Quiz (5 questions), Further Reading (3 links) — 2500–3000 prose words
- [X] T020 [P] [US1][US2][US3] Write `book/docs/module-4-vla/week-12-bipedal-locomotion.mdx` — complete 8-section chapter (note: filename is `week-12-bipedal-locomotion.mdx` but content covers Manipulation/Grasping/HRI per spec): frontmatter (`title: "Week 12: Manipulation, Grasping & Human-Robot Interaction"`, `sidebar_label: "Week 12: Manipulation & HRI"`, `description`), Learning Objectives (5 bullets: define force closure/grasp quality, explain GraspNet pipeline, describe HRI design principles, implement depth-camera grasp point detection, send grasp goal to MoveIt2), Introduction (3 paragraphs: the manipulation gap between seeing and grasping), Core Concepts with subsections ("The Grasp Planning Problem" 6-DOF grasp pose/force closure condition/epsilon+volume quality metrics, "Learned Grasping" GraspNet-1Billion dataset/Contact GraspNet architecture, "Dexterous Manipulation" finger gaiting/in-hand manipulation/tactile sensing, "HRI Design Principles" proxemics Hall's zones/motion legibility/social cues, "Safety in HRI" ISO/TS 15066 speed+separation monitoring/power+force limiting, "Shared Autonomy" intervention spectrum manual→teleoperation→shared→full autonomy, "Gesture Recognition" MediaPipe Hands/skeleton-based classification) with `flowchart LR` Mermaid: RGB-D Camera → YOLO Object Detection → 6-DOF Pose Estimation → Grasp Candidate Generation → [Best Grasp] → MoveIt2 Execution plus *Caption*, :::tip cross-references to Week 11 (MoveIt2/IK) and Week 9 (object detection), Code Examples (Example 1: `GraspPointDetector` ROS 2 node subscribing to `/camera/depth/points` PointCloud2, filtering points within `[x_min,x_max,y_min,y_max,z_min,z_max]` bounding box, computing centroid as grasp target — full node with `sensor_msgs_py.point_cloud2` helper and `geometry_msgs/msg/PointStamped` publisher; Example 2: `GraspActionClient` ROS 2 action client sending `MoveGroupActionGoal` to MoveIt2 with grasp pose from centroid — full async action client with feedback callback), Hands-On Exercise [Advanced] (Gazebo scene with table + 5cm cube + robot arm + simulated depth camera → run GraspPointDetector node → observe `/grasp_target` topic → launch MoveIt2 → command arm to grasp; Expected Output: Gazebo simulation showing arm successfully grasping and lifting cube, `/grasp_result` topic reporting SUCCESS), Summary (5 bullets), Quiz (5 questions), Further Reading (3 links) — 2500–3000 prose words
- [X] T021 [P] [US1][US2][US3] Write `book/docs/module-4-vla/week-13-conversational-robotics.mdx` — complete 8-section chapter: frontmatter (`title: "Week 13: Conversational Robotics"`, `sidebar_label: "Week 13: Conversational AI"`, `description`), Learning Objectives (5 bullets: describe the Voice-to-Action pipeline, transcribe speech with Whisper, build an LLM robot planner, use function calling for ROS 2 actions, enumerate LLM safety limitations), Introduction (3 paragraphs: natural language as the ultimate robot interface, from voice to physical action), Core Concepts with subsections ("The Voice-to-Action Pipeline" full stack description, "OpenAI Whisper" encoder-decoder Transformer architecture/model sizes tiny-to-large/local vs cloud tradeoffs, "LLMs as Robot Planners" task decomposition/grounding problem, "Prompt Engineering for Robotics" system prompt with robot capability manifest/structured JSON output, "Tool Calling / Function Calling" OpenAI function calling/mapping tools to ROS 2 action clients, "Multi-modal Interaction" speech + gesture + vision robustness, "Limitations and Safety Guardrails" hallucination risks/latency/hard-coded safety constraints/human-in-the-loop override) with :::warning "LLM calls add 500ms–2s latency; plan for this in your control loop" and :::danger "Never let an LLM override safety-critical velocity or force limits without human confirmation", `flowchart LR` Mermaid: Microphone → [sounddevice] → raw_audio → Whisper STT → transcript_text → LLM Planner (GPT/Claude) → JSON_actions → ROS 2 Action Dispatcher → Robot Movement plus *Caption*, :::tip cross-references to Week 12 (grasping actions) and Week 4 (ROS 2 actions), Code Examples (Example 1: `WhisperTranscriber` Python script using `whisper.load_model("base")` + `sounddevice.rec(int(5 * 16000), samplerate=16000, channels=1)` + `whisper.transcribe()` — `python showLineNumbers` with top comment + `os.environ["OPENAI_API_KEY"]` note; Example 2: `RobotTaskPlanner` class taking transcript, building system prompt with `ROBOT_ACTIONS` manifest list, calling `openai.OpenAI().chat.completions.create()` with `response_format={"type": "json_object"}`, returning parsed `list[dict]` — `python showLineNumbers` with top comment), Hands-On Exercise [Advanced] (chain Examples 1+2: create `voice_planner_demo.py` that records 5 seconds → transcribes → plans → prints JSON; test with "go to the kitchen and pick up the red cup", "navigate to the charging station", "sort the blocks by color on the table"; Expected Output: printed JSON action sequences for all 3 voice commands), Summary (5 bullets), Quiz (5 questions), Further Reading (3 links) — 2500–3000 prose words
- [X] T022 Run `cd book && pnpm build` after writing all Batch 5 files — zero errors required before proceeding to Batch 6

**Checkpoint**: Weeks 11–13 complete. Student can chain voice → Whisper → LLM → action plan.

---

## Phase 8: US4 (P2) — Curriculum Structure & Cross-Reference Audit

**Goal**: Ensure the 13 weekly chapters form a coherent curriculum — all cross-references use valid URLs, all :::tip admonitions point to already-written chapters, and the intro correctly describes the full course.

**Independent Test**: An educator can open any two consecutive chapters and confirm that: (a) cross-references use the correct URL pattern from `quickstart.md`, (b) no chapter assumes knowledge not yet introduced, (c) the intro Mermaid diagram accurately reflects the 4-module + capstone structure.

### Implementation — Curriculum Coherence

- [X] T023 [US4] Audit all :::tip cross-reference admonitions in every chapter file under `book/docs/module-*/` — verify each referenced URL matches the URL table in `specs/002-book-content-chapters/quickstart.md` (format: `/module-X-Y/week-NN-slug` with no `/docs/` prefix); fix any incorrect URLs found
- [X] T024 [P] [US4] Review `book/docs/intro.md` Mermaid learning journey diagram — verify it correctly shows all 4 modules with accurate week counts (Module 1: Weeks 1-5, Module 2: Weeks 6-7, Module 3: Weeks 8-10, Module 4: Weeks 11-13) and flows to Capstone; update if any module labels or week ranges are incorrect
- [X] T025 [P] [US4] Run `grep -r "Coming Soon\|TODO\|TBD\|lorem ipsum" book/docs/` and confirm output is empty — all placeholder text has been replaced with real content

**Checkpoint**: Cross-references valid, intro accurate, no placeholder text remaining.

---

## Phase 9: US5 (P3) — Capstone Project Guide

**Goal**: Deliver the capstone chapter as a complete project guide that integrates all 5 milestones into one cohesive system, with exactly 10 verifiable submission checklist items.

**Independent Test**: A student who has completed Weeks 1–13 can open the capstone chapter and implement all 5 milestones without additional instruction. They can check off all 10 submission checklist items before submitting.

### Implementation — Capstone

- [X] T026 [US5] Write `book/docs/capstone/autonomous-humanoid-project.mdx` — complete capstone chapter with VARIANT structure (quiz replaced by submission checklist): frontmatter (`title: "Capstone: The Autonomous Humanoid"`, `sidebar_label: "Capstone Project"`, `description: "Build a fully integrated autonomous humanoid: voice command → LLM planning → Nav2 navigation → object detection → MoveIt2 grasping."`), Learning Objectives (5 bullets: design multi-component robotic pipeline, integrate Whisper/LLM/Nav2/YOLO/MoveIt2, write a MainOrchestrator ROS 2 node, record and verify complete pipeline behavior, meet all 10 submission criteria), Introduction (3 paragraphs: what the student is about to build and why it matters), Core Concepts as "Project Overview" section with Mermaid 1 (full system `flowchart TD`: Voice Input → Whisper Node → /voice_command → LLM Planner Node → /action_plan → MainOrchestrator → branches to: Navigator Node (/navigate_to_pose action), Detector Node (/detected_object_pose), Grasp Executor Node) and Mermaid 2 (milestone dependency `graph LR`: M1[Milestone 1: Voice] → M2[Milestone 2: LLM] → M3[Milestone 3: Nav2] & M4[Milestone 4: Detection] → M5[Milestone 5: Grasping] → Integration) both with *Captions*, Code Examples as "Implementation Guide" section organized by milestone: Milestone 1 — `voice_node.py` ROS 2 node wrapping Whisper publishing to `/voice_command` `std_msgs/String`; Milestone 2 — `llm_planner_node.py` subscribing to `/voice_command` calling OpenAI API publishing to `/action_plan` `std_msgs/String` (JSON); Milestone 3 — `navigator_node.py` subscribing to `/action_plan` dispatching `NavigateToPose` action goals to Nav2; Milestone 4 — `detector_node.py` YOLOv8 + depth camera publishing `geometry_msgs/PoseStamped` to `/detected_object_pose`; Milestone 5 — `grasp_executor_node.py` subscribing to `/detected_object_pose` executing MoveIt2 grasp; Integration — `main_orchestrator.launch.py` launching all 5 nodes + Nav2 stack + MoveIt2 with :::warning about requiring the full Gazebo simulation environment, Hands-On Exercise as "Integration Guide" with state machine pattern (LISTENING→PLANNING→NAVIGATING→DETECTING→GRASPING→IDLE) and step-by-step wiring instructions, Summary (6 bullets), Submission Checklist (REPLACES quiz — exactly the 10 items from contracts/chapter-content-contract.md CONTRACT-CAPSTONE), Debugging section (5 failure modes: Whisper mic issue/LLM JSON error/Nav2 timeout/YOLO confidence/MoveIt2 planning failure — each with diagnosis steps and fix), Further Reading (3 links: Nav2 official docs, Ultralytics YOLOv8 ROS2 package, OpenAI function calling guide) — 3000–4000 prose words
- [X] T027 Run `cd book && pnpm build` after writing capstone file — zero errors required

**Checkpoint**: Capstone complete and build passes.

---

## Phase 10: Polish & Final Validation

**Purpose**: Full-suite verification that all 8 Definition of Done criteria are met before the branch is ready for PR.

- [X] T028 [P] Run `grep -rn "showLineNumbers" book/docs/` — verify at least 2 occurrences per weekly chapter file (≥26 total across Weeks 1-13) and ≥2 in the capstone; fix any chapter with fewer than 2 code examples
- [X] T029 [P] Run `grep -c "✅" book/docs/module-*/week-*.mdx` — verify output shows exactly 5 ✅ marks in each of the 13 weekly chapter files; fix any file with a different count
- [X] T030 Run `grep -c "✅\|- \[ \]" book/docs/capstone/autonomous-humanoid-project.mdx` — verify the submission checklist contains exactly 10 `- [ ]` items; fix if count differs
- [X] T031 Run final `cd book && pnpm build` — confirm zero errors and zero warnings; confirm build output shows all 15 pages indexed

**Checkpoint — Definition of Done**: All 8 DoD criteria verified:
1. ✅ All 15 MDX files have real content (`Coming Soon` grep returns empty — verified in T025)
2. ✅ Every chapter has all 8 mandatory sections (verified by content review in each task)
3. ✅ Every chapter has ≥1 Mermaid diagram (specified in each task above)
4. ✅ Every chapter has ≥2 Python `showLineNumbers` examples (verified in T028)
5. ✅ Every weekly chapter has exactly 5 quiz questions (verified in T029)
6. ✅ Capstone has exactly 10 submission checklist items (verified in T030)
7. ✅ `pnpm build` passes with zero errors (verified in T031)
8. ✅ All internal cross-references valid (`onBrokenLinks: 'throw'` catches broken links in every build step)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)         → No dependencies — start immediately
Phase 2 (Foundational)  → Depends on Phase 1 completion
Phase 3 (Batch 1)       → Depends on Phase 2 (intro.md must exist)
Phase 4 (Batch 2)       → Depends on Phase 3 build gate (T007 must pass)
Phase 5 (Batch 3)       → Depends on Phase 4 build gate (T011 must pass)
Phase 6 (Batch 4)       → Depends on Phase 5 build gate (T014 must pass)
Phase 7 (Batch 5)       → Depends on Phase 6 build gate (T018 must pass)
Phase 8 (US4 Audit)     → Depends on Phase 7 completion (all 13 weekly chapters written)
Phase 9 (Capstone)      → Depends on Phase 7 completion (capstone references all weeks)
Phase 10 (Polish)       → Depends on Phases 8 + 9 completion
```

### Parallelism Within Phases

| Phase | Parallelizable Tasks | Note |
|-------|---------------------|------|
| Phase 3 | T005, T006 | Write both week files simultaneously; T007 runs after both |
| Phase 4 | T008, T009, T010 | Write all three week files simultaneously; T011 after all |
| Phase 5 | T012, T013 | Write both week files simultaneously; T014 after both |
| Phase 6 | T015, T016, T017 | Write all three week files simultaneously; T018 after all |
| Phase 7 | T019, T020, T021 | Write all three week files simultaneously; T022 after all |
| Phase 8 | T024, T025 | Run in parallel with T023 |
| Phase 10 | T028, T029 | Run in parallel; T030 after T026 done |

---

## Parallel Example: Batch 2 (Weeks 3–5)

```
# Launch all three Batch 2 chapters simultaneously:
Task T008: "Write week-03-ros2-architecture.mdx"
Task T009: "Write week-04-nodes-topics-services.mdx"
Task T010: "Write week-05-ros2-packages.mdx"

# Wait for all three to complete, then:
Task T011: "Run pnpm build — must pass before Batch 3 begins"
```

---

## Implementation Strategy

### MVP First (User Story 1 — One Complete Chapter)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (intro.md)
3. Complete Phase 3 (T005 only): Write Week 1 chapter
4. **STOP and VALIDATE**: Open Week 1 in dev server. Read all 8 sections. Run the exercise. Pass the quiz.
5. If Week 1 is satisfactory, continue with T006 → T007 → next batches

### Incremental Delivery (Batch by Batch)

1. Setup + intro.md → Foundation ready
2. Batch 1 (Weeks 1-2) → Module 1 preview ready for review
3. Batch 2 (Weeks 3-5) → Full Module 1 complete
4. Batch 3 (Weeks 6-7) → Module 2 complete
5. Batch 4 (Weeks 8-10) → Module 3 complete
6. Batch 5 (Weeks 11-13) → Module 4 complete → all 13 weekly chapters done
7. Phase 8 audit + Phase 9 capstone → Full textbook complete
8. Phase 10 final build → PR-ready

---

## Notes

- **[P] tasks** = different files, no cross-file dependencies — can run in parallel
- **[US] labels** map each task to its user story for traceability
- **Build gates** (T004, T007, T011, T014, T018, T022, T027, T031) are NOT parallelizable — they validate all prior work
- **Cross-reference URLs** must follow the pattern in `specs/002-book-content-chapters/quickstart.md` — `/module-X-Y/week-NN-slug` (no `/docs/` prefix)
- **No placeholder text** — each file-writing task produces 100% complete content; no "Coming Soon" allowed
- **Week 13 API keys** — use `os.environ["OPENAI_API_KEY"]`; include `:::warning` about API costs
- Commit after each batch (after the build gate passes) for clean git history
