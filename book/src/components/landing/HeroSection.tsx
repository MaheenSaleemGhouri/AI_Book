import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { ChevronRight } from 'lucide-react';
import styles from './HeroSection.module.css';

export default function HeroSection(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.heroTitle}>Physical AI &amp; Humanoid Robotics</h1>
        <p className={styles.heroTagline}>
          Bridging the Digital Brain and the Physical World
        </p>
        <Link to="/intro" className={styles.heroButton}>
          Start Learning <ChevronRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
