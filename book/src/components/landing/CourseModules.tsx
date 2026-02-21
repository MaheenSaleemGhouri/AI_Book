import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import styles from './CourseModules.module.css';

interface ModuleCardProps {
  number: string;
  title: string;
  weeks: string;
  summary: string;
  href: string;
}

function ModuleCard({ number, title, weeks, summary, href }: ModuleCardProps): ReactNode {
  return (
    <Link to={href} className={styles.moduleCard}>
      <div className={styles.moduleNumber}>{number}</div>
      <h3 className={styles.moduleTitle}>{title}</h3>
      <p className={styles.moduleWeeks}>{weeks}</p>
      <p className={styles.moduleSummary}>{summary}</p>
    </Link>
  );
}

export default function CourseModules(): ReactNode {
  return (
    <section className={styles.modulesSection}>
      <div className={styles.sectionInner}>
        <h2 className={styles.sectionTitle}>Course Modules</h2>
        <div className={styles.moduleGrid}>
          <ModuleCard
            number="01"
            title="The Robotic Nervous System"
            weeks="Weeks 1–5 · ROS 2"
            summary="ROS 2 architecture, nodes, topics, services, actions, and colcon workspaces."
            href="/module-1-ros2/week-01-intro-physical-ai"
          />
          <ModuleCard
            number="02"
            title="The Digital Twin"
            weeks="Weeks 6–7 · Gazebo"
            summary="Simulate robots in Gazebo with URDF/SDF models, sensors, and ROS 2 bridges."
            href="/module-2-simulation/week-06-gazebo-setup"
          />
          <ModuleCard
            number="03"
            title="The AI-Robot Brain"
            weeks="Weeks 8–10 · NVIDIA Isaac"
            summary="Perception pipelines, manipulation planning, RL training, and sim-to-real transfer."
            href="/module-3-isaac/week-08-isaac-platform"
          />
          <ModuleCard
            number="04"
            title="Vision-Language-Action"
            weeks="Weeks 11–13 · VLA Models"
            summary="Humanoid kinematics, bipedal locomotion, and voice-controlled robot planning."
            href="/module-4-vla/week-11-humanoid-kinematics"
          />
        </div>
      </div>
    </section>
  );
}
