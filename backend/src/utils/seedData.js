import { slugify } from "./slugify.js";

export const seoArticles = [
  {
    title: "DBMS Viva Questions for University Exams",
    slug: "dbms-viva-questions",
    description: "Practice database management viva questions with concise answers, revision prompts, and exam-focused tips.",
    category: "viva",
    intent: "informational",
    keywords: ["dbms viva questions", "dbms viva questions with answers", "dbms oral exam questions"],
    heroStat: "42 curated prompts",
    content: [
      "Understand entity relationships, normalization, indexing, and transactions before memorizing definitions.",
      "Focus on explaining tradeoffs: why normalization reduces redundancy, when indexing hurts writes, and where ACID matters.",
      "Practice short, confident answers followed by one example because viva performance depends on clarity under pressure."
    ],
    faqs: [
      {
        question: "How should I prepare for a DBMS viva quickly?",
        answer: "Cover normalization, keys, SQL joins, transactions, and indexing with one example per topic."
      },
      {
        question: "Are DBMS viva questions theoretical or practical?",
        answer: "Most panels mix conceptual theory with a few SQL or schema design scenarios."
      }
    ]
  },
  {
    title: "OOPS Interview Questions for Freshers",
    slug: "oops-interview-questions",
    description: "Prepare object-oriented programming interview questions with practical explanations and beginner-friendly examples.",
    category: "interview",
    intent: "commercial-investigation",
    keywords: ["oops interview questions", "oops interview questions for freshers", "oop concepts interview answers"],
    heroStat: "31 beginner prompts",
    content: [
      "Explain encapsulation, inheritance, polymorphism, and abstraction using everyday coding examples.",
      "Distinguish compile-time and runtime polymorphism with clarity because interviewers often test precision here.",
      "When answering, connect the concept to maintainability or reuse instead of repeating textbook lines."
    ],
    faqs: [
      {
        question: "What is the easiest way to answer OOPS questions?",
        answer: "Define the concept, give a simple class-based example, then mention one real benefit."
      }
    ]
  },
  {
    title: "Operating System Short Notes for Last-Minute Revision",
    slug: "operating-system-short-notes",
    description: "Use compact operating system notes for revision on scheduling, memory, deadlocks, and synchronization.",
    category: "notes",
    intent: "informational",
    keywords: ["operating system short notes", "os short notes for exam", "os revision notes"],
    heroStat: "12 core topics",
    content: [
      "Prioritize processes vs threads, CPU scheduling, paging, deadlocks, and semaphores for quick revision.",
      "Short notes should compress definitions, diagrams, and one-liner differences such as paging versus segmentation.",
      "Pair each note with one likely viva question to convert passive revision into active recall."
    ],
    faqs: [
      {
        question: "Which topics matter most in OS short notes?",
        answer: "Scheduling, synchronization, deadlocks, memory management, and file systems cover most exam patterns."
      }
    ]
  },
  {
    title: "Frontend Roadmap for Beginners in College",
    slug: "frontend-roadmap-for-beginners",
    description: "Follow a realistic frontend roadmap with HTML, CSS, JavaScript, React, projects, and portfolio milestones.",
    category: "roadmap",
    intent: "transactional",
    keywords: ["frontend roadmap for beginners", "frontend developer roadmap for students", "how to start frontend development"],
    heroStat: "8-week roadmap",
    content: [
      "Start with HTML semantics and CSS layout fundamentals before jumping into frameworks.",
      "Use JavaScript projects like to-do apps and dashboards to prove problem-solving, not just syntax knowledge.",
      "Move into React after you understand state, events, async requests, and browser debugging."
    ],
    faqs: [
      {
        question: "How long does a beginner frontend roadmap take?",
        answer: "A focused beginner can build solid fundamentals in eight to twelve weeks with daily practice."
      }
    ]
  },
  {
    title: "How to Prepare for Tech Viva Without Cramming",
    slug: "how-to-prepare-for-tech-viva",
    description: "Learn a structured method to prepare for technical viva exams using active recall, mock answers, and revision loops.",
    category: "guide",
    intent: "informational",
    keywords: ["how to prepare for tech viva", "technical viva preparation tips", "how to answer viva questions confidently"],
    heroStat: "3-step prep loop",
    content: [
      "Break your syllabus into micro-topics, then create question-answer pairs instead of rereading notes passively.",
      "Record yourself answering core questions because clarity, pace, and confidence improve with hearing your own delivery.",
      "Finish with spaced repetition and a final cheat sheet covering definitions, diagrams, and contrasts."
    ],
    faqs: [
      {
        question: "What is the best revision strategy for viva?",
        answer: "Use active recall with short answers, mock practice, and spaced revision instead of only reading notes."
      }
    ]
  }
].map((article, index) => ({
  id: `seed-${index + 1}`,
  ...article,
  canonicalPath: `/${article.slug}`,
  updatedAt: "2026-05-07T00:00:00.000Z",
  related: article.keywords.slice(0, 2).map((keyword) => ({
    label: keyword,
    slug: slugify(keyword)
  }))
}));

export const dashboardSeed = {
  streakDays: 19,
  completedTopics: 63,
  hoursLearned: 88,
  averageQuizScore: 81,
  weeklyStudyTrend: [
    { day: "Mon", hours: 2.5, score: 76 },
    { day: "Tue", hours: 3.2, score: 83 },
    { day: "Wed", hours: 1.8, score: 72 },
    { day: "Thu", hours: 4.1, score: 89 },
    { day: "Fri", hours: 2.8, score: 80 },
    { day: "Sat", hours: 5.2, score: 92 },
    { day: "Sun", hours: 3.6, score: 85 }
  ],
  recentActivities: [
    "Completed DBMS transaction management quiz",
    "Generated CN viva question set",
    "Finished week 3 of frontend roadmap",
    "Reviewed operating system short notes"
  ]
};
