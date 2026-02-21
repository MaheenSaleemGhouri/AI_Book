import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import '@docusaurus/theme-mermaid'; // side-effect import: augments ThemeConfig types for strict TS

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Bridging the Digital Brain and the Physical World',
  favicon: 'img/favicon.ico',

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;600;700&display=swap',
      },
    },
  ],

  // Vercel deployment
  url: 'https://ai-book-delta-fawn.vercel.app',
  baseUrl: '/',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  customFields: {
    chatApiUrl: process.env.CHAT_API_URL ?? 'http://localhost:8000',
  },

  i18n: { defaultLocale: 'en', locales: ['en'] },

  // Mermaid support
  themes: ['@docusaurus/theme-mermaid'],
  markdown: { mermaid: true },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Docs at site root
        },
        blog: false, // Disabled per constitution
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    image: 'img/social-card.png',
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Physical AI Robot Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'courseSidebar',
          position: 'left',
          label: 'Course',
        },
        {
          href: 'https://github.com/YOUR_ORG/YOUR_REPO',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Course',
          items: [
            { label: 'Introduction', to: '/intro' },
            {
              label: 'Module 1: ROS 2',
              to: '/module-1-ros2/week-01-intro-physical-ai',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'GitHub Repository',
              href: 'https://github.com/YOUR_ORG/YOUR_REPO',
            },
          ],
        },
      ],
      copyright: `Physical AI & Humanoid Robotics — Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'yaml', 'cpp'],
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
