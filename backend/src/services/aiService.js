import { createHash } from "crypto";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { AIGenerationCache } from "../models/AIGenerationCache.js";
import { slugify } from "../utils/slugify.js";
import { logger } from "../utils/logger.js";

const hasOpenRouter = Boolean(env.openrouterApiKey);
const AI_TIMEOUT_MS = env.openrouterTimeoutMs;
const AI_RETRY_COUNT = env.openrouterRetryCount;

const roadmapBlueprints = {
  frontend: {
    label: "frontend development",
    longTail: [
      "frontend roadmap for beginners",
      "how to learn frontend development step by step",
      "frontend projects for students"
    ],
    internalLinks: ["/frontend-roadmap-for-beginners", "/how-to-prepare-for-technical-viva", "/sql-joins-explained-with-examples"],
    faq: [
      {
        question: "How long should a frontend roadmap for beginners take?",
        answer: "A focused learner can cover strong fundamentals in eight to twelve weeks if each week includes one practical build and one revision loop."
      },
      {
        question: "What should a frontend beginner build first?",
        answer: "Start with a semantic portfolio page, then a responsive layout, then a JavaScript app, and finally a small React project."
      }
    ],
    weeks: [
      {
        focus: "HTML structure and accessibility habits",
        topics: ["HTML5 semantic tags", "Forms and labels", "Headings and document structure", "Accessibility basics"],
        exercises: [
          "Rebuild a college event page using semantic sections only",
          "Create a student registration form with labels, helper text, and accessible grouping"
        ],
        project: "Portfolio landing page with semantic navigation, skills section, and contact form",
        resources: ["MDN HTML guide", "web.dev accessibility basics"],
        interviewPrep: ["Explain why semantic tags matter", "Discuss how labels improve forms"],
        revisionCheckpoint: "Review HTML structure and accessibility rules with one handwritten cheat sheet."
      },
      {
        focus: "CSS layout systems and responsive design",
        topics: ["Box model", "Flexbox", "Grid", "Responsive breakpoints"],
        exercises: [
          "Build a card layout with Flexbox and then rebuild it with Grid",
          "Convert a desktop-only layout into a mobile-first responsive page"
        ],
        project: "Responsive blog homepage with hero, article cards, and sidebar",
        resources: ["MDN Flexbox docs", "CSS Grid Garden"],
        interviewPrep: ["Compare Flexbox and Grid", "Explain mobile-first styling"],
        revisionCheckpoint: "Refactor spacing, typography, and color usage for consistency."
      },
      {
        focus: "JavaScript fundamentals and DOM interaction",
        topics: ["Functions and arrays", "Objects and conditionals", "DOM selection", "Event handling and local storage"],
        exercises: [
          "Build a character counter and form validator",
          "Create a FAQ accordion and persist its state with local storage"
        ],
        project: "Task tracker app with filters, due states, and local storage persistence",
        resources: ["javascript.info fundamentals", "MDN DOM manipulation"],
        interviewPrep: ["Explain event bubbling", "Discuss local storage vs session storage"],
        revisionCheckpoint: "Solve five DOM questions without looking at old code."
      },
      {
        focus: "Async JavaScript and API-driven interfaces",
        topics: ["Promises", "Async and await", "Fetch and Axios", "Error and loading states"],
        exercises: [
          "Fetch data from a public API and render loading, empty, and error states",
          "Implement a debounced search box for an API-backed list"
        ],
        project: "Movie or GitHub profile explorer with search, filters, and retry handling",
        resources: ["MDN Fetch API", "freeCodeCamp async JavaScript lessons"],
        interviewPrep: ["Explain promises vs async-await", "Describe when to debounce a search input"],
        revisionCheckpoint: "Document the full request lifecycle from user action to UI update."
      },
      {
        focus: "React component thinking and state design",
        topics: ["JSX and props", "Local state", "Component composition", "Conditional rendering"],
        exercises: [
          "Split one dashboard screen into reusable components",
          "Lift shared state up across sibling components"
        ],
        project: "Student study planner with reusable card, modal, and filter components",
        resources: ["React official learn docs", "Scrimba React fundamentals"],
        interviewPrep: ["Explain prop drilling", "Discuss local vs shared state"],
        revisionCheckpoint: "Refactor repeated UI patterns into reusable components."
      },
      {
        focus: "Routing, server state, and dashboard UX",
        topics: ["React Router", "Route layouts", "React Query", "Caching and invalidation"],
        exercises: [
          "Create public and protected routes for a learning app",
          "Add loading skeletons, empty states, and mutation feedback"
        ],
        project: "Multi-page learning dashboard with auth screens and analytics cards",
        resources: ["React Router docs", "TanStack Query guides"],
        interviewPrep: ["Explain client-side routing", "Describe why React Query helps with server state"],
        revisionCheckpoint: "Review route hierarchy and identify any navigation confusion."
      },
      {
        focus: "Portfolio polish, performance, and deployment",
        topics: ["Code splitting", "Lighthouse basics", "Environment variables", "Vercel deployment"],
        exercises: [
          "Lazy-load one heavy route and compare bundle changes",
          "Fix one performance issue and one accessibility issue from a Lighthouse audit"
        ],
        project: "Deploy your strongest frontend project with custom metadata and analytics",
        resources: ["Vercel docs", "web.dev performance metrics"],
        interviewPrep: ["Explain lazy loading", "Walk through your deployment pipeline"],
        revisionCheckpoint: "Prepare one portfolio case study that explains the project tradeoffs clearly."
      }
    ]
  },
  backend: {
    label: "backend development",
    longTail: [
      "backend roadmap for beginners",
      "node js backend roadmap for students",
      "backend projects for placements"
    ],
    internalLinks: ["/dbms-viva-questions-for-beginners", "/how-to-prepare-for-technical-viva", "/frontend-roadmap-for-beginners"],
    faq: [
      {
        question: "What should a beginner backend roadmap include?",
        answer: "A strong beginner backend roadmap should cover Node.js basics, Express architecture, databases, authentication, testing, and deployment."
      }
    ],
    weeks: [
      {
        focus: "Node.js runtime and HTTP foundations",
        topics: ["Node modules", "npm scripts", "HTTP methods", "REST basics"],
        exercises: [
          "Write a simple HTTP server and inspect request data",
          "Design CRUD endpoints for a student notes service"
        ],
        project: "Study notes API with local JSON persistence",
        resources: ["Node.js official docs", "MDN HTTP overview"],
        interviewPrep: ["Explain GET vs POST vs PATCH", "Describe a request lifecycle in Node.js"],
        revisionCheckpoint: "Summarize REST naming and status code conventions."
      },
      {
        focus: "Express architecture and validation",
        topics: ["Routers", "Controllers and services", "Middleware order", "Request validation"],
        exercises: [
          "Split a monolithic route file into route-controller-service layers",
          "Add schema validation and centralized error handling to one resource"
        ],
        project: "Course planner API with modular Express architecture",
        resources: ["Express official guide", "Zod docs"],
        interviewPrep: ["Explain middleware chaining", "Discuss why layered architecture helps scaling"],
        revisionCheckpoint: "Review validation and error handling gaps in your API."
      },
      {
        focus: "MongoDB data modeling and query design",
        topics: ["Collections and schemas", "Indexes", "Embedding vs referencing", "Search and filtering"],
        exercises: [
          "Model users, tasks, and progress collections",
          "Write filtered and sorted queries for a dashboard endpoint"
        ],
        project: "Habit tracking backend with MongoDB analytics endpoints",
        resources: ["MongoDB University basics", "Mongoose docs"],
        interviewPrep: ["Explain embedding vs referencing", "Describe why indexes improve some reads"],
        revisionCheckpoint: "Write down one schema tradeoff you made and why."
      },
      {
        focus: "Authentication and secure API design",
        topics: ["JWT", "OAuth flow basics", "Protected routes", "Security middleware"],
        exercises: [
          "Protect a dashboard route with bearer token verification",
          "Model a login-to-session flow using provider auth plus backend token issuance"
        ],
        project: "Auth-enabled productivity API with profile and session endpoints",
        resources: ["JWT.io intro", "OWASP auth cheatsheets"],
        interviewPrep: ["Explain JWT contents", "Discuss common auth mistakes in student projects"],
        revisionCheckpoint: "Audit auth routes for token, role, and expiration handling."
      },
      {
        focus: "Third-party APIs, uploads, and async reliability",
        topics: ["External API integration", "Uploads with Multer", "Cloud storage", "Timeout and fallback patterns"],
        exercises: [
          "Integrate one third-party API and handle failures gracefully",
          "Upload one safe file type with server-side validation"
        ],
        project: "Profile media API with Cloudinary upload and metadata storage",
        resources: ["Cloudinary Node docs", "Multer docs"],
        interviewPrep: ["Explain safe file upload flow", "Describe how you handle third-party API failure"],
        revisionCheckpoint: "Review timeout, retries, and fallback behavior in your service layer."
      },
      {
        focus: "Testing, hardening, and deployment readiness",
        topics: ["Node test runner or Jest", "Supertest", "CORS and rate limiting", "Render deployment"],
        exercises: [
          "Write tests for health, auth, and one protected route",
          "Deploy an API and verify environment variables with production logs"
        ],
        project: "Production-ready API starter kit for future projects",
        resources: ["Supertest docs", "Render docs"],
        interviewPrep: ["Explain API hardening basics", "Walk through your deployment process end to end"],
        revisionCheckpoint: "Create a release checklist for env vars, CORS, logs, and test coverage."
      }
    ]
  },
  dbms: {
    label: "DBMS preparation",
    longTail: [
      "dbms roadmap for students",
      "database management system study plan",
      "dbms interview preparation roadmap"
    ],
    internalLinks: ["/dbms-viva-questions-for-beginners", "/sql-joins-explained-with-examples", "/how-to-prepare-for-technical-viva"],
    faq: [
      {
        question: "What should a DBMS roadmap cover first?",
        answer: "A strong DBMS roadmap starts with relational concepts, keys, normalization, SQL queries, and transactions before moving into optimization."
      }
    ],
    weeks: [
      {
        focus: "Relational foundations and data modeling",
        topics: ["DBMS vs file systems", "ER modeling", "Keys and constraints", "Schema thinking"],
        exercises: [
          "Design a library or hostel management ER diagram",
          "Identify primary and foreign keys in a student results system"
        ],
        project: "Database schema blueprint for a student learning platform",
        resources: ["Neso Academy DBMS playlist", "Lucidchart ER diagram tutorials"],
        interviewPrep: ["Explain why DBMS beats flat files", "Discuss candidate key vs primary key"],
        revisionCheckpoint: "Redraw one ER model from memory and explain each relationship."
      },
      {
        focus: "Normalization and schema cleanup",
        topics: ["1NF", "2NF", "3NF", "BCNF"],
        exercises: [
          "Normalize a denormalized marks table to 3NF",
          "Write a short comparison of 3NF and BCNF with one real example"
        ],
        project: "Normalization case study for enrollment or ecommerce data",
        resources: ["Normalization notes", "Gate Smashers DBMS lectures"],
        interviewPrep: ["Explain partial dependency", "Discuss when denormalization may be acceptable"],
        revisionCheckpoint: "Solve one normalization problem without checking notes."
      },
      {
        focus: "SQL fundamentals and clean querying",
        topics: ["SELECT and WHERE", "Sorting and grouping", "Aggregate functions", "Subqueries"],
        exercises: [
          "Write ten SQL queries against a student results dataset",
          "Create one department-wise performance summary using GROUP BY"
        ],
        project: "Mini SQL workbook for academic management queries",
        resources: ["SQLBolt", "Mode SQL tutorial"],
        interviewPrep: ["Explain aggregate vs scalar functions", "Discuss when subqueries are useful"],
        revisionCheckpoint: "Rewrite messy SQL into clearer, better-structured queries."
      },
      {
        focus: "Joins, views, and reporting logic",
        topics: ["Inner and left joins", "Views", "Aliases", "Report-building patterns"],
        exercises: [
          "Join students, subjects, and marks tables into one report",
          "Create a reusable view for attendance or placement reports"
        ],
        project: "Academic dashboard query pack using joins and views",
        resources: ["SQL joins explained guide", "W3Schools SQL joins practice"],
        interviewPrep: ["Differentiate inner join and left join", "Explain why views help reporting"],
        revisionCheckpoint: "Translate three business questions into SQL without looking up syntax."
      },
      {
        focus: "Transactions, ACID, and interview revision",
        topics: ["Transactions", "Commit and rollback", "ACID properties", "Concurrency basics"],
        exercises: [
          "Model a bank transfer transaction and explain failure handling",
          "Write one example each for dirty read and lost update"
        ],
        project: "DBMS viva prep sheet covering ACID, joins, keys, and normalization",
        resources: ["DBMS transaction notes", "Interview question banks"],
        interviewPrep: ["Explain atomicity with a real example", "Compare consistency and isolation"],
        revisionCheckpoint: "Create a one-page DBMS summary for final viva revision."
      }
    ]
  },
  systems: {
    label: "operating systems preparation",
    longTail: [
      "operating system roadmap for students",
      "os interview preparation roadmap",
      "how to study operating system concepts"
    ],
    internalLinks: ["/os-short-notes-for-exams", "/computer-networks-important-topics", "/how-to-prepare-for-technical-viva"],
    faq: [
      {
        question: "Which operating system topics should students learn first?",
        answer: "Start with processes, threads, scheduling, synchronization, deadlocks, and memory management because they appear most often in exams and interviews."
      }
    ],
    weeks: [
      {
        focus: "OS foundations, processes, and threads",
        topics: ["Role of an OS", "Processes", "Threads", "Process lifecycle"],
        exercises: [
          "Draw the process state diagram from memory",
          "Compare process and thread behavior using one real application example"
        ],
        project: "Concise revision deck for process and thread concepts",
        resources: ["MIT OS course notes", "Neso Academy OS basics"],
        interviewPrep: ["Explain process vs thread", "Describe context switching simply"],
        revisionCheckpoint: "Retell the process lifecycle without using memorized wording."
      },
      {
        focus: "CPU scheduling and performance tradeoffs",
        topics: ["FCFS", "SJF", "Round Robin", "Priority scheduling"],
        exercises: [
          "Solve one scheduling table by hand",
          "Compare waiting time and responsiveness across algorithms"
        ],
        project: "Scheduling comparison notebook with solved examples",
        resources: ["Gate Smashers scheduling lectures", "Scheduling visual references"],
        interviewPrep: ["Explain why Round Robin suits time-sharing", "Discuss starvation in priority scheduling"],
        revisionCheckpoint: "Summarize each scheduling algorithm in one line plus one tradeoff."
      },
      {
        focus: "Synchronization and shared-resource control",
        topics: ["Race conditions", "Critical section", "Semaphores", "Mutex"],
        exercises: [
          "Explain producer-consumer with a shared buffer example",
          "Write short notes for semaphore vs mutex"
        ],
        project: "Concurrency concept map for viva preparation",
        resources: ["Little Book of Semaphores", "Synchronization lecture notes"],
        interviewPrep: ["Define race condition", "Explain semaphore with a practical scenario"],
        revisionCheckpoint: "Teach the producer-consumer problem aloud in under two minutes."
      },
      {
        focus: "Deadlocks and resource management",
        topics: ["Deadlock conditions", "Prevention", "Avoidance", "Detection"],
        exercises: [
          "Identify Coffman conditions in one scenario",
          "Explain one prevention strategy and its downside"
        ],
        project: "Deadlock case study notes for exam answers",
        resources: ["OS short notes", "University lecture PDFs"],
        interviewPrep: ["List the four deadlock conditions", "Discuss why prevention can reduce flexibility"],
        revisionCheckpoint: "Make one comparison chart for prevention, avoidance, and detection."
      },
      {
        focus: "Memory management and virtual memory",
        topics: ["Paging", "Segmentation", "Virtual memory", "Page replacement"],
        exercises: [
          "Compare paging and segmentation with one clean diagram",
          "Solve one page replacement example manually"
        ],
        project: "Memory management revision summary with diagrams",
        resources: ["Memory management lectures", "Belady anomaly explainers"],
        interviewPrep: ["Explain page fault", "Discuss why virtual memory matters"],
        revisionCheckpoint: "Prepare two quick diagrams: paging flow and address translation."
      }
    ]
  },
  aptitude: {
    label: "placement aptitude preparation",
    longTail: [
      "aptitude roadmap for placements",
      "quantitative aptitude study plan for beginners",
      "placement aptitude preparation roadmap"
    ],
    internalLinks: ["/how-to-prepare-for-technical-viva", "/frontend-roadmap-for-beginners", "/oops-interview-questions-for-students"],
    faq: [
      {
        question: "How should beginners structure aptitude preparation?",
        answer: "Start with arithmetic accuracy, then move into reasoning patterns, timed practice, mock analysis, and weak-area revision."
      }
    ],
    weeks: [
      {
        focus: "Arithmetic accuracy and formula confidence",
        topics: ["Percentages", "Ratio and proportion", "Profit and loss", "Averages"],
        exercises: [
          "Solve 20 arithmetic questions with a timer",
          "Maintain an error log for repeated calculation mistakes"
        ],
        project: "Aptitude formula sheet with your own worked examples",
        resources: ["IndiaBIX arithmetic sections", "Arithmetic shortcut lessons"],
        interviewPrep: ["Explain how you reduce silly mistakes", "Discuss how you practice speed without losing accuracy"],
        revisionCheckpoint: "Review every wrong arithmetic question and label the error type."
      },
      {
        focus: "Number systems, algebra, and equation handling",
        topics: ["Divisibility", "HCF and LCM", "Linear equations", "Simplification"],
        exercises: [
          "Practice 15 number system questions",
          "Solve equation sets under timed conditions"
        ],
        project: "Shortcut notebook for algebra and number properties",
        resources: ["Placement prep blogs", "Practice sheets for algebra"],
        interviewPrep: ["Walk through one equation mentally", "Discuss when you use a shortcut vs full method"],
        revisionCheckpoint: "Revisit weak algebra patterns with flashcards."
      },
      {
        focus: "Logical reasoning and pattern recognition",
        topics: ["Series", "Coding-decoding", "Blood relations", "Seating arrangement"],
        exercises: [
          "Solve one seating arrangement puzzle daily",
          "Practice identifying the fastest route to a series answer"
        ],
        project: "Reasoning pattern tracker with repeatable shortcuts",
        resources: ["Reasoning mock sets", "Puzzle walkthrough channels"],
        interviewPrep: ["Describe your reasoning approach", "Explain how you avoid getting stuck on one puzzle"],
        revisionCheckpoint: "Review reasoning question families instead of isolated problems."
      },
      {
        focus: "Data interpretation and mock-test strategy",
        topics: ["Tables and charts", "Approximation", "Timed sets", "Weak-area recovery"],
        exercises: [
          "Solve two DI sets with strict time limits",
          "Take one mock and build a weak-topic recovery plan from it"
        ],
        project: "Mock-performance dashboard tracking accuracy and attempt rate",
        resources: ["Mock test platforms", "DI practice portals"],
        interviewPrep: ["Explain how you balance speed and accuracy", "Discuss how you analyze a poor mock"],
        revisionCheckpoint: "Prepare a final revision pack of formulas, traps, and time rules."
      }
    ]
  },
  general: {
    label: "technical learning roadmap",
    longTail: [
      "technical learning roadmap for students",
      "skill development roadmap for beginners",
      "career roadmap for college students"
    ],
    internalLinks: ["/how-to-prepare-for-technical-viva", "/frontend-roadmap-for-beginners", "/dbms-viva-questions-for-beginners"],
    faq: [
      {
        question: "How do I create a good roadmap for a new technical topic?",
        answer: "Break it into foundations, guided practice, applied projects, revision loops, and interview-level communication."
      }
    ],
    weeks: [
      {
        focus: "Foundations and vocabulary building",
        topics: ["Core terms", "Basic concepts", "Problem space", "Common beginner mistakes"],
        exercises: [
          "Create a topic glossary from three trusted sources",
          "Summarize one beginner article in your own words"
        ],
        project: "Starter notes page for the selected topic",
        resources: ["Official docs", "Beginner-friendly tutorial articles"],
        interviewPrep: ["Explain the topic simply", "Describe where the topic is used"],
        revisionCheckpoint: "Condense the first week into one page of notes."
      },
      {
        focus: "Applied practice and beginner implementation",
        topics: ["Hands-on setup", "Basic workflows", "Debugging habits", "Incremental practice"],
        exercises: [
          "Build one tiny demo",
          "Document every setup error and how you fixed it"
        ],
        project: "Mini implementation tied to the chosen skill",
        resources: ["Official examples", "Community walkthroughs"],
        interviewPrep: ["Discuss what you built", "Explain one mistake and its fix"],
        revisionCheckpoint: "Review the steps required to recreate the setup quickly."
      },
      {
        focus: "Intermediate patterns and portfolio polish",
        topics: ["Reusable patterns", "Tradeoffs", "Documentation", "Interview communication"],
        exercises: [
          "Refactor your first demo into a cleaner structure",
          "Write a recruiter-friendly summary of the project"
        ],
        project: "Resume-ready capstone aligned with the selected topic",
        resources: ["Portfolio writing guides", "Interview question roundups"],
        interviewPrep: ["Present the capstone clearly", "Connect the topic to a real use case"],
        revisionCheckpoint: "Finalize one polished project story for placements."
      }
    ]
  }
};

