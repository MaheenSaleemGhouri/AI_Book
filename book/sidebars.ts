import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  courseSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '📖 Welcome & Course Overview',
    },
    {
      type: 'category',
      label: 'Module 1: The Robotic Nervous System (ROS 2)',
      collapsed: false,
      items: [
        'module-1-ros2/week-01-intro-physical-ai',
        'module-1-ros2/week-02-embodied-intelligence',
        'module-1-ros2/week-03-ros2-architecture',
        'module-1-ros2/week-04-nodes-topics-services',
        'module-1-ros2/week-05-ros2-packages',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Digital Twin (Gazebo & Unity)',
      collapsed: true,
      items: [
        'module-2-simulation/week-06-gazebo-setup',
        'module-2-simulation/week-07-urdf-sdf',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: The AI-Robot Brain (NVIDIA Isaac)',
      collapsed: true,
      items: [
        'module-3-isaac/week-08-isaac-platform',
        'module-3-isaac/week-09-perception-manipulation',
        'module-3-isaac/week-10-sim-to-real',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action (VLA)',
      collapsed: true,
      items: [
        'module-4-vla/week-11-humanoid-kinematics',
        'module-4-vla/week-12-bipedal-locomotion',
        'module-4-vla/week-13-conversational-robotics',
      ],
    },
    {
      type: 'category',
      label: '🎓 Capstone Project',
      collapsed: true,
      items: ['capstone/autonomous-humanoid-project'],
    },
  ],
};

export default sidebars;
