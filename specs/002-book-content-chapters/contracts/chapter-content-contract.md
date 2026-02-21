# Chapter Content Contract

**Feature**: 002-book-content-chapters
**Version**: 1.0
**Date**: 2026-02-19

---

## Per-Chapter Delivery Contract

Each chapter file delivered MUST satisfy the following contract. This contract is binding for implementation and verification.

---

### CONTRACT-INTRO: `docs/intro.md`

| Attribute | Requirement |
|-----------|-------------|
| Frontmatter | `title`, `sidebar_label`, `description` |
| Sections | H1, What is Physical AI, Course Structure (with Mermaid), Prerequisites, How to Use This Book, Getting Help |
| Mermaid | 1 diagram showing 4 modules → capstone learning journey |
| Word count | 800–1200 prose words |
| Quiz | NONE (orientation page) |
| Further Reading | NONE |

---

### CONTRACT-W01: `docs/module-1-ros2/week-01-intro-physical-ai.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 1: Introduction to Physical AI" |
| Mermaid | `flowchart LR` showing Sense → Plan → Act feedback loop |
| Code Example 1 | `SensePlanActRobot` Python class with `sense()`, `plan()`, `act()` — pure Python, no ROS |
| Code Example 2 | Loop running 5 iterations with mock sensor data, printing action output |
| Exercise | [Beginner] Research 3 humanoid robots; build formatted Python dict comparison table |
| Expected Output | Printed table of 3 humanoid robots with manufacturer, locomotion, payload, use case, year |
| Word count | 2000–2500 prose words |
| Cross-references | None (first chapter) |

---

### CONTRACT-W02: `docs/module-1-ros2/week-02-embodied-intelligence.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 2: Embodied Intelligence & Sensor Systems" |
| Mermaid | Sensor fusion pipeline: LiDAR + Camera + IMU → Sensor Fusion Node → World Model |
| Code Example 1 | Python dataclasses `LiDARReading`, `IMUReading`, `CameraFrame` + `SensorFusion` class |
| Code Example 2 | Mock sensor data generator simulating 360° LiDAR scan as numpy array |
| Exercise | [Intermediate] Install Open3D, visualize randomly generated point cloud |
| Expected Output | Open3D window displaying a colored 3D point cloud |
| Word count | 2000–2500 prose words |
| Cross-references | Week 1 (Sense-Plan-Act context) |

---

### CONTRACT-W03: `docs/module-1-ros2/week-03-ros2-architecture.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 3: ROS 2 Architecture & Core Concepts" |
| Mermaid | ROS 2 computation graph: 3 nodes, 2 topics, message flow |
| Code Example 1 | `MinimalNode` rclpy class that logs "Hello from ROS 2" every 1 second via timer |
| Code Example 2 | Bash snippet: source setup → create workspace → colcon build → run node |
| Special content | Full step-by-step ROS 2 Humble installation for Ubuntu 22.04 |
| Exercise | [Beginner] Install ROS 2 Humble, run talker/listener demo, capture `ros2 topic echo /chatter` |
| Expected Output | `/chatter` topic output showing "Hello World: N" messages |
| Word count | 2500–3000 prose words |
| Cross-references | Week 2 (sensor data → topics) |

---

### CONTRACT-W04: `docs/module-1-ros2/week-04-nodes-topics-services.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 4: Nodes, Topics, Services & Actions" |
| Mermaid | Side-by-side: Topic (async pub/sub) vs Service (sync req/res) vs Action (long-running + feedback) |
| Code Example 1 | Publisher node: `geometry_msgs/msg/Twist` at 10Hz |
| Code Example 2 | Subscriber node: listens to same topic, prints linear/angular velocity |
| Code Example 3 | Bonus: service server that receives a string, returns it reversed |
| Exercise | [Intermediate] Battery heartbeat: publisher → random float every 2s; subscriber → alert when < 20 |
| Expected Output | Console showing "⚠️ LOW BATTERY: 15.3" when battery drops below threshold |
| Word count | 2500–3000 prose words |
| Cross-references | Week 3 (ROS 2 computation graph) |

---