roadmapBlueprints.sde = {
  label: "software development engineer preparation",
  longTail: [
    "sde roadmap for beginners",
    "software development engineer roadmap for students",
    "sde interview preparation roadmap"
  ],
  internalLinks: ["/how-to-prepare-for-technical-viva", "/dbms-viva-questions-for-beginners", "/frontend-roadmap-for-beginners"],
  faq: [
    {
      question: "What should an SDE roadmap include?",
      answer: "A strong SDE roadmap should include programming fundamentals, DSA, core CS subjects, backend and frontend basics, DevOps exposure, and interview preparation."
    }
  ],
  weeks: [
    {
      focus: "Programming foundations and problem-solving habits",
      topics: ["Choose Java, C++, or Python", "Complexity analysis", "Problem decomposition", "Coding discipline"],
      exercises: [
        "Solve 8 to 10 easy coding problems focused on arrays and strings",
        "Write time and space complexity for every problem you solve this week"
      ],
      project: "DSA notes repository with categorized solved problems and explanations",
      resources: ["NeetCode roadmap", "CS50 problem-solving lectures"],
      interviewPrep: ["Explain Big O with examples", "Discuss why brute force can still be useful initially"],
      revisionCheckpoint: "Review syntax shortcuts, debugging habits, and complexity patterns."
    },
    {
      focus: "DSA depth for coding rounds",
      topics: ["Linked lists", "Stacks and queues", "Trees and BST", "Graphs", "Dynamic programming basics"],
      exercises: [
        "Solve one pattern set each for trees, graphs, and two-pointer problems",
        "Redo three previously solved problems without looking at the answer"
      ],
      project: "LeetCode patterns tracker with notes for edge cases and optimizations",
      resources: ["LeetCode study plans", "Take U Forward DSA sheet"],
      interviewPrep: ["Explain BFS vs DFS", "Discuss when memoization helps"],
      revisionCheckpoint: "Group solved problems by pattern instead of platform order."
    },
    {
      focus: "Core CS for technical screening",
      topics: ["DBMS", "Operating Systems", "Computer Networks", "OOPs"],
      exercises: [
        "Write crisp revision notes for ACID, deadlocks, TCP vs UDP, and polymorphism",
        "Answer 15 viva-style core CS questions aloud"
      ],
      project: "Core CS cheat-sheet pack for interviews and placement revision",
      resources: ["DBMS and OS revision playlists", "Core CS interview notes"],
      interviewPrep: ["Explain normalization clearly", "Describe process vs thread", "Compare inheritance and composition"],
      revisionCheckpoint: "Make a one-page summary for each CS subject."
    },
    {
      focus: "Development basics and API thinking",
      topics: ["Frontend basics", "Backend APIs", "Databases", "Authentication", "Git and GitHub"],
      exercises: [
        "Build a CRUD API and connect it to a simple frontend",
        "Use Git branches and write meaningful commit messages for one mini project"
      ],
      project: "Full-stack task or notes app with authentication and dashboard views",
      resources: ["MDN web docs", "Express and React official docs"],
      interviewPrep: ["Explain REST API structure", "Discuss how JWT auth works", "Describe how frontend and backend communicate"],
      revisionCheckpoint: "Document architecture decisions and API flow in your README."
    },
    {
      focus: "System design, testing, and scaling awareness",
      topics: ["LLD basics", "HLD awareness", "Caching", "Testing", "Scalable service thinking"],
      exercises: [
        "Design a URL shortener or chat system at a high level",
        "Write tests for one backend module and one frontend user flow"
      ],
      project: "Resume-ready SaaS app with modular architecture and test coverage",
      resources: ["System design primers", "Testing guides for Node and React"],
      interviewPrep: ["Explain load balancer purpose", "Describe one scalable API design decision", "Walk through your project architecture"],
      revisionCheckpoint: "Prepare a design story for one end-to-end project."
    },
    {
      focus: "Placement conversion and recruiter-facing polish",
      topics: ["Resume prep", "Mock interviews", "Behavioral stories", "Company-specific prep", "GitHub portfolio"],
      exercises: [
        "Run two mock interviews: one coding and one HR-style",
        "Refine GitHub READMEs and pin your strongest repositories"
      ],
      project: "SDE portfolio bundle with DSA tracker, full-stack app, and architecture case study",
      resources: ["Resume review guides", "Mock interview platforms"],
      interviewPrep: ["Prepare STAR-format project stories", "Discuss one bug you solved in production", "Explain one design tradeoff from your project"],
      revisionCheckpoint: "Finalize a placement checklist covering DSA, projects, CS, and resume links."
    }
  ]
};

