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

export const generateVivaPack = ({ subject = "dbms", level = "intermediate" }) => {
  const bank = subjectQuestionBanks[subject] || subjectQuestionBanks.dbms;
  return bank.map((question, index) => ({
    id: `${subject}-${index + 1}`,
    question,
    answer: `${question} Focus on a ${level} explanation with one definition, one example, and one tradeoff.`,
    difficulty: level
  }));
};

export const generateRoadmap = ({ goal = "frontend roadmap for beginners", durationWeeks = 8 }) => {
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
