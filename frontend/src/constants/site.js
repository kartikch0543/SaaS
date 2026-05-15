const siteUrl = (import.meta.env.VITE_SITE_URL || "https://studyforger.vercel.app").replace(/\/$/, "");

export const siteConfig = {
  name: "StudyForge AI",
  baseUrl: siteUrl,
  ogImage: `${siteUrl}/og-cover.png`,
  twitterHandle: "@studyforgeai",
  description:
    "AI-powered viva prep, roadmaps, notes, quizzes, and productivity dashboards for students.",
  defaultKeywords: [
    "dbms viva questions",
    "frontend roadmap for beginners",
    "operating system short notes",
    "oops interview questions",
    "tech viva preparation"
  ]
};