roadmapBlueprints.devops = {
  label: "devops engineering preparation",
  longTail: [
    "devops roadmap for beginners",
    "devops engineer learning roadmap",
    "docker kubernetes roadmap for students"
  ],
  internalLinks: ["/frontend-roadmap-for-beginners", "/how-to-prepare-for-technical-viva"],
  faq: [
    {
      question: "What should a DevOps roadmap include first?",
      answer: "Start with Linux, networking, Git, scripting, Docker, CI/CD, cloud basics, and deployment troubleshooting."
    }
  ],
  weeks: [
    {
      focus: "Linux, networking, and shell confidence",
      topics: ["Linux commands", "File permissions", "Processes and ports", "Basic networking"],
      exercises: ["Inspect running services and ports on a local machine", "Write a shell script for log rotation or backup"],
      project: "Linux operations notebook with commands and troubleshooting steps",
      resources: ["Linux Journey", "DigitalOcean Linux tutorials"],
      interviewPrep: ["Explain chmod and permissions", "Discuss how to inspect a port issue"],
      revisionCheckpoint: "Summarize the command-line workflows you used most often."
    },
    {
      focus: "Version control and container basics",
      topics: ["Git branching", "Pull requests", "Docker images", "Containers and volumes"],
      exercises: ["Containerize a small Node or Python app", "Use Git branches and merge conflicts in a demo repo"],
      project: "Dockerized API with environment-based configuration",
      resources: ["Docker docs", "Atlassian Git tutorials"],
      interviewPrep: ["Explain image vs container", "Discuss common Git collaboration issues"],
      revisionCheckpoint: "Rebuild the container workflow from scratch without notes."
    },
    {
      focus: "CI/CD pipelines and cloud deployment",
      topics: ["CI pipelines", "CD concepts", "Environment variables", "Cloud deployment basics"],
      exercises: ["Build one automated test-and-deploy pipeline", "Deploy a containerized service to a cloud platform"],
      project: "CI/CD starter pipeline for a MERN or Node service",
      resources: ["GitHub Actions docs", "Render or Railway deployment docs"],
      interviewPrep: ["Explain CI vs CD", "Describe a safe deployment workflow"],
      revisionCheckpoint: "Document the full deployment pipeline and rollback path."
    },
    {
      focus: "Monitoring, scaling, and Kubernetes awareness",
      topics: ["Logs", "Health checks", "Monitoring basics", "Kubernetes concepts", "Infrastructure reliability"],
      exercises: ["Add health checks and structured logs to one service", "Study pods, deployments, services, and ingress concepts"],
      project: "Production readiness checklist for a cloud-hosted SaaS backend",
      resources: ["Kubernetes basics", "Prometheus/Grafana intros"],
      interviewPrep: ["Explain pod vs container", "Discuss why health checks matter in production"],
      revisionCheckpoint: "Prepare a troubleshooting flow for deployment, logs, and service health."
    }
  ]
};

roadmapBlueprints.aiml = {
  label: "AI and machine learning preparation",
  longTail: [
    "ai ml roadmap for beginners",
    "machine learning roadmap for students",
    "python ai roadmap with projects"
  ],
  internalLinks: ["/frontend-roadmap-for-beginners", "/how-to-prepare-for-technical-viva"],
  faq: [
    {
      question: "What should an AI/ML roadmap start with?",
      answer: "Start with Python, math foundations, data handling, classical ML, model evaluation, and then move toward deep learning and deployment."
    }
  ],
  weeks: [
    {
      focus: "Python, data handling, and math refresh",
      topics: ["Python basics", "NumPy", "Pandas", "Probability", "Linear algebra intuition"],
      exercises: ["Clean and analyze one CSV dataset", "Implement summary stats and visual checks on real data"],
      project: "Exploratory data analysis notebook on a public dataset",
      resources: ["Kaggle micro-courses", "NumPy and Pandas docs"],
      interviewPrep: ["Explain bias vs variance", "Discuss why data cleaning matters"],
      revisionCheckpoint: "Summarize the Python and data workflows you used repeatedly."
    },
    {
      focus: "Classical machine learning workflows",
      topics: ["Regression", "Classification", "Train/test split", "Feature engineering", "Evaluation metrics"],
      exercises: ["Train two baseline models on one dataset", "Compare accuracy, precision, recall, and F1 on classification outputs"],
      project: "Predictive ML project with model comparison and evaluation write-up",
      resources: ["scikit-learn docs", "Google ML crash course"],
      interviewPrep: ["Explain overfitting", "Compare classification metrics"],
      revisionCheckpoint: "Document why one model performed better than another."
    },
    {
      focus: "Deep learning and practical experimentation",
      topics: ["Neural network basics", "TensorFlow or PyTorch", "Model training loops", "Hyperparameters"],
      exercises: ["Train a simple neural network on image or text data", "Tune one model using validation feedback"],
      project: "Deep learning mini-project such as digit classification or sentiment analysis",
      resources: ["TensorFlow tutorials", "PyTorch learning resources"],
      interviewPrep: ["Explain epochs and batch size", "Discuss why validation sets matter"],
      revisionCheckpoint: "Prepare one visual summary of your model training process."
    },
    {
      focus: "Deployment, MLOps awareness, and portfolio packaging",
      topics: ["Model serving", "FastAPI or Flask", "Experiment tracking", "Deployment basics", "AI portfolio storytelling"],
      exercises: ["Serve a trained model behind an API", "Write a project README that explains dataset, model, and limitations"],
      project: "End-to-end ML app with model inference API and basic frontend",
      resources: ["FastAPI docs", "Hugging Face deployment tutorials"],
      interviewPrep: ["Explain how you would deploy a model", "Discuss one limitation or ethical concern in your project"],
      revisionCheckpoint: "Finalize one ML case study with results, tradeoffs, and next steps."
    }
  ]
};

const vivaBlueprints = {
  dbms: {
    defaultTopic: "DBMS normalization",
    longTail: ["dbms normalization viva questions", "dbms viva questions with answers", "normalization interview questions"],
    internalLinks: ["/dbms-viva-questions-for-beginners", "/sql-joins-explained-with-examples", "/how-to-prepare-for-technical-viva"],
    faq: [
      {
        question: "What DBMS viva topics are asked most often?",
        answer: "Normalization, keys, joins, transactions, and indexing appear in many DBMS viva and interview rounds."
      }
    ],
    items: [
      {
        question: "What is normalization in DBMS?",
        answer: "Normalization organizes data into related tables so redundancy decreases and updates remain more consistent.",
        followUp: "When can aggressive normalization make reporting queries more complex?",
        example: "A student record table can be split into student, department, and enrollment tables instead of repeating department data in every row.",
        interviewAngle: "This checks whether you understand data quality tradeoffs instead of only memorizing a definition."
      },
      {
        question: "Explain first normal form with an example.",
        answer: "First normal form requires atomic values and removes repeating groups from a single row structure.",
        followUp: "Can a table be in 1NF and still have redundancy issues?",
        example: "Instead of storing multiple phone numbers in one field, each number should be stored as a separate atomic value.",
        interviewAngle: "A clean 1NF example shows that you can reason from messy data to better schema design."
      },
      {
        question: "What is the difference between second normal form and third normal form?",
        answer: "Second normal form removes partial dependency on part of a composite key, while third normal form removes transitive dependency between non-key attributes.",
        followUp: "Which dependency problem remains after 2NF but disappears in 3NF?",
        example: "A course table may fix composite-key issues in 2NF but still repeat department-level information until 3NF is applied.",
        interviewAngle: "This reveals whether you truly understand dependencies or are only repeating rule names."
      },
      {
        question: "What is BCNF and why is it stricter than 3NF?",
        answer: "BCNF requires every determinant to be a candidate key, which makes it stricter than 3NF in certain dependency cases.",
        followUp: "Can a table satisfy 3NF but still violate BCNF?",
        example: "Some scheduling or assignment tables look safe in 3NF but still allow anomalies unless BCNF is enforced.",
        interviewAngle: "This question is useful for separating surface-level preparation from deeper schema reasoning."
      },
      {
        question: "Why is normalization important in real database design?",
        answer: "It reduces duplication, lowers update anomalies, and makes long-term maintenance easier in growing systems.",
        followUp: "When might denormalization be reasonable in production databases?",
        example: "A student portal benefits when course and department data are stored cleanly rather than copied across many rows.",
        interviewAngle: "Good candidates mention both benefits and real-world tradeoffs."
      }
    ]
  },
  oops: {
    defaultTopic: "OOPS polymorphism",
    longTail: ["oops interview questions for students", "object oriented programming viva questions", "polymorphism interview questions"],
    internalLinks: ["/oops-interview-questions-for-students", "/frontend-roadmap-for-beginners", "/how-to-prepare-for-technical-viva"],
    faq: [
      {
        question: "Which OOPS questions are asked most in fresher interviews?",
        answer: "Encapsulation, abstraction, inheritance, polymorphism, and composition vs inheritance are among the most repeated fresher topics."
      }
    ],
    items: [
      {
        question: "What is encapsulation and why is it useful?",
        answer: "Encapsulation keeps data and related behavior together while controlling direct access to internal state.",
        followUp: "How does encapsulation improve maintainability in larger systems?",
        example: "A bank account class exposing deposit and withdraw methods is safer than allowing direct balance edits.",
        interviewAngle: "This checks whether you connect OOP theory with class design decisions."
      },
      {
        question: "How is abstraction different from encapsulation?",
        answer: "Abstraction hides implementation complexity from the user, while encapsulation protects and organizes state and behavior internally.",
        followUp: "Can a single design choice demonstrate both abstraction and encapsulation?",
        example: "A payment service may expose a simple pay method while hiding gateway logic and sensitive state details.",
        interviewAngle: "Interviewers use this to spot candidates who memorize terms without understanding them."
      },
      {
        question: "Explain runtime polymorphism with a simple example.",
        answer: "Runtime polymorphism happens when a base reference calls overridden behavior from the actual child object during execution.",
        followUp: "Why is runtime polymorphism useful in extensible applications?",
        example: "A Notification base type can call send while EmailNotification and SMSNotification implement it differently.",
        interviewAngle: "A clear example here proves you understand behavior substitution, not just vocabulary."
      },
      {
        question: "Why is composition often preferred over inheritance?",
        answer: "Composition reduces tight coupling and lets systems swap behavior more flexibly than deep inheritance chains.",
        followUp: "What is one case where inheritance still makes sense?",
        example: "A dashboard can compose chart, filter, and export services instead of inheriting everything from one base class.",
        interviewAngle: "This shows whether your design thinking feels modern and practical."
      },
      {
        question: "What is the difference between method overloading and method overriding?",
        answer: "Overloading changes parameter signatures in the same scope, while overriding changes inherited behavior in a child type.",
        followUp: "Which one is usually associated with runtime dispatch?",
        example: "A calculator may overload add for different inputs, while a child class may override render behavior from a parent component.",
        interviewAngle: "This is a classic precision test in fresher interviews."
      }
    ]
  },
  cn: {
    defaultTopic: "TCP vs UDP",
    longTail: ["computer networks viva questions", "tcp udp interview questions", "networking viva questions for students"],
    internalLinks: ["/computer-networks-important-topics", "/os-short-notes-for-exams", "/how-to-prepare-for-technical-viva"],
    faq: [
      {
        question: "What networking questions are asked most in viva?",
        answer: "TCP vs UDP, OSI layers, addressing, routing, and common network devices are among the most repeated topics."
      }
    ],
    items: [
      {
        question: "What is the difference between TCP and UDP?",
        answer: "TCP is connection-oriented and reliable, while UDP is connectionless and favors speed over guaranteed delivery.",
        followUp: "Why do live streaming systems often tolerate UDP-style communication?",
        example: "File transfer usually prefers TCP, while real-time voice or video often prioritizes speed and lower overhead.",
        interviewAngle: "This tests whether you can connect protocol behavior to application needs."
      },
      {
        question: "Why are network layers useful?",
        answer: "Layers separate responsibilities so protocols can evolve independently and systems remain easier to debug and maintain.",
        followUp: "How does layering help when one transport-level detail changes but the app does not?",
        example: "HTTP can rely on TCP without the application manually handling packet routing or transmission control.",
        interviewAngle: "A strong answer shows systems thinking, not just a memorized layer list."
      },
      {
        question: "How does the three-way handshake work?",
        answer: "A client sends SYN, the server replies with SYN-ACK, and the client confirms with ACK to establish a TCP connection.",
        followUp: "Why is the handshake necessary before reliable data transfer begins?",
        example: "A browser opening a secure or standard web connection begins with connection setup before request-response data flows.",
        interviewAngle: "Interviewers use this to check genuine understanding of connection establishment."
      },
      {
        question: "What is subnetting and why is it important?",
        answer: "Subnetting divides a larger network into smaller logical segments for better organization, efficiency, and control.",
        followUp: "How does subnetting help avoid wasting IP space?",
        example: "A campus network may separate labs, hostel networks, and faculty systems into different subnets.",
        interviewAngle: "Candidates who explain the reason behind subnetting usually sound stronger than those who only remember formulas."
      },
      {
        question: "What does a router do differently from a switch?",
        answer: "A switch connects devices within one local network, while a router forwards traffic between different networks.",
        followUp: "Where would you place routers and switches in a college campus setup?",
        example: "Switches connect classroom computers locally, while the router connects those networks to the internet.",
        interviewAngle: "This checks whether you understand devices in context rather than by name only."
      }
    ]
  },
  os: {
    defaultTopic: "Process vs thread",
    longTail: ["operating system viva questions", "process and thread interview questions", "os short notes viva questions"],
    internalLinks: ["/os-short-notes-for-exams", "/computer-networks-important-topics", "/how-to-prepare-for-technical-viva"],
    faq: [
      {
        question: "Which operating system viva questions are most common?",
        answer: "Process vs thread, scheduling, synchronization, deadlocks, and memory management appear in many operating system viva rounds."
      }
    ],
    items: [
      {
        question: "What is the difference between a process and a thread?",
        answer: "A process is an independent execution unit with its own memory space, while threads are lighter units that typically share process resources.",
        followUp: "Why are threads considered more lightweight than processes?",
        example: "A browser may run concurrent interface and background tasks using thread-level work inside broader process boundaries.",
        interviewAngle: "This is a foundational systems question that quickly reveals conceptual clarity."
      },
      {
        question: "What is deadlock in an operating system?",
        answer: "Deadlock is a state where processes wait on each other for resources in a circular way so none of them can continue.",
        followUp: "Which Coffman condition would you try to break to prevent deadlock?",
        example: "Two processes each holding one lock and waiting for the other's lock can block forever.",
        interviewAngle: "Strong answers include both the definition and one prevention idea."
      },
      {
        question: "Why is Round Robin scheduling useful?",
        answer: "Round Robin gives each process a time slice, which improves fairness and responsiveness in time-sharing environments.",
        followUp: "What happens if the time quantum is too small or too large?",
        example: "Interactive lab systems benefit when each active task receives periodic CPU time instead of waiting indefinitely.",
        interviewAngle: "This tests whether you understand scheduling tradeoffs instead of only algorithm names."
      },
      {
        question: "What is paging in memory management?",
        answer: "Paging divides memory into fixed-size blocks so processes can use non-contiguous physical memory more efficiently.",
        followUp: "How is paging different from segmentation?",
        example: "Virtual memory systems map logical pages to physical frames so large programs can run flexibly.",
        interviewAngle: "A simple and accurate explanation is more convincing than textbook language alone."
      },
      {
        question: "What is a race condition?",
        answer: "A race condition occurs when concurrent execution accesses shared state without proper coordination and produces unpredictable results.",
        followUp: "How do mutexes or semaphores help prevent race conditions?",
        example: "Two threads incrementing the same shared counter without locking may produce the wrong final value.",
        interviewAngle: "This shows whether you can connect concurrency theory with real bugs."
      }
    ]
  }
};

