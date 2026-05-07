import OpenAI from "openai";
import { env } from "../config/env.js";

const subjectQuestionBanks = {
  dbms: [
    "What is normalization and why is it important?",
    "Explain the difference between clustered and non-clustered indexes.",
    "What are ACID properties in a transaction?"
  ],
  oops: [
    "What is abstraction and how is it different from encapsulation?",
    "Explain runtime polymorphism with an example.",
    "Why is composition often preferred over inheritance?"
  ],
  cn: [
    "What is the difference between TCP and UDP?",
    "How does a three-way handshake work?",
    "Why are layers useful in networking?"
  ],
  os: [
    "What is deadlock and how can it be prevented?",
    "Explain paging in memory management.",
    "How do processes differ from threads?"
  ]
};

const hasOpenRouter = Boolean(env.openrouterApiKey);

const openRouterClient = hasOpenRouter
  ? new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: env.openrouterApiKey
    })
  : null;

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const callOpenRouter = async (prompt) => {
  if (!openRouterClient) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const completion = await openRouterClient.chat.completions.create({
    model: env.openrouterModel,
    messages: [
      {
        role: "system",
        content:
          "You are an educational AI assistant for a student SaaS app. Return precise, concise, production-safe content."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return completion.choices[0]?.message?.content?.trim() || "";
};

const buildFallbackVivaPack = ({ subject = "dbms", level = "intermediate" }) => {
  const bank = subjectQuestionBanks[subject] || subjectQuestionBanks.dbms;
  return bank.map((question, index) => ({
    id: `${subject}-${index + 1}`,
    question,
    answer: `${question} Focus on a ${level} explanation with one definition, one example, and one tradeoff.`,
    difficulty: level
  }));
};

const buildFallbackRoadmap = ({ goal = "frontend roadmap for beginners", durationWeeks = 8 }) => {
  const weeks = Array.from({ length: durationWeeks }, (_, index) => index + 1);
  return {
    goal,
    durationWeeks,
    milestones: weeks.map((week) => ({
      week,
      focus: week <= 2 ? "Core fundamentals" : week <= 5 ? "Guided practice" : "Projects and revision",
      tasks: [
        `Study ${goal} concept block ${week}`,
        `Finish one applied exercise for week ${week}`,
        "Review progress, blockers, and quiz weak areas"
      ]
    }))
  };
};

export const generateVivaPack = async ({ subject = "dbms", level = "intermediate" }) => {
  if (!hasOpenRouter) {
    return buildFallbackVivaPack({ subject, level });
  }

  try {
    const prompt = `
Generate 5 ${subject.toUpperCase()} viva questions for ${level} level students.
Return only valid JSON in this shape:
{
  "items": [
    {
      "id": "string",
      "question": "string",
      "answer": "string",
      "difficulty": "${level}"
    }
  ]
}
Keep answers concise, exam-ready, and factually grounded.
`;

    const raw = await callOpenRouter(prompt);
    const parsed = safeJsonParse(raw);

    if (parsed?.items?.length) {
      return parsed.items;
    }
  } catch (error) {
    console.error("OpenRouter viva generation failed, using fallback.", error.message);
  }

  return buildFallbackVivaPack({ subject, level });
};

export const generateRoadmap = async ({ goal = "frontend roadmap for beginners", durationWeeks = 8 }) => {
  if (!hasOpenRouter) {
    return buildFallbackRoadmap({ goal, durationWeeks });
  }

  try {
    const prompt = `
Generate a ${durationWeeks}-week study roadmap for: "${goal}".
Return only valid JSON in this shape:
{
  "goal": "string",
  "durationWeeks": ${durationWeeks},
  "milestones": [
    {
      "week": 1,
      "focus": "string",
      "tasks": ["string", "string", "string"]
    }
  ]
}
Make the roadmap realistic for students and keep each task actionable.
`;

    const raw = await callOpenRouter(prompt);
    const parsed = safeJsonParse(raw);

    if (parsed?.milestones?.length) {
      return parsed;
    }
  } catch (error) {
    console.error("OpenRouter roadmap generation failed, using fallback.", error.message);
  }

  return buildFallbackRoadmap({ goal, durationWeeks });
};

export const generateAIHealthSample = async () => {
  if (!hasOpenRouter) {
    return {
      provider: "fallback",
      model: "local-seed",
      output: buildFallbackVivaPack({ subject: "dbms", level: "intermediate" }).slice(0, 2)
    };
  }

  const output = await callOpenRouter(
    'Generate exactly 2 DBMS viva questions with very short answers. Return plain text with numbered lines.'
  );

  return {
    provider: "openrouter",
    model: env.openrouterModel,
    output
  };
};
