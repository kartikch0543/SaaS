import OpenAI from "openai";
import { env } from "../config/env.js";
import { slugify } from "../utils/slugify.js";

const hasOpenRouter = Boolean(env.openrouterApiKey);

const openRouterClient = hasOpenRouter
  ? new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: env.openrouterApiKey
    })
  : null;

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
  os: "Operating Systems"
};

const analyzeRoadmapGoal = (goal) => {
  const normalized = goal.toLowerCase();

  if (/(frontend|react|html|css|javascript|web ui|ui development)/.test(normalized)) {
    return "frontend";
  }
  if (/(backend|node|express|api|server|microservice)/.test(normalized)) {
    return "backend";
  }
  if (/(dbms|database|sql|normalization|indexing|transactions)/.test(normalized)) {
    return "dbms";
  }
  if (/(operating system|os |deadlock|paging|threads|cpu scheduling)/.test(normalized)) {
    return "systems";
  }
  if (/(aptitude|quantitative|reasoning|placement prep|mock test)/.test(normalized)) {
    return "aptitude";
  }

  return "general";
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

const callOpenRouter = async (systemPrompt, userPrompt) => {
  if (!openRouterClient) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const completion = await openRouterClient.chat.completions.create({
    model: env.openrouterModel,
    temperature: 0.8,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  return completion.choices[0]?.message?.content?.trim() || "";
};

const buildRoadmapPrompt = ({ goal, durationWeeks, category }) => {
  const blueprint = roadmapBlueprints[category] || roadmapBlueprints.general;

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
SEO angles to consider: ${blueprint.longTail.join(", ")}
Internal link suggestions to consider: ${blueprint.internalLinks.join(", ")}

Return JSON in this exact shape:
{
  "title": "string",
  "description": "string",
  "slug": "string",
  "seoTitle": "string",
  "seoDescription": "string",
  "seoKeywords": ["string"],
  "internalLinks": ["string"],
  "overview": ["string"],
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
- Projects must match the entered goal.
- Resources should be free or easy to access.
- FAQ should target informational long-tail search intent.
- Slug must be clean, lowercase, and SEO-friendly.`
  };
};

const buildVivaPrompt = ({ subject, topic, level }) => {
  const blueprint = vivaBlueprints[subject] || vivaBlueprints.dbms;
  const resolvedTopic = topic?.trim() || blueprint.defaultTopic;

  return {
    systemPrompt: `You are an expert viva coach, interviewer, and SEO writer creating premium technical preparation content.
Rules:
- Return only valid JSON.
- Questions must be topic-specific and not generic.
- Answers must be concise but useful.
- Include practical examples, follow-up prompts, and interview framing.
- Avoid repeating sentence structure across items.`,
    userPrompt: `Generate a ${level} viva pack for subject "${subjectLabels[subject] || subject}" focused on "${resolvedTopic}".
SEO angles to consider: ${blueprint.longTail.join(", ")}
Internal link suggestions to consider: ${blueprint.internalLinks.join(", ")}

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
  const blueprint = roadmapBlueprints[category] || roadmapBlueprints.general;
  const weeks = blueprint.weeks.slice(0, Math.max(2, Math.min(durationWeeks, blueprint.weeks.length)));

  return {
    title: `${goal.charAt(0).toUpperCase()}${goal.slice(1)} Roadmap`,
    description: `A practical ${weeks.length}-week roadmap for ${goal} with realistic progression, mini-projects, resources, and interview preparation.`,
    slug: slugify(goal),
    seoTitle: `${goal} roadmap with projects and interview prep`,
    seoDescription: `Follow a realistic ${goal} roadmap with weekly milestones, mini-projects, free resources, revision checkpoints, and placement-oriented preparation.`,
    seoKeywords: blueprint.longTail,
    internalLinks: blueprint.internalLinks,
    overview: [
      `This roadmap is tailored for ${blueprint.label} rather than using placeholder milestones.`,
      "Each week combines topics, hands-on exercises, one concrete project, and a revision checkpoint so progress feels measurable.",
      "The sequence is designed to be useful for learning, portfolio building, and interview preparation."
    ],
    portfolioIdeas: [
      `Build one resume-ready ${blueprint.label} capstone that shows your progression from basics to applied problem-solving.`,
      "Document the final project as a short case study with screenshots, architecture notes, and what you improved after feedback."
    ],
    faq: blueprint.faq,
    weeks: weeks.map((week, index) => ({
      week: index + 1,
      ...week
    }))
  };
};

const buildFallbackVivaPack = ({ subject = "dbms", topic = "", level = "intermediate" }) => {
  const blueprint = vivaBlueprints[subject] || vivaBlueprints.dbms;
  const resolvedTopic = topic?.trim() || blueprint.defaultTopic;

  return {
    title: `${resolvedTopic} Viva Questions`,
    description: `Focused ${subjectLabels[subject] || subject} viva questions with concise answers, practical examples, and follow-up prompts.`,
    slug: slugify(`${resolvedTopic} viva questions`),
    seoTitle: `${resolvedTopic} viva questions with answers`,
    seoDescription: `Prepare ${resolvedTopic} viva questions with clear answers, examples, follow-up questions, and interview context for students.`,
    seoKeywords: blueprint.longTail,
    internalLinks: blueprint.internalLinks,
    faq: blueprint.faq,
    items: blueprint.items.map((item, index) => ({
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

  if (hasOpenRouter) {
    try {
      const { systemPrompt, userPrompt } = buildRoadmapPrompt({ goal, durationWeeks, category });
      const raw = await callOpenRouter(systemPrompt, userPrompt);
      const parsed = safeJsonParse(raw);

      if (isValidRoadmap(parsed)) {
        return {
          ...parsed,
          slug: parsed.slug || slugify(goal),
          internalLinks: parsed.internalLinks?.length ? parsed.internalLinks : roadmapBlueprints[category].internalLinks
        };
      }
    } catch (error) {
      console.error("OpenRouter roadmap generation failed, using fallback.", error.message);
    }
  }

  return buildFallbackRoadmap({ goal, durationWeeks });
};

export const generateVivaPack = async ({ subject = "dbms", topic = "", level = "intermediate" }) => {
  if (hasOpenRouter) {
    try {
      const { systemPrompt, userPrompt } = buildVivaPrompt({ subject, topic, level });
      const raw = await callOpenRouter(systemPrompt, userPrompt);
      const parsed = safeJsonParse(raw);

      if (isValidVivaPack(parsed)) {
        return {
          ...parsed,
          slug: parsed.slug || slugify(`${topic || subjectLabels[subject]} viva questions`)
        };
      }
    } catch (error) {
      console.error("OpenRouter viva generation failed, using fallback.", error.message);
    }
  }

  return buildFallbackVivaPack({ subject, topic, level });
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

  return {
    provider: "openrouter",
    model: env.openrouterModel,
    output: safeJsonParse(await callOpenRouter(systemPrompt, userPrompt))
  };
};