const subjectLabels = {
  dbms: "DBMS",
  oops: "OOPS",
  cn: "Computer Networks",
  os: "Operating Systems",
  general: "General Topic",
  cybersecurity: "Cybersecurity",
  marketing: "Digital Marketing",
  finance: "Finance",
  design: "UI/UX Design",
  cloud: "Cloud Computing",
  blockchain: "Blockchain",
  mechanical: "Mechanical Engineering",
  programming: "Programming",
  sde: "Software Development Engineering",
  frontend: "Frontend Development",
  backend: "Backend Engineering",
  devops: "DevOps",
  aiml: "AI/ML",
  systems: "Systems",
  aptitude: "Aptitude Preparation",
  "data-science": "Data Science"
};

const domainProfiles = {
  sde: {
    signals: /(sde|software development engineer|software engineer roadmap|leetcode|system design|lld|hld)/,
    label: "software development engineer preparation",
    keyTopics: ["DSA", "core CS", "system design", "backend APIs", "Git and GitHub", "mock interviews"],
    tools: ["LeetCode", "Git", "GitHub", "Postman", "Docker", "VS Code"],
    certifications: ["Optional: AWS Cloud Practitioner", "Optional: language-specific coding assessments"],
    phases: [
      ["Programming foundations", ["Java or C++ or Python", "complexity analysis", "debugging discipline"], "Solve beginner coding problems and write time complexity for each one."],
      ["DSA and coding patterns", ["arrays", "trees", "graphs", "dynamic programming"], "Practice one LeetCode pattern set and revisit failed problems."],
      ["Core CS mastery", ["DBMS", "OS", "CN", "OOPs"], "Create concise interview notes and explain one concept aloud daily."],
      ["Development and APIs", ["backend services", "REST APIs", "databases", "auth"], "Build one CRUD service and connect it to a simple UI or test client."],
      ["System design and testing", ["LLD", "HLD", "caching", "unit testing"], "Design one scalable system and justify its tradeoffs."],
      ["Placement conversion", ["resume stories", "mock interviews", "GitHub polish"], "Run timed mock interviews and refine project storytelling."]
    ],
    projectThemes: ["full-stack SaaS app", "API-first backend service", "DSA tracker with analytics"],
    resourceThemes: ["LeetCode study plans", "NeetCode", "system design primers", "official docs"],
    interviewThemes: ["coding rounds", "core CS viva", "project walkthroughs", "behavioral stories"],
    faq: [{ question: "What should an SDE roadmap include?", answer: "Programming, DSA, core CS, development basics, interview preparation, and strong projects should all appear in a serious SDE roadmap." }]
  },
  frontend: {
    signals: /(frontend|react|html|css|javascript|web ui|ui development|next\.?js|tailwind)/,
    label: "frontend development",
    keyTopics: ["HTML", "CSS", "JavaScript", "React", "accessibility", "performance", "deployment"],
    tools: ["VS Code", "Chrome DevTools", "GitHub", "Vercel", "Figma", "Lighthouse"],
    certifications: ["Optional: Meta Front-End basics", "Optional: JavaScript certification paths"],
    phases: [
      ["Markup and accessibility", ["semantic HTML", "forms", "headings", "ARIA basics"], "Audit one page for accessibility and fix landmark or form issues."],
      ["Layout and responsive design", ["Flexbox", "Grid", "responsive breakpoints", "spacing systems"], "Rebuild a static design into a mobile-first responsive page."],
      ["JavaScript interaction", ["DOM", "events", "local storage", "async JavaScript"], "Build a small interactive tool with local persistence."],
      ["Modern React workflows", ["components", "state", "routing", "API integration"], "Ship a multi-page React app with loading and error states."],
      ["Advanced frontend quality", ["performance optimization", "SEO basics", "testing", "deployment"], "Improve one project using Lighthouse findings and deploy it."],
      ["Portfolio polish", ["design systems", "case studies", "analytics"], "Turn your best frontend project into a recruiter-friendly case study."]
    ],
    projectThemes: ["portfolio site", "dashboard UI", "API-powered productivity app"],
    resourceThemes: ["MDN", "React docs", "web.dev", "freeCodeCamp"],
    interviewThemes: ["React concepts", "performance debugging", "accessibility decisions"],
    faq: [{ question: "What should a frontend roadmap focus on first?", answer: "Start with semantic HTML, responsive CSS, JavaScript fundamentals, then move into React, accessibility, and performance." }]
  },
  backend: {
    signals: /(backend|node|express|api|server|microservice|authentication|jwt)/,
    label: "backend engineering",
    keyTopics: ["Node.js", "Express", "databases", "authentication", "testing", "deployment"],
    tools: ["Postman", "MongoDB Atlas", "Render", "Docker", "GitHub", "VS Code"],
    certifications: ["Optional: REST API design courses", "Optional: backend cloud deployment badges"],
    phases: [
      ["Runtime and HTTP basics", ["Node.js", "HTTP methods", "REST conventions"], "Design CRUD endpoints for a realistic data model."],
      ["API architecture", ["routers", "controllers", "services", "validation"], "Refactor one API into layered architecture."],
      ["Databases and persistence", ["MongoDB", "indexes", "schema modeling", "query design"], "Model one product domain and justify the schema choices."],
      ["Security and auth", ["JWT", "OAuth basics", "rate limiting", "secure middleware"], "Protect one resource and test access rules."],
      ["Integrations and reliability", ["third-party APIs", "uploads", "timeouts", "fallbacks"], "Handle one flaky provider gracefully with retries or fallback."],
      ["Testing and deployment", ["integration tests", "CORS", "logs", "deployment checks"], "Deploy a hardened API and verify env and health behavior."]
    ],
    projectThemes: ["production-ready API", "auth-enabled backend", "analytics service"],
    resourceThemes: ["Node docs", "Express docs", "Mongoose docs", "OWASP cheatsheets"],
    interviewThemes: ["API lifecycle", "auth tradeoffs", "database modeling"],
    faq: [{ question: "What makes a backend roadmap production-ready?", answer: "It should cover architecture, databases, auth, reliability, testing, and deployment instead of only CRUD routes." }]
  },
  devops: {
    signals: /(devops|docker|kubernetes|ci\/cd|cicd|linux deployment|cloud engineer|observability|sre)/,
    label: "DevOps engineering",
    keyTopics: ["Linux", "Docker", "CI/CD", "cloud deployment", "monitoring", "Kubernetes"],
    tools: ["Docker", "GitHub Actions", "Kubernetes", "Render", "Prometheus", "Grafana"],
    certifications: ["Docker fundamentals", "AWS or Azure entry cloud cert", "CKA or KCNA awareness"],
    phases: [
      ["Linux and networking foundations", ["shell commands", "processes", "ports", "permissions"], "Write a shell script to automate a small ops task."],
      ["Containers and images", ["Dockerfiles", "volumes", "compose", "image hygiene"], "Containerize an app and explain the build/runtime split."],
      ["CI/CD pipelines", ["GitHub Actions", "test pipelines", "deploy automation"], "Build a pipeline that tests and deploys a simple service."],
      ["Cloud deployment", ["env management", "service hosting", "health checks"], "Deploy an app and verify logs, health, and rollback steps."],
      ["Monitoring and reliability", ["metrics", "logs", "alerts", "incident response"], "Add health checks and structured logs to one app."],
      ["Kubernetes awareness", ["pods", "deployments", "services", "ingress"], "Explain how a containerized app would scale in Kubernetes."]
    ],
    projectThemes: ["CI/CD pipeline starter", "containerized microservice", "production readiness checklist"],
    resourceThemes: ["Docker docs", "GitHub Actions docs", "Kubernetes basics", "Linux Journey"],
    interviewThemes: ["deployment flow", "container tradeoffs", "monitoring strategies"],
    faq: [{ question: "What should a beginner DevOps roadmap include?", answer: "Start with Linux, Git, containers, CI/CD, deployment basics, and monitoring before chasing advanced orchestration." }]
  },
  aiml: {
    signals: /(ai\/ml|machine learning|deep learning|data science|tensorflow|pytorch|ml roadmap|artificial intelligence)/,
    label: "AI and machine learning preparation",
    keyTopics: ["Python", "data preprocessing", "statistics", "model training", "evaluation", "deployment"],
    tools: ["Python", "Jupyter Notebook", "Pandas", "scikit-learn", "TensorFlow", "PyTorch"],
    certifications: ["Optional: Google ML Crash Course", "Optional: TensorFlow developer paths"],
    phases: [
      ["Python and math foundation", ["Python", "NumPy", "statistics", "probability"], "Implement simple analysis notebooks and explain feature distributions."],
      ["Data workflows", ["Pandas", "cleaning", "EDA", "visualization"], "Clean a messy dataset and document decisions."],
      ["Classical machine learning", ["regression", "classification", "feature engineering"], "Train baseline models and compare evaluation metrics."],
      ["Deep learning basics", ["neural networks", "training loops", "overfitting", "regularization"], "Build a small neural model and inspect failure cases."],
      ["Deployment and MLOps awareness", ["APIs for models", "experiment tracking", "model monitoring"], "Serve one trained model behind an API or notebook demo."],
      ["Portfolio and interview prep", ["case studies", "problem framing", "tradeoffs"], "Present one ML project as a business-impact story."]
    ],
    projectThemes: ["classification pipeline", "recommendation prototype", "model-serving app"],
    resourceThemes: ["Kaggle Learn", "scikit-learn docs", "TensorFlow guides", "fast.ai"],
    interviewThemes: ["bias-variance", "metric selection", "feature engineering tradeoffs"],
    faq: [{ question: "What should an AI/ML roadmap prioritize first?", answer: "Python, statistics, data handling, and solid classical ML habits should come before chasing advanced model architectures." }]
  },
  dbms: {
    signals: /(dbms|database|sql|normalization|indexing|transactions|joins)/,
    label: "DBMS preparation",
    keyTopics: ["normalization", "SQL", "joins", "transactions", "indexing", "schema design"],
    tools: ["MySQL", "PostgreSQL", "MongoDB Compass", "DB Fiddle", "Draw.io"],
    certifications: ["SQL practice tracks", "database fundamentals courses"],
    phases: [
      ["Relational foundations", ["ER models", "keys", "constraints", "schema thinking"], "Design a simple academic or ecommerce database schema."],
      ["Normalization", ["1NF", "2NF", "3NF", "BCNF"], "Normalize a denormalized table and justify each step."],
      ["SQL querying", ["SELECT", "GROUP BY", "subqueries", "aggregates"], "Write reporting queries against one dataset."],
      ["Joins and views", ["inner join", "left join", "views", "aliases"], "Build one multi-table report using joins."],
      ["Transactions and performance", ["ACID", "indexes", "locking", "concurrency"], "Explain one performance or consistency tradeoff using a real example."]
    ],
    projectThemes: ["SQL workbook", "schema design case study", "query optimization report"],
    resourceThemes: ["SQLBolt", "Mongoose or RDBMS docs", "DBMS lecture playlists", "Mode SQL tutorial"],
    interviewThemes: ["normalization viva", "query-writing rounds", "ACID explanations"],
    faq: [{ question: "What should a DBMS roadmap include?", answer: "It should cover data modeling, normalization, querying, joins, transactions, and performance basics." }]
  },
  systems: {
    signals: /(operating system|os |deadlock|paging|threads|cpu scheduling|computer networks|tcp|udp|routing|subnet)/,
    label: "systems preparation",
    keyTopics: ["processes and threads", "scheduling", "memory management", "networking basics", "concurrency"],
    tools: ["Linux shell", "network visualizers", "diagram tools", "Wireshark basics"],
    certifications: ["Core CS revision tracks", "networking or Linux fundamentals awareness"],
    phases: [
      ["OS foundations", ["processes", "threads", "context switching"], "Explain one process lifecycle with a clean diagram."],
      ["Scheduling and synchronization", ["Round Robin", "deadlocks", "mutex", "semaphore"], "Solve one scheduling or synchronization scenario manually."],
      ["Memory management", ["paging", "virtual memory", "page replacement"], "Prepare one memory management summary sheet."],
      ["Networking essentials", ["TCP vs UDP", "subnetting", "routing", "network devices"], "Trace how a packet moves across a basic network path."],
      ["Interview revision", ["short notes", "viva answers", "common traps"], "Practice concise explanations for the most repeated systems questions."]
    ],
    projectThemes: ["systems revision deck", "network troubleshooting notes", "OS concept map"],
    resourceThemes: ["Neso Academy", "MIT notes", "networking primers", "OS lecture summaries"],
    interviewThemes: ["process vs thread", "TCP vs UDP", "deadlock explanations"],
    faq: [{ question: "How should students study systems subjects?", answer: "Focus on diagrams, tradeoffs, and repeated viva-style explanation practice instead of memorizing definitions in isolation." }]
  },
  aptitude: {
    signals: /(aptitude|quantitative|reasoning|placement prep|mock test)/,
    label: "aptitude preparation",
    keyTopics: ["arithmetic", "reasoning", "data interpretation", "mock analysis", "speed and accuracy"],
    tools: ["IndiaBIX", "Google Sheets", "mock platforms", "timer apps"],
    certifications: ["No formal certification needed; prioritize mocks and score tracking."],
    phases: [
      ["Arithmetic foundation", ["percentages", "ratio", "profit and loss"], "Solve a timed arithmetic set and log your mistakes."],
      ["Number systems and algebra", ["divisibility", "LCM/HCF", "equations"], "Review shortcuts only after solving full methods cleanly."],
      ["Reasoning patterns", ["series", "blood relations", "seating arrangement"], "Practice one reasoning puzzle set daily."],
      ["Data interpretation", ["tables", "charts", "approximation"], "Solve one DI set under strict timing."],
      ["Mock test conversion", ["attempt strategy", "error review", "weak-area repair"], "Analyze one mock deeply instead of only counting score."]
    ],
    projectThemes: ["aptitude score tracker", "formula and errors notebook", "mock performance dashboard"],
    resourceThemes: ["IndiaBIX", "placement prep blogs", "YouTube shortcut lessons", "mock sets"],
    interviewThemes: ["speed vs accuracy", "reasoning approach", "mock analysis habits"],
    faq: [{ question: "How should aptitude preparation be structured?", answer: "Build arithmetic accuracy first, then reasoning, timed practice, and regular mock analysis." }]
  },
  cybersecurity: {
    signals: /(cybersecurity|ethical hacking|penetration testing|soc analyst|owasp|burp suite|ctf|red team|blue team|security)/,
    label: "cybersecurity preparation",
    keyTopics: ["networking basics", "Linux", "OWASP", "Burp Suite", "pentesting workflows", "CTFs"],
    tools: ["Kali Linux", "Burp Suite", "Nmap", "Wireshark", "TryHackMe", "OWASP ZAP"],
    certifications: ["Security+ awareness", "TryHackMe learning paths", "eJPT awareness"],
    phases: [
      ["Networking and Linux basics", ["TCP/IP", "ports", "Linux shell", "permissions"], "Trace common services and inspect ports on a lab machine."],
      ["Security fundamentals", ["CIA triad", "threat modeling", "common vulnerabilities"], "Map one web app flow and list likely attack surfaces."],
      ["Web security and OWASP", ["OWASP Top 10", "auth flaws", "input validation"], "Reproduce one safe lab vulnerability and document the fix."],
      ["Pentesting toolchain", ["Burp Suite", "Nmap", "enumeration", "recon"], "Run a controlled recon workflow against a lab target."],
      ["Defensive workflows", ["SOC basics", "logs", "incident response", "hardening"], "Create a detection checklist for suspicious web activity."],
      ["Portfolio and labs", ["CTFs", "writeups", "reporting"], "Publish a concise writeup showing methodology and remediation."]
    ],
    projectThemes: ["security audit checklist", "CTF writeup portfolio", "web app hardening case study"],
    resourceThemes: ["TryHackMe", "OWASP guides", "PortSwigger Academy", "Linux Journey"],
    interviewThemes: ["OWASP scenarios", "incident handling", "recon methodology"],
    faq: [{ question: "How should beginners start cybersecurity?", answer: "Start with networking, Linux, web security fundamentals, and structured labs before moving into advanced offensive tooling." }]
  },
  marketing: {
    signals: /(digital marketing|marketing roadmap|seo|ppc|social media marketing|content marketing|email marketing|ga4|google analytics)/,
    label: "digital marketing preparation",
    keyTopics: ["SEO", "analytics", "content strategy", "social media", "email marketing", "PPC"],
    tools: ["Google Analytics 4", "Google Search Console", "Ahrefs or free keyword tools", "Canva", "Meta Business Suite", "Mailchimp"],
    certifications: ["Google Analytics certification", "Google Ads fundamentals", "HubSpot content or email courses"],
    phases: [
      ["Marketing foundations", ["audience research", "funnel stages", "messaging", "positioning"], "Build one buyer persona and map top funnel content ideas."],
      ["SEO and content", ["keyword research", "on-page SEO", "content briefs", "search intent"], "Write one SEO brief targeting a realistic long-tail keyword."],
      ["Social and email", ["content calendars", "organic campaigns", "email sequences", "A/B testing"], "Draft a one-week campaign across email and social channels."],
      ["Paid and performance", ["PPC basics", "landing pages", "CTR", "conversion tracking"], "Review a sample ad funnel and improve the landing-page CTA."],
      ["Analytics and optimization", ["GA4", "Search Console", "dashboards", "reporting"], "Build a simple performance report with insights and next steps."],
      ["Portfolio and case studies", ["campaign retrospectives", "growth narratives", "client reporting"], "Turn a project into a portfolio case study with measurable outcomes."]
    ],
    projectThemes: ["SEO content hub", "campaign dashboard", "landing-page optimization case study"],
    resourceThemes: ["Google Skillshop", "Search Central docs", "HubSpot Academy", "Ahrefs blog"],
    interviewThemes: ["keyword strategy", "analytics interpretation", "campaign optimization"],
    faq: [{ question: "What should a digital marketing roadmap include?", answer: "SEO, analytics, content, paid channels, lifecycle marketing, and case-study style optimization work should all be present." }]
  },
  finance: {
    signals: /(finance|financial analyst|investment|equity research|valuation|financial modeling|accounting)/,
    label: "finance preparation",
    keyTopics: ["accounting basics", "financial statements", "valuation", "Excel modeling", "market research"],
    tools: ["Excel", "Google Sheets", "TradingView", "Screener", "PowerPoint"],
    certifications: ["CFA awareness", "financial modeling courses", "Bloomberg market concepts awareness"],
    phases: [
      ["Accounting and statement literacy", ["income statement", "balance sheet", "cash flow"], "Read one annual report section and summarize the story."],
      ["Excel and modeling basics", ["formulas", "assumptions", "scenario analysis"], "Build a simple three-statement or ratio model."],
      ["Valuation thinking", ["DCF basics", "comparables", "unit economics"], "Compare two companies using a structured template."],
      ["Markets and research", ["sectors", "macro drivers", "earnings narratives"], "Write a short equity or market note with a clear thesis."],
      ["Presentation and communication", ["investment memo", "charts", "decision framing"], "Present one recommendation with risks and assumptions."],
      ["Interview and case prep", ["technical finance questions", "behavioral stories", "case rounds"], "Practice walking through valuation logic out loud."]
    ],
    projectThemes: ["company analysis deck", "valuation workbook", "personal finance dashboard"],
    resourceThemes: ["Investopedia", "annual reports", "Aswath Damodaran resources", "free Excel modeling tutorials"],
    interviewThemes: ["statement links", "valuation logic", "market reasoning"],
    faq: [{ question: "How should a finance roadmap be structured?", answer: "Begin with statements and Excel, then move into valuation, market analysis, and communication-heavy case preparation." }]
  },
  design: {
    signals: /(ui\/ux|ux design|ui design|product design|graphic design|motion design|video editing|brand design|figma)/,
    label: "design preparation",
    keyTopics: ["design principles", "user research", "wireframes", "prototyping", "visual systems", "portfolio"],
    tools: ["Figma", "FigJam", "Adobe Creative Cloud", "Canva", "Notion"],
    certifications: ["Google UX certificate awareness", "Figma learning paths"],
    phases: [
      ["Design foundations", ["typography", "color", "layout", "hierarchy"], "Audit one interface and explain what works visually."],
      ["Research and problem framing", ["user personas", "journey mapping", "pain points"], "Interview a user or simulate a usability study and summarize findings."],
      ["Wireframes and interaction flows", ["low-fi wireframes", "navigation flows", "content hierarchy"], "Create a wireflow for a product feature from scratch."],
      ["Visual design and systems", ["components", "spacing systems", "states", "responsive behavior"], "Turn one flow into a polished, consistent design system mockup."],
      ["Testing and iteration", ["usability review", "feedback synthesis", "iteration"], "Revise a design after collecting critique."],
      ["Portfolio and storytelling", ["case studies", "presentation", "rationale"], "Build a case study that explains problem, process, and outcome clearly."]
    ],
    projectThemes: ["mobile app redesign", "design system starter", "UX case study"],
    resourceThemes: ["Figma docs", "Nielsen Norman Group", "Material design guidance", "Awwwards inspiration"],
    interviewThemes: ["research decisions", "tradeoff rationale", "portfolio storytelling"],
    faq: [{ question: "What makes a design roadmap feel portfolio-ready?", answer: "It should combine design fundamentals, research, practical mockups, critique loops, and strong case-study storytelling." }]
  },
  cloud: {
    signals: /(cloud computing|aws|azure|gcp|cloud engineer|serverless|cloud architecture)/,
    label: "cloud computing preparation",
    keyTopics: ["cloud fundamentals", "compute", "storage", "networking", "IAM", "deployment"],
    tools: ["AWS Console", "Azure Portal", "GCP Console", "Terraform awareness", "Docker"],
    certifications: ["AWS Cloud Practitioner", "Azure Fundamentals", "GCP Cloud Digital Leader"],
    phases: [
      ["Cloud basics", ["shared responsibility", "regions and zones", "core services"], "Map a simple app to compute, storage, and network services."],
      ["Compute and storage", ["VMs", "object storage", "databases", "serverless"], "Deploy a small app using one managed compute option."],
      ["Identity and networking", ["IAM", "security groups", "VPC concepts", "DNS"], "Review access and network boundaries for a sample architecture."],
      ["Deployment workflows", ["CI/CD", "environment variables", "infrastructure basics"], "Automate one build or deployment step."],
      ["Monitoring and cost awareness", ["logs", "metrics", "billing", "alerts"], "Create a cost-conscious architecture note for a student project."],
      ["Architecture and certification prep", ["reference architectures", "tradeoffs", "exam-style scenarios"], "Explain how you would scale or secure one cloud workload."]
    ],
    projectThemes: ["cloud-hosted web app", "serverless API", "cloud architecture case study"],
    resourceThemes: ["AWS skill builder", "Azure Learn", "GCP training", "official docs"],
    interviewThemes: ["service tradeoffs", "IAM basics", "deployment patterns"],
    faq: [{ question: "What should a cloud roadmap cover first?", answer: "Understand compute, storage, identity, and networking before going deeper into architecture or platform specialization." }]
  },
  blockchain: {
    signals: /(blockchain|web3|smart contract|solidity|ethereum|defi|nft)/,
    label: "blockchain development preparation",
    keyTopics: ["distributed ledgers", "smart contracts", "Solidity", "wallets", "security", "dApps"],
    tools: ["Solidity", "Remix", "Hardhat", "MetaMask", "Ethers.js"],
    certifications: ["Solidity bootcamp or official learning paths"],
    phases: [
      ["Blockchain foundations", ["distributed systems", "consensus basics", "wallets", "transactions"], "Explain one transaction lifecycle from wallet to chain confirmation."],
      ["Smart contract basics", ["Solidity syntax", "state variables", "functions", "events"], "Build and test a simple contract in Remix or Hardhat."],
      ["Security and testing", ["reentrancy", "access control", "gas awareness"], "Review one contract for common vulnerabilities and document fixes."],
      ["dApp integration", ["wallet connection", "frontend integration", "contract reads and writes"], "Connect a simple UI to one deployed contract."],
      ["Token and protocol concepts", ["ERC standards", "DeFi patterns", "governance basics"], "Model a simple token use case and justify the standard chosen."],
      ["Portfolio and interviews", ["audit summaries", "build logs", "tradeoffs"], "Turn your contract project into a clear technical walkthrough."]
    ],
    projectThemes: ["simple token dApp", "voting contract", "wallet-connected dashboard"],
    resourceThemes: ["Solidity docs", "OpenZeppelin guides", "Ethernaut", "Hardhat docs"],
    interviewThemes: ["contract security", "gas tradeoffs", "dApp architecture"],
    faq: [{ question: "What should a blockchain roadmap include?", answer: "It should cover blockchain basics, Solidity, smart contract security, testing, and dApp integration." }]
  },
  "data-science": {
    signals: /(data science|data analyst|analytics roadmap|tableau|power bi|statistics|sql analytics)/,
    label: "data science and analytics preparation",
    keyTopics: ["SQL", "statistics", "Python", "data visualization", "dashboards", "experimentation"],
    tools: ["Python", "SQL", "Jupyter Notebook", "Tableau", "Power BI", "Pandas"],
    certifications: ["Google Data Analytics awareness", "Tableau learning paths"],
    phases: [
      ["Data fundamentals", ["spreadsheet skills", "SQL basics", "descriptive statistics"], "Clean and summarize one small dataset."],
      ["Python and analysis", ["Pandas", "EDA", "visualization", "feature summaries"], "Create an analysis notebook with charts and observations."],
      ["Dashboarding and storytelling", ["Tableau or Power BI", "KPIs", "executive communication"], "Build a dashboard that tells a clear business story."],
      ["Experimentation and metrics", ["A/B testing", "cohorts", "retention", "funnels"], "Interpret one sample experiment or funnel dataset."],
      ["Project specialization", ["domain analysis", "forecasting basics", "segmentation"], "Frame a problem using data, assumptions, and measurable outcomes."],
      ["Interview readiness", ["case questions", "SQL rounds", "portfolio explanation"], "Practice explaining one project to a hiring manager and analyst interviewer."]
    ],
    projectThemes: ["analytics dashboard", "EDA case study", "SQL reporting pack"],
    resourceThemes: ["Kaggle", "Mode SQL tutorial", "Tableau public guides", "free analytics blogs"],
    interviewThemes: ["SQL querying", "metric interpretation", "business communication"],
    faq: [{ question: "What should a data science roadmap include?", answer: "Strong SQL, statistics, Python analysis, dashboards, and business communication are foundational before deeper specialization." }]
  },
  mechanical: {
    signals: /(mechanical engineering|cad|thermodynamics|manufacturing|machine design|solidworks)/,
    label: "mechanical engineering preparation",
    keyTopics: ["engineering drawing", "mechanics", "thermodynamics", "CAD", "manufacturing", "design projects"],
    tools: ["SolidWorks", "AutoCAD", "ANSYS awareness", "Excel", "MATLAB awareness"],
    certifications: ["CAD training paths", "industry design software certifications"],
    phases: [
      ["Engineering fundamentals", ["mechanics", "materials", "drawing interpretation"], "Summarize core formulas and engineering assumptions for one topic."],
      ["Design and CAD workflows", ["CAD modeling", "tolerances", "assemblies"], "Model one part or assembly and explain the design intent."],
      ["Thermal and manufacturing concepts", ["thermodynamics", "heat transfer", "manufacturing processes"], "Compare two manufacturing methods for one part."],
      ["Analysis and optimization", ["stress basics", "failure points", "cost/design tradeoffs"], "Review a component for weight, strength, and manufacturability."],
      ["Project work", ["design reports", "prototyping", "documentation"], "Document one engineering project from problem to iteration."],
      ["Interview and career prep", ["core viva", "GATE-style revision", "industry applications"], "Practice explaining one mechanical system clearly with diagrams."]
    ],
    projectThemes: ["CAD assembly project", "manufacturing case study", "mechanical design report"],
    resourceThemes: ["NPTEL lectures", "MIT OpenCourseWare", "CAD tutorials", "engineering handbooks"],
    interviewThemes: ["core subject viva", "design rationale", "manufacturing tradeoffs"],
    faq: [{ question: "How should a mechanical engineering roadmap be structured?", answer: "Combine core theory, CAD practice, design reasoning, manufacturing understanding, and strong project documentation." }]
  },
  programming: {
    signals: /(programming|python|java|c\+\+|c#|go roadmap|rust roadmap|coding roadmap)/,
    label: "programming skill development",
    keyTopics: ["syntax and control flow", "data structures", "problem solving", "debugging", "projects"],
    tools: ["VS Code", "Git", "GitHub", "online judges", "language REPLs"],
    certifications: ["Language-specific learning paths", "coding challenge tracks"],
    phases: [
      ["Language fundamentals", ["syntax", "functions", "control flow", "basic debugging"], "Solve small exercises and rewrite one solution more cleanly."],
      ["Data structures and patterns", ["arrays", "maps", "strings", "object-oriented basics"], "Practice common logic patterns in your chosen language."],
      ["File, API, or library usage", ["modules", "packages", "I/O", "API calls"], "Build a simple utility or command-line tool."],
      ["Testing and quality", ["unit tests", "error handling", "refactoring"], "Add tests and improve reliability in a small project."],
      ["Applied projects", ["automation", "web basics", "data workflows"], "Ship one useful project using the language ecosystem."],
      ["Interview and portfolio", ["problem solving", "project explanation", "tradeoffs"], "Prepare a GitHub repo that shows code quality and learning progression."]
    ],
    projectThemes: ["CLI productivity tool", "API consumer app", "automation script pack"],
    resourceThemes: ["official docs", "language tutorials", "practice platforms", "community guides"],
    interviewThemes: ["language concepts", "data structures", "debugging stories"],
    faq: [{ question: "What should a programming roadmap prioritize?", answer: "Focus on language fluency, problem solving, debugging habits, small projects, and code quality instead of only syntax memorization." }]
  },
  general: {
    signals: /.*/,
    label: "technical learning roadmap",
    keyTopics: ["foundations", "hands-on practice", "projects", "interview preparation"],
    tools: ["VS Code", "GitHub", "Notion", "Google Docs"],
    certifications: ["Choose optional certifications only after building core skills."],
    phases: [
      ["Foundations", ["core concepts", "vocabulary", "use cases"], "Write a plain-English summary of what this topic solves."],
      ["Hands-on practice", ["setup", "basic workflows", "small exercises"], "Build a small working demo tied to the topic."],
      ["Intermediate application", ["patterns", "tradeoffs", "debugging"], "Refactor the first version and document improvements."],
      ["Career-facing polish", ["projects", "portfolio notes", "interview framing"], "Explain the topic through one polished project or case study."]
    ],
    projectThemes: ["starter case study", "mini working demo", "resume-ready capstone"],
    resourceThemes: ["official docs", "beginner-friendly guides", "free community resources"],
    interviewThemes: ["concept explanations", "project communication", "tradeoff discussion"],
    faq: [{ question: "How do I make a roadmap for a new topic?", answer: "Break the topic into foundations, practice, applied work, and communication-ready outcomes instead of learning isolated theory." }]
  }
};

const inferDifficulty = (goal) => {
  const normalized = goal.toLowerCase();

  if (/(beginner|beginners|starter|basics|foundation|fresher)/.test(normalized)) return "beginner";
  if (/(advanced|senior|expert|architect)/.test(normalized)) return "advanced";
  return "intermediate";
};

const analyzeRoadmapGoal = (goal) => {
  const normalized = goal.toLowerCase();
  const orderedCategories = [
    "sde",
    "frontend",
    "backend",
    "devops",
    "cloud",
    "aiml",
    "data-science",
    "cybersecurity",
    "marketing",
    "finance",
    "design",
    "blockchain",
    "dbms",
    "systems",
    "mechanical",
    "aptitude",
    "programming"
  ];

  const matched = orderedCategories.find((category) => domainProfiles[category].signals.test(normalized));
  return matched || "general";
};

const categoryPriorityTopics = {
  sde: ["DSA", "core CS fundamentals", "system design", "backend APIs", "Git and GitHub", "mock interviews"],
  frontend: ["HTML, CSS, JavaScript", "React", "accessibility", "performance optimization", "deployment"],
  backend: ["Node.js", "Express", "databases", "authentication", "testing", "deployment"],
  dbms: ["normalization", "SQL", "joins", "transactions", "indexing"],
  systems: ["processes", "threads", "scheduling", "deadlocks", "memory management"],
  devops: ["Linux", "Docker", "CI/CD", "cloud deployment", "monitoring"],
  aiml: ["Python", "data preprocessing", "classical ML", "deep learning", "model deployment"],
  cybersecurity: ["networking", "Linux", "OWASP", "reconnaissance", "lab practice", "security reporting"],
  marketing: ["SEO", "keyword research", "analytics", "content strategy", "social media", "campaign optimization"],
  finance: ["financial statements", "Excel modeling", "valuation", "market research", "presentation skills"],
  design: ["typography", "user research", "wireframing", "prototyping", "design systems", "case studies"],
  cloud: ["compute", "storage", "IAM", "networking", "deployment", "cost awareness"],
  blockchain: ["smart contracts", "wallets", "Solidity", "security", "dApp integration"],
  "data-science": ["SQL", "statistics", "Python analysis", "dashboards", "experimentation"],
  mechanical: ["mechanics", "CAD", "thermodynamics", "manufacturing", "design documentation"],
  programming: ["language fluency", "data structures", "debugging", "projects", "testing"],
  aptitude: ["arithmetic", "reasoning", "mock tests", "accuracy analysis"],
  general: ["foundations", "hands-on practice", "projects", "interview preparation"]
};

const getRoadmapTools = (category) => domainProfiles[category]?.tools || domainProfiles.general.tools;

const buildInterviewPrepSummary = (weeks) =>
  [...new Set((weeks || []).flatMap((week) => week.interviewPrep || []))].slice(0, 10);

const buildResourcesSummary = (weeks) =>
  [...new Set((weeks || []).flatMap((week) => week.resources || []))].slice(0, 10);

const buildProjectsSummary = (weeks) =>
  [...new Set((weeks || []).map((week) => week.project).filter(Boolean))].slice(0, 8);

const uniqueList = (items, limit = 12) => [...new Set((items || []).filter(Boolean))].slice(0, limit);

const buildDynamicWeeksFromProfile = ({ profile, durationWeeks, goal }) => {
  const phases = profile?.phases?.length ? profile.phases : domainProfiles.general.phases;
  const count = Math.max(2, Math.min(durationWeeks, 16));

  return Array.from({ length: count }, (_, index) => {
    const [focus, topics, exercisePrompt] = phases[index % phases.length];
    const weekTopics = uniqueList([
      ...topics,
      profile.keyTopics[index % profile.keyTopics.length],
      goal.toLowerCase().includes("beginner") ? "beginner-friendly practice" : null
    ], 5);
    const projectTheme = profile.projectThemes[index % profile.projectThemes.length];
    const resources = uniqueList([
      profile.resourceThemes[index % profile.resourceThemes.length],
      profile.resourceThemes[(index + 1) % profile.resourceThemes.length],
      "official documentation or high-quality free learning material"
    ], 3);
    const interviewPrep = uniqueList([
      profile.interviewThemes[index % profile.interviewThemes.length],
      `Explain ${weekTopics[0]} with a real-world example`,
      `Prepare one concise story around ${focus.toLowerCase()}`
    ], 3);

    return {
      week: index + 1,
      focus,
      topics: weekTopics,
      exercises: [
        exercisePrompt,
        `Document one lesson learned while practicing ${weekTopics[0]}.`
      ],
      project: `${projectTheme} focused on ${goal}`,
      resources,
      interviewPrep,
      revisionCheckpoint: `Review ${focus.toLowerCase()} and summarize the most important tradeoffs, tools, and mistakes you discovered.`
    };
  });
};

const normalizeRoadmapResult = (roadmap, category, goal) => ({
  ...roadmap,
  category,
  difficulty: roadmap.difficulty || inferDifficulty(goal),
  slug: roadmap.slug || slugify(goal),
  weeks: (roadmap.weeks || []).map((week, index) => ({
    week: typeof week.week === "number" ? week.week : index + 1,
    ...week
  })),
  milestones: roadmap.milestones?.length ? roadmap.milestones : (roadmap.weeks || []).map((week) => week.focus).slice(0, 12),
  topics: roadmap.topics?.length ? roadmap.topics : uniqueList((roadmap.weeks || []).flatMap((week) => week.topics || []), 18),
  subtopics: roadmap.subtopics?.length
    ? roadmap.subtopics
    : uniqueList((roadmap.weeks || []).flatMap((week) => [...(week.topics || []), ...(week.exercises || [])]), 24),
  tools: roadmap.tools?.length ? roadmap.tools : getRoadmapTools(category),
  projects: roadmap.projects?.length ? roadmap.projects : buildProjectsSummary(roadmap.weeks),
  resources: roadmap.resources?.length ? roadmap.resources : buildResourcesSummary(roadmap.weeks),
  interviewPrep: roadmap.interviewPrep?.length ? roadmap.interviewPrep : buildInterviewPrepSummary(roadmap.weeks),
  certifications: roadmap.certifications?.length ? roadmap.certifications : domainProfiles[category]?.certifications || domainProfiles.general.certifications
});

const buildVivaTopicHints = (subject, topic) => {
  const hintedItems = resolveVivaItemsForTopic(subject, topic).slice(0, 5);
  return hintedItems.map((item) => item.question.replace(/\?$/, "")).join(", ");
};

const buildGenericSeoKeywords = (goal, category) =>
  uniqueList([
    goal.toLowerCase(),
    `${goal.toLowerCase()} for beginners`,
    `${domainProfiles[category]?.label || "career"} roadmap`,
    `${goal.toLowerCase()} interview preparation`,
    `${goal.toLowerCase()} learning path`
  ], 5);

const buildGenericInternalLinks = (category) => {
  const categoryLinks = {
    sde: ["/how-to-prepare-for-technical-viva", "/dbms-viva-questions-for-beginners", "/frontend-roadmap-for-beginners"],
    frontend: ["/frontend-roadmap-for-beginners", "/how-to-prepare-for-technical-viva"],
    backend: ["/dbms-viva-questions-for-beginners", "/how-to-prepare-for-technical-viva"],
    cybersecurity: ["/how-to-prepare-for-technical-viva"],
    marketing: ["/frontend-roadmap-for-beginners"],
    cloud: ["/frontend-roadmap-for-beginners"],
    general: ["/how-to-prepare-for-technical-viva", "/frontend-roadmap-for-beginners"]
  };

  return categoryLinks[category] || categoryLinks.general;
};

const inferVivaCategory = (subject, topic) => {
  if (subject && subject !== "general") {
    if (subject === "cn") return "systems";
    if (subject === "os") return "systems";
    return subject;
  }

  return analyzeRoadmapGoal(topic || "general topic");
};

const buildGenericVivaItems = (category, topic, level) => {
  const profile = domainProfiles[category] || domainProfiles.general;
  const themes = uniqueList([...profile.keyTopics, ...profile.interviewThemes], 5);

  return themes.map((theme, index) => ({
    id: `${category}-${index + 1}`,
    question: `How would you explain ${theme} in the context of ${topic}?`,
    answer: `${theme} is important in ${topic} because it shapes how a learner or practitioner understands the core workflow, practical constraints, and real-world application of the domain.`,
    followUp: `What is one common beginner mistake people make with ${theme}?`,
    example: `A realistic ${topic} example should show how ${theme} affects decisions, tools, or outcomes in an actual project or workflow.`,
    interviewAngle: `This question checks whether you can discuss ${topic} beyond definitions and connect ${theme} to practical execution.`,
    difficulty: level
  }));
};

const resolveVivaItemsForTopic = (subject, topic) => {
  const blueprint = vivaBlueprints[subject] || vivaBlueprints.dbms;
  const normalizedTopic = topic.toLowerCase();

  if (subject === "dbms" && /join|sql/.test(normalizedTopic)) {
    return [
      {
        question: "What is a SQL join and why is it used?",
        answer: "A SQL join combines rows from multiple tables using a related column so data stored separately can be queried together.",
        followUp: "When would you prefer a left join over an inner join?",
        example: "A students table can be joined with a marks table using student_id to show names with scores.",
        interviewAngle: "This question checks if you understand why relational tables become useful together."
      },
      {
        question: "What is the difference between INNER JOIN and LEFT JOIN?",
        answer: "INNER JOIN returns only matching rows from both tables, while LEFT JOIN keeps all rows from the left table and fills missing matches with NULL.",
        followUp: "What happens if the right table has no matching row in a left join?",
        example: "If one student has no marks yet, a left join still shows the student while an inner join removes that row.",
        interviewAngle: "Interviewers use this to test practical SQL reporting knowledge."
      },
      {
        question: "Why can joins produce duplicate-looking results?",
        answer: "Joins can multiply rows when one record matches multiple related rows in another table, which is expected in one-to-many relationships.",
        followUp: "How would you inspect whether duplication is a data issue or a query issue?",
        example: "One student linked to three course rows will appear three times after the join if the result includes course details.",
        interviewAngle: "This reveals whether you understand relational cardinality."
      },
      {
        question: "What is a self join?",
        answer: "A self join joins a table with itself so you can compare rows within the same dataset.",
        followUp: "Where is a self join useful in real databases?",
        example: "An employee table can self join on manager_id to show employee-manager relationships.",
        interviewAngle: "This helps assess whether you can move beyond basic join types."
      },
      {
        question: "How do indexes affect join performance?",
        answer: "Indexes can speed up joins when the joined columns are indexed, especially on foreign key and lookup columns.",
        followUp: "Why can too many indexes still become a problem?",
        example: "Joining orders to customers becomes faster when customer_id is indexed appropriately.",
        interviewAngle: "This links query-writing knowledge with database performance thinking."
      }
    ];
  }

  if (subject === "dbms" && /index/.test(normalizedTopic)) {
    return [
      {
        question: "What is an index in DBMS?",
        answer: "An index is a data structure that improves query speed by helping the database find rows faster without scanning the entire table.",
        followUp: "Why do indexes speed up reads but slow down writes?",
        example: "A student search by roll number becomes much faster when roll_number is indexed.",
        interviewAngle: "This tests whether you understand performance tradeoffs, not just definitions."
      },
      {
        question: "What is the difference between clustered and non-clustered indexes?",
        answer: "A clustered index changes the physical ordering of data around the indexed key, while a non-clustered index stores a separate structure pointing to table rows.",
        followUp: "Why can a table typically have only one clustered index?",
        example: "A table sorted physically by roll number can use that key as its clustered organization.",
        interviewAngle: "Interviewers ask this to judge your depth in query performance topics."
      },
      {
        question: "When should you avoid adding more indexes?",
        answer: "Avoid excessive indexes when write performance matters heavily or when indexed columns are not frequently searched.",
        followUp: "How would you decide whether an index is worth its maintenance cost?",
        example: "A high-write attendance table may suffer if every small reporting field is indexed.",
        interviewAngle: "Good answers mention workload patterns instead of claiming indexes are always good."
      },
      {
        question: "How do composite indexes work?",
        answer: "Composite indexes cover multiple columns in a specific order and help queries that filter or sort using that indexed sequence.",
        followUp: "Why does column order matter in a composite index?",
        example: "An index on department_id and year helps department-year filtered reports more than the reverse in some workloads.",
        interviewAngle: "This checks practical indexing knowledge rather than surface familiarity."
      },
      {
        question: "How can you tell a query needs indexing help?",
        answer: "Slow filters, repeated full scans, and poor response times on frequently searched columns often signal indexing gaps.",
        followUp: "Would you index every column used in WHERE?",
        example: "A course search endpoint getting slower as records grow may need a focused index review.",
        interviewAngle: "This connects database theory with production troubleshooting."
      }
    ];
  }

  if (subject === "dbms" && /transaction|acid/.test(normalizedTopic)) {
    return [
      {
        question: "What is a transaction in DBMS?",
        answer: "A transaction is a group of database operations treated as one logical unit that either completes fully or fails safely.",
        followUp: "Why is a transaction important in financial systems?",
        example: "A bank transfer should update both debit and credit steps together rather than leaving half-complete data.",
        interviewAngle: "This checks whether you understand consistency in real applications."
      },
      {
        question: "What does atomicity mean?",
        answer: "Atomicity means all steps in a transaction happen completely or none of them happen at all.",
        followUp: "What mechanism usually supports rollback when atomicity breaks?",
        example: "If seat booking fails after payment deduction starts, rollback should prevent partial updates.",
        interviewAngle: "Interviewers want both definition and application clarity here."
      },
      {
        question: "How is isolation different from consistency?",
        answer: "Isolation controls how concurrent transactions interact, while consistency ensures data rules remain valid before and after a transaction.",
        followUp: "Can a system preserve consistency but still suffer from poor isolation?",
        example: "Two users editing inventory at the same time can expose isolation issues even if final data rules are valid.",
        interviewAngle: "This tests conceptual precision in ACID discussions."
      },
      {
        question: "What is a dirty read?",
        answer: "A dirty read happens when one transaction reads data written by another transaction that has not been committed yet.",
        followUp: "Why is a dirty read dangerous in production systems?",
        example: "A dashboard showing stock levels from an uncommitted order update can mislead downstream actions.",
        interviewAngle: "Concurrency anomalies are common follow-up topics in interviews."
      },
      {
        question: "Why can strict transaction handling reduce performance?",
        answer: "Higher isolation and stricter locking can slow throughput because transactions may wait longer for safe access.",
        followUp: "How do engineers balance consistency and throughput in real systems?",
        example: "High-traffic booking systems often tune transaction strategies carefully to avoid conflicts without corrupting data.",
        interviewAngle: "This shows whether you can discuss tradeoffs rather than only theory."
      }
    ];
  }

  if (subject === "oops" && /inheritance|polymorphism|abstraction|encapsulation/.test(normalizedTopic)) {
    return blueprint.items;
  }

  if (subject === "cn" && /subnet|routing|router|switch/.test(normalizedTopic)) {
    return [
      {
        question: "What is subnetting and why is it used?",
        answer: "Subnetting divides a larger network into smaller logical networks for better organization, security, and address efficiency.",
        followUp: "How does subnetting help reduce address waste?",
        example: "A campus can separate labs, hostel devices, and admin systems into different subnets.",
        interviewAngle: "This checks whether you understand network planning, not just notation."
      },
      {
        question: "What is the role of a router?",
        answer: "A router forwards packets between different networks and helps determine paths for traffic.",
        followUp: "How does a router differ from a switch in practical use?",
        example: "A router connects a college LAN to the internet while switches connect devices within the LAN.",
        interviewAngle: "Interviewers ask this to test real networking intuition."
      },
      {
        question: "What is routing?",
        answer: "Routing is the process of selecting paths for network traffic between source and destination networks.",
        followUp: "Why do dynamic routing protocols matter in larger networks?",
        example: "Traffic between different departments or remote branches depends on routing decisions.",
        interviewAngle: "A clean answer shows you understand network movement beyond local switching."
      },
      {
        question: "Why is a default gateway important?",
        answer: "A default gateway is the route a host uses to reach destinations outside its local network.",
        followUp: "What happens if the default gateway is misconfigured?",
        example: "A student device may access local machines but fail to reach internet services if the gateway is wrong.",
        interviewAngle: "This links theory with common troubleshooting cases."
      },
      {
        question: "How do routers and subnets support security boundaries?",
        answer: "They help separate traffic domains so policies and access controls can be applied more cleanly across network segments.",
        followUp: "Why would a college isolate admin traffic from guest Wi-Fi?",
        example: "Sensitive administrative systems should not sit on the same unrestricted network as public devices.",
        interviewAngle: "This shows whether you can connect architecture to operational concerns."
      }
    ];
  }

  if (subject === "os" && /deadlock|paging|memory|thread|process/.test(normalizedTopic)) {
    return blueprint.items;
  }

  return blueprint.items;
};

const extractJson = (value) => {
  const jsonFence = value.match(/```json\s*([\s\S]*?)```/i) || value.match(/```([\s\S]*?)```/i);
  return jsonFence ? jsonFence[1].trim() : value.trim();
};

const safeJsonParse = (value) => {
  try {
    return JSON.parse(extractJson(value));
  } catch {
    return null;
  }
};

const hasDatabase = () => mongoose.connection.readyState === 1;

const buildCacheKey = (type, input) =>
  createHash("sha256")
    .update(JSON.stringify({ type, input }))
    .digest("hex");

const getCachedGeneration = async (cacheKey) => {
  if (!hasDatabase()) {
    return null;
  }

  return AIGenerationCache.findOne({ cacheKey }).lean();
};

const saveCachedGeneration = async ({ cacheKey, type, input, response, provider, model, status, lastError = "" }) => {
  if (!hasDatabase()) {
    return;
  }

  await AIGenerationCache.findOneAndUpdate(
    { cacheKey },
    {
      cacheKey,
      type,
      input,
      response,
      provider,
      model,
      status,
      lastError
    },
    { new: true, upsert: true }
  );
};

const fetchOpenRouterResponse = async ({ model, systemPrompt, userPrompt, requestId }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  logger.info("AI request start", {
    requestId,
    provider: "openrouter",
    model,
    timeoutMs: AI_TIMEOUT_MS
  });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.openrouterApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0.8,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      }),
      signal: controller.signal
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.error?.message || `OpenRouter request failed with status ${response.status}`);
    }

    const content = payload?.choices?.[0]?.message?.content?.trim() || "";

    logger.info("AI request success", {
      requestId,
      provider: "openrouter",
      model
    });

    return content;
  } catch (error) {
    logger.error("AI request failure", {
      requestId,
      provider: "openrouter",
      model,
      error: error.name === "AbortError" ? "Request timed out" : error.message
    });
    throw error.name === "AbortError" ? new Error("AI request timed out") : error;
  } finally {
    clearTimeout(timeout);
  }
};