### CONTRACT-W05: `docs/module-1-ros2/week-05-ros2-packages.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 5: Building ROS 2 Packages with Python" |
| Mermaid | Workspace build flow: `src/` → `colcon build` → `install/` → `source` → `ros2 run` |
| Code Example 1 | Complete `package.xml` for `robot_monitor` package |
| Code Example 2 | Complete `setup.py` with entry_points for 2 nodes |
| Code Example 3 | `.launch.py` file launching both nodes with `publish_frequency` parameter |
| Exercise | [Intermediate] Build full `robot_monitor` package: publisher (joint states), subscriber (log to file), launch file |
| Expected Output | Launch file starts 2 nodes; subscriber writes joint state log to file |
| Word count | 2500–3000 prose words |
| Cross-references | Week 3 (nodes), Week 4 (topics and subscribers) |

---

### CONTRACT-W06: `docs/module-2-simulation/week-06-gazebo-setup.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 6: Gazebo Simulation Environment" |
| Mermaid | Data flow: Gazebo physics engine → ROS 2 bridge → topics → Python controller → back to Gazebo |
| Code Example 1 | Minimal SDF world file: ground plane + sun light + 1 box obstacle |
| Code Example 2 | ROS 2 launch file: Gazebo Harmonic + SDF world + bridge `/cmd_vel` and `/odom` |
| Exercise | [Intermediate] Launch TurtleBot3 Waffle, drive with `ros2 topic pub /cmd_vel`, record `/odom` |
| Expected Output | `ros2 bag info` showing recorded `/odom` messages |
| Word count | 2000–2500 prose words |
| Cross-references | Week 5 (launch files), Week 3 (ROS 2 topics) |

---

### CONTRACT-W07: `docs/module-2-simulation/week-07-urdf-sdf.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 7: URDF/SDF Robot Description & Physics Simulation" |
| Mermaid | URDF link-joint tree: `base_link → shoulder_joint → upper_arm → elbow_joint → forearm` |
| Code Example 1 | Complete URDF XML for 2-DOF arm: links, joints, inertia, visual/collision geometry |
| Code Example 2 | Xacro macro `<xacro:leg side="left">` generating a full leg assembly |
| Special content | Table of inertia formulas (box, cylinder, sphere) with URDF XML syntax |
| Exercise | [Advanced] Build simplified humanoid URDF (torso + 2 arms + 2 legs); visualize in RViz2; verify TF with `view_frames` |
| Expected Output | TF tree PDF/PNG showing all link frames connected correctly |
| Word count | 2500–3000 prose words |
| Cross-references | Week 6 (Gazebo simulation) |

---

### CONTRACT-W08: `docs/module-3-isaac/week-08-isaac-platform.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 8: NVIDIA Isaac Sim & Isaac SDK" |
| Mermaid | Isaac ecosystem: Isaac Sim + Isaac ROS + Isaac Lab connections |
| Code Example 1 | Isaac Sim Python API (`omni.isaac.core`): spawn Franka robot, step simulation 100 times |
| Code Example 2 | ROS 2 node subscribing to Isaac Sim camera topic `/rgb`, logging image resolution |
| Special content | `:::info` admonition: "Requires NVIDIA RTX GPU with ≥8GB VRAM" |
| Exercise | [Advanced] Launch Isaac Sim, load Franka, verify joint state topics in `ros2 topic list` |
| Expected Output | `ros2 topic list` showing `/joint_states` and related Franka topics |
| Word count | 2000–2500 prose words |
| Cross-references | Week 6 (Gazebo vs Isaac Sim comparison), Week 3 (ROS 2 topics) |

---

### CONTRACT-W09: `docs/module-3-isaac/week-09-perception-manipulation.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 9: AI Perception, Manipulation & Reinforcement Learning" |
| Mermaid | RL training loop: env state → observation → policy → action → env step → reward → back |
| Code Example 1 | ROS 2 perception node: OpenCV `cv2.inRange` to detect red object, publish centroid as `geometry_msgs/Point` |
| Code Example 2 | Isaac Lab environment class inheriting `DirectRLEnv`: `_setup_scene()`, `_get_observations()`, `_get_rewards()` |
| Exercise | [Advanced] Run `cartpole_direct` Isaac Lab example; log mean reward every 100 episodes; produce matplotlib reward curve |
| Expected Output | Matplotlib plot showing reward converging over training episodes |
| Word count | 2500–3000 prose words |
| Cross-references | Week 8 (Isaac Lab intro), Week 2 (perception sensors) |

---

