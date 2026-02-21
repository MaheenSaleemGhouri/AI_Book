import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Cpu, Bot, Zap } from 'lucide-react';
import styles from './WhyPhysicalAI.module.css';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps): ReactNode {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>
        <Icon size={40} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}

export default function WhyPhysicalAI(): ReactNode {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.sectionInner}>
        <h2 className={styles.sectionTitle}>Why Physical AI?</h2>
        <div className={styles.featureGrid}>
          <FeatureCard
            icon={Cpu}
            title="Embodied Intelligence"
            description="Move beyond text and images — learn to build AI systems that sense, reason, and act in the physical world."
          />
          <FeatureCard
            icon={Bot}
            title="Real-World Deployment"
            description="Bridge the sim-to-real gap with NVIDIA Isaac Sim and deploy trained policies on actual robot hardware."
          />
          <FeatureCard
            icon={Zap}
            title="Industry Demand"
            description="Humanoid robotics is one of the fastest-growing fields in AI. Get ahead with hands-on skills employers need now."
          />
        </div>
      </div>
    </section>
  );
}