const callOpenRouter = async ({ systemPrompt, userPrompt, requestId }) => {
  if (!hasOpenRouter) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  let lastError;

  for (const model of env.openrouterModels) {
    for (let attempt = 1; attempt <= AI_RETRY_COUNT + 1; attempt += 1) {
      try {
        const content = await fetchOpenRouterResponse({
          model,
          systemPrompt,
          userPrompt,
          requestId
        });

        return {
          content,
          model
        };
      } catch (error) {
        lastError = error;
        logger.warn("AI model attempt failed", {
          requestId,
          model,
          attempt,
          retryLimit: AI_RETRY_COUNT + 1,
          error: error.message
        });
      }
    }
  }

  throw lastError || new Error("All configured OpenRouter models failed.");
};

const buildRoadmapPrompt = ({ goal, durationWeeks, category }) => {
  const blueprint = roadmapBlueprints[category] || null;
  const priorityTopics = categoryPriorityTopics[category] || categoryPriorityTopics.general;
  const seoAngles = blueprint?.longTail || buildGenericSeoKeywords(goal, category);
  const internalLinks = blueprint?.internalLinks || buildGenericInternalLinks(category);

  return {
    systemPrompt: `You are an elite learning architect, SEO strategist, and technical mentor generating production-grade roadmap content for a premium AI education SaaS product.
Rules:
- Return only valid JSON.
- Do not use placeholders or generic filler.
- Every week must feel specific to the goal and different from the others.
- Use real technologies, concrete exercises, believable projects, and interview-oriented preparation.
- The roadmap must feel useful enough for a recruiter, student, and SEO reader at the same time.
- Avoid repeating wording across weeks.
- Prefer educational depth over empty motivational language.`,
    userPrompt: `Create a ${durationWeeks}-week roadmap for "${goal}".
Detected category: ${category}
Category-specific topics that must meaningfully appear across the roadmap: ${priorityTopics.join(", ")}
SEO angles to consider: ${seoAngles.join(", ")}
Internal link suggestions to consider: ${internalLinks.join(", ")}

Return JSON in this exact shape:
{
  "title": "string",
  "description": "string",
  "category": "${category}",
  "difficulty": "beginner | intermediate | advanced",
  "slug": "string",
  "seoTitle": "string",
  "seoDescription": "string",
  "seoKeywords": ["string"],
  "internalLinks": ["string"],
  "overview": ["string"],
  "milestones": ["string"],
  "topics": ["string"],
  "subtopics": ["string"],
  "tools": ["string"],
  "projects": ["string"],
  "resources": ["string"],
  "interviewPrep": ["string"],
  "certifications": ["string"],
  "portfolioIdeas": ["string"],
  "faq": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "weeks": [
    {
      "week": 1,
      "focus": "string",
      "topics": ["string"],
      "exercises": ["string"],
      "project": "string",
      "resources": ["string"],
      "interviewPrep": ["string"],
      "revisionCheckpoint": "string"
    }
  ]
}

Requirements:
- Use a realistic beginner-to-stronger progression.
- Each week must contain topic-specific technologies and tasks.
- Make the roadmap clearly specific to this topic and category, not a generic full-stack plan.
- Projects must match the entered goal.
- Include realistic tools, coding platforms, or workflows used in this track.
- Include high-signal milestones, topics, and subtopics that a real mentor would mention for this domain.
- If the topic is non-software, adapt the roadmap to that industry instead of forcing developer content.
- Resources should be free or easy to access.
- FAQ should target informational long-tail search intent.
- Slug must be clean, lowercase, and SEO-friendly.`
  };
};

