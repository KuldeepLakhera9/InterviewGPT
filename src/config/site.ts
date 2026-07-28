export const siteConfig = {
  name: 'InterviewGPT',
  description: 'AI-powered interview preparation platform for technical and HR interview mastery.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  links: {
    github: 'https://github.com/KuldeepLakhera9/InterviewGPT',
  },
} as const;

export type SiteConfig = typeof siteConfig;