### CONTRACT-W10: `docs/module-3-isaac/week-10-sim-to-real.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 10: Sim-to-Real Transfer" |
| Mermaid | Full pipeline: Isaac Lab → PyTorch policy → ONNX → Jetson Orin → onnxruntime → robot action |
| Code Example 1 | Isaac Lab domain randomization config: Python dict with gravity, friction, joint damping ranges |
| Code Example 2 | PyTorch export script: load checkpoint → `torch.onnx.export` → save `.onnx` file |
| Exercise | [Advanced] Export Week 9 cartpole policy to ONNX; run inference with onnxruntime on static tensor; print action |
| Expected Output | Printed action tensor values that match training environment output |
| Word count | 2000–2500 prose words |
| Cross-references | Week 9 (trained policy), Week 8 (Isaac Lab) |

---

### CONTRACT-W11: `docs/module-4-vla/week-11-humanoid-kinematics.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 11: Humanoid Kinematics & Bipedal Locomotion" |
| Mermaid | FK vs IK: FK = joint angles → end-effector (forward); IK = desired pose → joint angles (reverse + "solve") |
| Code Example 1 | Pure Python FK for 3-DOF planar arm using 4×4 homogeneous transformation matrices (numpy) |
| Code Example 2 | MoveIt2 Python API: `MoveGroupCommander` to plan and execute pose goal for Panda robot |
| Special content | Table of DH (Denavit-Hartenberg) parameters for 3-DOF arm |
| Exercise | [Advanced] In RViz2 with Panda robot, drag end-effector to 5 different poses, observe IK solutions |
| Expected Output | MoveIt2 motion planning panel showing planned trajectories for each target pose |
| Word count | 2500–3000 prose words |
| Cross-references | Week 7 (URDF joint types), Week 6 (simulation) |

---

### CONTRACT-W12: `docs/module-4-vla/week-12-bipedal-locomotion.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 12: Manipulation, Grasping & Human-Robot Interaction" |
| Mermaid | Grasping pipeline: RGB-D camera → object detection (YOLO) → 6-DOF pose estimation → grasp candidate → MoveIt2 execution |
| Code Example 1 | ROS 2 node: subscribe `/camera/depth/points` (PointCloud2), filter bounding box, compute centroid |
| Code Example 2 | ROS 2 action client: send `MoveGroupAction` goal to MoveIt2 with grasp pose |
| Exercise | [Advanced] In Gazebo, spawn 5cm cube on table; detect with depth camera; command arm to grasp via MoveIt2 |
| Expected Output | Gazebo simulation showing robot arm successfully grasping and lifting the cube |
| Word count | 2500–3000 prose words |
| Cross-references | Week 11 (MoveIt2, IK), Week 9 (object detection), Week 6 (Gazebo) |

---

### CONTRACT-W13: `docs/module-4-vla/week-13-conversational-robotics.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Week 13: Conversational Robotics" |
| Mermaid | Voice-to-Action: Microphone → Whisper STT → text → LLM planner → action list → ROS 2 dispatcher → robot |
| Code Example 1 | Python: `whisper.load_model("base")` + `sounddevice` mic recording + transcription |
| Code Example 2 | Python LLM planner: send transcript to OpenAI API with system prompt listing ROS 2 actions → JSON action list |
| Exercise | [Advanced] Chain Examples 1+2: record voice → transcribe → plan → print action list; test 3 commands |
| Expected Output | Printed JSON action list for "go to the kitchen and pick up the red cup" |
| Word count | 2500–3000 prose words |
| Cross-references | Week 12 (grasping actions), Week 9 (object detection), Week 4 (ROS 2 actions) |

---

### CONTRACT-CAPSTONE: `docs/capstone/autonomous-humanoid-project.mdx`

| Attribute | Requirement |
|-----------|-------------|
| Title | "Capstone: The Autonomous Humanoid" |
| Mermaid 1 | Full system architecture: all 5 milestones wired in one flowchart |
| Mermaid 2 | Milestone dependency graph |
| Code examples | ≥2 per milestone (10+ total) covering all integration patterns |
| Submission Checklist | Exactly 10 items (replaces Quiz) |
| Further Reading | 3 links |
| Word count | 3000–4000 prose words |
| Cross-references | All previous weeks |

**Submission Checklist items (exact)**:
1. Voice command is transcribed correctly by Whisper
2. LLM produces valid JSON action plan for at least 3 different voice commands
3. Robot navigates from start to goal without colliding with obstacles
4. Object is detected and its 3D position is published to `/detected_object_pose`
5. Robot arm reaches the detected object position
6. Grasp is executed successfully (object is lifted off the surface)
7. Full pipeline runs end-to-end from voice to grasp in a single `ros2 launch` command
8. A ROS 2 bag recording of the complete run is saved
9. A screen recording of the simulation shows all 5 stages completing
10. `pnpm build` of the book passes with zero errors