const buildVivaPrompt = ({ subject, topic, level }) => {
  const category = inferVivaCategory(subject, topic);
  const blueprint = vivaBlueprints[subject] || null;
  const resolvedTopic = topic?.trim() || blueprint?.defaultTopic || subjectLabels[category] || "general topic";
  const topicHints = blueprint ? buildVivaTopicHints(subject, resolvedTopic) : (domainProfiles[category]?.keyTopics || domainProfiles.general.keyTopics).join(", ");
  const seoAngles = blueprint?.longTail || buildGenericSeoKeywords(`${resolvedTopic} viva`, category);
  const internalLinks = blueprint?.internalLinks || buildGenericInternalLinks(category);

  return {
    systemPrompt: `You are an expert viva coach, interviewer, and SEO writer creating premium technical preparation content.
Rules:
- Return only valid JSON.
- Questions must be topic-specific and not generic.
- Answers must be concise but useful.
- Include practical examples, follow-up prompts, and interview framing.
- Avoid repeating sentence structure across items.`,
    userPrompt: `Generate a ${level} viva pack for subject "${subjectLabels[subject] || subject}" focused on "${resolvedTopic}".
Topic cues that should strongly influence question selection: ${topicHints}
Detected category: ${category}
SEO angles to consider: ${seoAngles.join(", ")}
Internal link suggestions to consider: ${internalLinks.join(", ")}

Return JSON in this exact shape:
{
  "title": "string",
  "description": "string",
  "slug": "string",
  "seoTitle": "string",
  "seoDescription": "string",
  "seoKeywords": ["string"],
  "internalLinks": ["string"],
  "faq": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "items": [
    {
      "id": "string",
      "question": "string",
      "answer": "string",
      "followUp": "string",
      "example": "string",
      "interviewAngle": "string",
      "difficulty": "${level}"
    }
  ]
}

Requirements:
- Generate 5 to 7 questions.
- Keep the content tightly focused on the requested topic.
- Use realistic oral-exam wording.
- Slug must be SEO-friendly and topic-specific.
- FAQ should target informational search intent.`
  };
};

