import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import HeroSection from '@site/src/components/landing/HeroSection';
import WhyPhysicalAI from '@site/src/components/landing/WhyPhysicalAI';
import CourseModules from '@site/src/components/landing/CourseModules';
import LearningOutcomes from '@site/src/components/landing/LearningOutcomes';
import HardwareOverview from '@site/src/components/landing/HardwareOverview';

export default function Home(): ReactNode {
  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="Bridging the Digital Brain and the Physical World"
    >
      <HeroSection />
      <main>
        <WhyPhysicalAI />
        <CourseModules />
        <LearningOutcomes />
        <HardwareOverview />
      </main>
    </Layout>
  );
}
