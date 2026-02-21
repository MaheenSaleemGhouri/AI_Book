import type { ReactNode } from 'react';
import styles from './LearningOutcomes.module.css';

const OUTCOMES = [
  'Build a production-ready ROS 2 workspace with custom nodes, topics, and services',
  'Simulate complex robot environments in Gazebo and NVIDIA Isaac Sim',
  'Develop perception pipelines for 3D object detection and semantic segmentation',
  'Train reinforcement-learning locomotion and manipulation policies from scratch',
  'Execute sim-to-real transfer and measure performance gaps on physical hardware',
  'Integrate Whisper STT and an LLM into a voice-controlled humanoid robot capstone',
];

export default function LearningOutcomes(): ReactNode {
  return (
    <section className={styles.outcomesSection}>
      <div className={styles.sectionInner}>
        <h2 className={styles.sectionTitle}>What You Will Build</h2>
        <ul className={styles.outcomeList}>
          {OUTCOMES.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