const buildFallbackRoadmap = ({ goal = "frontend roadmap for beginners", durationWeeks = 8 }) => {
  const category = analyzeRoadmapGoal(goal);
  const profile = domainProfiles[category] || domainProfiles.general;
  const blueprint = roadmapBlueprints[category];
  const weeks = blueprint
    ? blueprint.weeks.slice(0, Math.max(2, Math.min(durationWeeks, blueprint.weeks.length)))
    : buildDynamicWeeksFromProfile({ profile, durationWeeks, goal });
  const seoKeywords = blueprint?.longTail || buildGenericSeoKeywords(goal, category);
  const internalLinks = blueprint?.internalLinks || buildGenericInternalLinks(category);
  const faq = blueprint?.faq || profile.faq;

  return normalizeRoadmapResult({
    title: `${goal.charAt(0).toUpperCase()}${goal.slice(1)} Roadmap`,
    description: `A practical ${weeks.length}-week roadmap for ${goal} with realistic progression, mini-projects, resources, and interview preparation.`,
    slug: slugify(goal),
    category,
    difficulty: inferDifficulty(goal),
    seoTitle: `${goal} roadmap with projects and interview prep`,
    seoDescription: `Follow a realistic ${goal} roadmap with weekly milestones, mini-projects, free resources, revision checkpoints, and placement-oriented preparation.`,
    seoKeywords,
    internalLinks,
    overview: [
      `This roadmap is tailored for ${profile.label} rather than using placeholder milestones.`,
      "Each week combines topics, hands-on exercises, one concrete project, and a revision checkpoint so progress feels measurable.",
      "The sequence is designed to be useful for learning, portfolio building, and interview preparation.",
      `The plan emphasizes ${profile.keyTopics.slice(0, 4).join(", ")} so the roadmap stays anchored to the actual domain.`
    ],
    tools: getRoadmapTools(category),
    projects: buildProjectsSummary(weeks),
    resources: buildResourcesSummary(weeks),
    interviewPrep: buildInterviewPrepSummary(weeks),
    certifications: profile.certifications,
    portfolioIdeas: [
      `Build one resume-ready ${profile.label} capstone that shows your progression from basics to applied problem-solving.`,
      "Document the final project as a short case study with screenshots, architecture notes, decisions, and what you improved after feedback."
    ],
    faq,
    weeks: weeks.map((week, index) => ({
      week: index + 1,
      ...week
    }))
  }, category, goal);
};

