import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { Layers, ChevronRight } from 'lucide-react';
import styles from './HardwareOverview.module.css';

export default function HardwareOverview(): ReactNode {
  return (
    <section className={styles.hardwareSection}>
      <div className={styles.sectionInner}>
        <h2 className={styles.sectionTitle}>Hardware &amp; Software Stack</h2>
        <div className={styles.hardwareGrid}>
          <div className={styles.hardwareIcon}>
            <Layers size={56} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className={styles.hardwareDescription}>
            All exercises are designed for <strong>Ubuntu 22.04</strong> with{' '}
            <strong>Python 3.11</strong>, <strong>ROS 2 Humble</strong>, and{' '}
            <strong>Gazebo Harmonic</strong>. GPU-accelerated simulation uses{' '}
            <strong>NVIDIA Isaac Sim</strong> (RTX 30-series or later). Every lesson
            includes a tested Docker image so you can follow along without a dedicated
            workstation.
          </p>
          <div className={styles.ctaSection}>
            <p className={styles.ctaTitle}>Ready to Begin?</p>
            <Link to="/intro" className={styles.ctaButton}>
              Start the Course <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