const buildFallbackVivaPack = ({ subject = "dbms", topic = "", level = "intermediate" }) => {
  const category = inferVivaCategory(subject, topic);
  const blueprint = vivaBlueprints[subject] || null;
  const resolvedTopic = topic?.trim() || blueprint?.defaultTopic || `${subjectLabels[category] || "General"} fundamentals`;
  const items = blueprint ? resolveVivaItemsForTopic(subject, resolvedTopic) : buildGenericVivaItems(category, resolvedTopic, level);
  const seoKeywords = blueprint?.longTail || buildGenericSeoKeywords(`${resolvedTopic} viva`, category);
  const internalLinks = blueprint?.internalLinks || buildGenericInternalLinks(category);
  const faq = blueprint?.faq || domainProfiles[category]?.faq || domainProfiles.general.faq;

  return {
    title: `${resolvedTopic} Viva Questions`,
    description: `Focused ${subjectLabels[subject] || subjectLabels[category] || subject} viva questions with concise answers, practical examples, and follow-up prompts.`,
    slug: slugify(`${resolvedTopic} viva questions`),
    seoTitle: `${resolvedTopic} viva questions with answers`,
    seoDescription: `Prepare ${resolvedTopic} viva questions with clear answers, examples, follow-up questions, and interview context for students.`,
    seoKeywords,
    internalLinks,
    faq,
    items: items.map((item, index) => ({
      id: `${subject}-${index + 1}`,
      ...item,
      difficulty: level
    }))
  };
};

const isValidRoadmap = (value) =>
  value &&
  typeof value.title === "string" &&
  Array.isArray(value.weeks) &&
  value.weeks.length >= 2 &&
  value.weeks.every(
    (week) =>
      typeof week.focus === "string" &&
      Array.isArray(week.topics) &&
      Array.isArray(week.exercises) &&
      typeof week.project === "string" &&
      Array.isArray(week.resources) &&
      Array.isArray(week.interviewPrep) &&
      typeof week.revisionCheckpoint === "string"
  );

const isValidVivaPack = (value) =>
  value &&
  typeof value.title === "string" &&
  Array.isArray(value.items) &&
  value.items.length >= 4 &&
  value.items.every(
    (item) =>
      typeof item.question === "string" &&
      typeof item.answer === "string" &&
      typeof item.followUp === "string" &&
      typeof item.example === "string" &&
      typeof item.interviewAngle === "string"
  );

export const generateRoadmap = async ({ goal = "frontend roadmap for beginners", durationWeeks = 8 }) => {
  const category = analyzeRoadmapGoal(goal);
  const input = { goal, durationWeeks, category };
  const cacheKey = buildCacheKey("roadmap", input);

  if (hasOpenRouter) {
    try {
      const { systemPrompt, userPrompt } = buildRoadmapPrompt({ goal, durationWeeks, category });
      const { content: raw, model } = await callOpenRouter({
        systemPrompt,
        userPrompt,
        requestId: `roadmap-${cacheKey.slice(0, 8)}`
      });
      const parsed = safeJsonParse(raw);

      if (isValidRoadmap(parsed)) {
        const response = normalizeRoadmapResult({
          ...parsed,
          slug: parsed.slug || slugify(goal),
          internalLinks: parsed.internalLinks?.length ? parsed.internalLinks : roadmapBlueprints[category]?.internalLinks || buildGenericInternalLinks(category)
        }, category, goal);

        await saveCachedGeneration({
          cacheKey,
          type: "roadmap",
          input,
          response,
          provider: "openrouter",
          model,
          status: "success"
        });

        return response;
      }
    } catch (error) {
      logger.warn("OpenRouter roadmap generation failed, checking cache and fallback", {
        cacheKey,
        error: error.message
      });

      const cached = await getCachedGeneration(cacheKey);
      if (cached?.response) {
        return normalizeRoadmapResult(cached.response, category, goal);
      }
    }
  }

  const fallback = buildFallbackRoadmap({ goal, durationWeeks });
  await saveCachedGeneration({
    cacheKey,
    type: "roadmap",
    input,
    response: fallback,
    provider: "fallback",
    model: "local-blueprint",
    status: "fallback",
    lastError: hasOpenRouter ? "OpenRouter unavailable or invalid response" : "OpenRouter not configured"
  });
  return fallback;
};

export const generateVivaPack = async ({ subject = "dbms", topic = "", level = "intermediate" }) => {
  const input = { subject, topic, level };
  const cacheKey = buildCacheKey("viva", input);
  const category = inferVivaCategory(subject, topic);

  if (hasOpenRouter) {
    try {
      const { systemPrompt, userPrompt } = buildVivaPrompt({ subject, topic, level });
      const { content: raw, model } = await callOpenRouter({
        systemPrompt,
        userPrompt,
        requestId: `viva-${cacheKey.slice(0, 8)}`
      });
      const parsed = safeJsonParse(raw);

      if (isValidVivaPack(parsed)) {
        const response = {
          ...parsed,
          slug: parsed.slug || slugify(`${topic || subjectLabels[subject] || subjectLabels[category] || "general"} viva questions`),
          internalLinks: parsed.internalLinks?.length ? parsed.internalLinks : buildGenericInternalLinks(category),
          seoKeywords: parsed.seoKeywords?.length ? parsed.seoKeywords : buildGenericSeoKeywords(`${topic || subject} viva`, category)
        };

        await saveCachedGeneration({
          cacheKey,
          type: "viva",
          input,
          response,
          provider: "openrouter",
          model,
          status: "success"
        });

        return response;
      }
    } catch (error) {
      logger.warn("OpenRouter viva generation failed, checking cache and fallback", {
        cacheKey,
        error: error.message
      });

      const cached = await getCachedGeneration(cacheKey);
      if (cached?.response) {
        return cached.response;
      }
    }
  }

  const fallback = buildFallbackVivaPack({ subject, topic, level });
  await saveCachedGeneration({
    cacheKey,
    type: "viva",
    input,
    response: fallback,
    provider: "fallback",
    model: "local-blueprint",
    status: "fallback",
    lastError: hasOpenRouter ? "OpenRouter unavailable or invalid response" : "OpenRouter not configured"
  });
  return fallback;
};

export const generateAIHealthSample = async () => {
  if (!hasOpenRouter) {
    return {
      provider: "fallback",
      model: "local-blueprints",
      output: buildFallbackRoadmap({ goal: "frontend roadmap for beginners", durationWeeks: 2 })
    };
  }

  const category = analyzeRoadmapGoal("frontend roadmap for beginners");
  const { systemPrompt, userPrompt } = buildRoadmapPrompt({
    goal: "frontend roadmap for beginners",
    durationWeeks: 2,
    category
  });
  const result = await callOpenRouter({
    systemPrompt,
    userPrompt,
    requestId: "ai-healthcheck"
  });

  return {
    provider: "openrouter",
    model: result.model,
    output: safeJsonParse(result.content)
  };
};
