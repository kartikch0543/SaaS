import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import apiClient from "../api/client";
import { SeoHead } from "../components/seo/SeoHead";
import { buildBreadcrumbSchema, buildCollectionSchema } from "../utils/seo";
import { getContentPath } from "../utils/contentPaths";
import { siteConfig } from "../constants/site";

const hubContent = {
  "/blog": {
    title: "Study Blog for Roadmaps, Viva Questions, and Interview Preparation",
    description:
      "Explore StudyForge AI guides for technical viva preparation, programming roadmaps, interview prep, and student learning systems.",
    h1: "StudyForge AI blog and learning guides",
    intro: [
      "The StudyForge AI blog is built to help students move from scattered revision to structured preparation. Instead of publishing generic listicles, the content library focuses on high-intent topics such as technical viva questions, roadmap planning, interview preparation, and engineering study notes.",
      "Each guide is written to support both discovery and action. A visitor can land on a practical topic like DBMS viva questions or frontend roadmap planning, understand the fundamentals, and then move into related AI tools such as the roadmap generator or viva preparation workspace."
    ],
    h2: "Why these guides matter for students",
    body: [
      "Engineering students often search for direct help with specific academic or placement bottlenecks. That usually means they are not looking for broad theory first. They want the right topic explained with examples, structured revision sections, FAQs, and links to the next step. The blog system supports that journey with content clusters instead of isolated pages.",
      "This content hub also improves crawlability and topical authority by grouping related pages into stronger pathways. Roadmaps, viva prep, and interview pages reinforce each other through clear hierarchy and internal links, which gives both users and search engines a better view of what the product covers."
    ],
    keywords: ["student ai tools", "technical viva questions", "engineering roadmap", "placement preparation blog"],
    filter: () => true
  },
  "/roadmap": {
    title: "Developer and Engineering Roadmaps for Students",
    description:
      "Browse beginner-friendly roadmap pages for frontend, backend, placement prep, and engineering skill development.",
    h1: "Roadmap pages for students and early-career builders",
    intro: [
      "Roadmap pages help students reduce confusion when they do not know what to learn first, what to practice next, or how to turn theory into projects. StudyForge AI groups roadmap content into clear learning paths so visitors can move from beginner topics into interview preparation and portfolio work.",
      "Whether you are exploring frontend development, backend engineering, technical interview preparation, or engineering-focused study planning, these roadmap pages are designed to give a practical sequence instead of a vague list of technologies."
    ],
    h2: "How to use a roadmap page effectively",
    body: [
      "A good roadmap does more than list tools. It should explain the order of learning, the reason each stage matters, and the types of projects that prove progress. That is why these pages combine milestone thinking, structured topics, and links to related guides for deeper revision.",
      "Students preparing for internships or placements can use these pages as weekly planning references. Start with one roadmap page, follow the linked topic guides, and then use the AI roadmap generator to create a more personalized study path."
    ],
    keywords: ["frontend roadmap", "backend roadmap", "engineering roadmap", "roadmap generation tool"],
    filter: (post) => /roadmap/i.test(post.category) || /roadmap/i.test(post.slug)
  },
  "/viva": {
    title: "Technical Viva Questions and Subject Revision Guides",
    description:
      "Find technical viva questions, model answers, and exam-friendly revision guides for DBMS, OOPS, operating systems, and computer networks.",
    h1: "Technical viva preparation pages for students",
    intro: [
      "Viva preparation works best when students can revise the most repeated questions, understand the concept in simple language, and practice short spoken answers. StudyForge AI organizes its subject guides around that exact need.",
      "These pages focus on DBMS viva questions, operating system revision, networking basics, and interview-style explanations so students can prepare for both classroom evaluation and placement conversations."
    ],
    h2: "What makes a strong viva prep page",
    body: [
      "A useful viva page should combine definition-level clarity, practical examples, and follow-up questions that reflect how an examiner actually asks questions. That is why the content system includes sections, FAQs, and related reading instead of relying on shallow bullet lists.",
      "If you want deeper personalized help after reading these guides, the AI viva preparation tool can generate fresh practice questions based on the same topic family."
    ],
    keywords: ["technical viva questions", "dbms viva", "os viva", "cn viva", "viva preparation for students"],
    filter: (post) =>
      /viva|revision notes/i.test(post.category) ||
      /viva|short-notes|computer-networks|dbms/i.test(post.slug)
  },
  "/interview-prep": {
    title: "Interview Preparation Guides for Students and Freshers",
    description:
      "Study technical interview preparation guides for freshers, engineering students, and developer placement preparation.",
    h1: "Interview preparation guides for technical students",
    intro: [
      "Interview preparation is easier when students can connect core subjects, roadmap planning, and real project communication. StudyForge AI organizes interview-focused guides so learners can build that bridge from theory to spoken confidence.",
      "These pages are especially useful for placement preparation because they combine beginner-friendly explanations with related reading across OOPS, technical viva strategy, subject revision, and skill roadmaps."
    ],
    h2: "Build a stronger placement preparation system",
    body: [
      "A strong interview prep workflow includes more than coding practice. Students also need core CS revision, project storytelling, mock viva practice, and clear learning priorities. This content hub supports that broader preparation model.",
      "Use these pages to build subject confidence first, then move into the AI roadmap and viva tools to personalize your next steps."
    ],
    keywords: ["coding interview preparation", "placement preparation", "technical interview prep", "student interview guide"],
    filter: (post) => /interview|technical-viva/i.test(post.slug) || /interview prep|study guide/i.test(post.category)
  }
};

export const ContentHubPage = () => {
  const location = useLocation();
  const hub = hubContent[location.pathname] || hubContent["/blog"];
  const postsQuery = useQuery({
    queryKey: ["hub-posts", location.pathname],
    queryFn: async () => (await apiClient.get("/api/blogs")).data.items
  });

  const filteredPosts = useMemo(() => (postsQuery.data || []).filter(hub.filter), [hub, postsQuery.data]);
  const schema = [
    buildCollectionSchema({
      title: hub.title,
      description: hub.description,
      path: location.pathname
    }),
    buildBreadcrumbSchema([
      { name: "Home", item: siteConfig.baseUrl },
      { name: hub.h1, item: `${siteConfig.baseUrl}${location.pathname}` }
    ])
  ];

  return (
    <>
      <SeoHead title={hub.title} description={hub.description} keywords={hub.keywords} path={location.pathname} schema={schema} />
      <section className="section-shell py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-soft">
          <Link to="/" className="hover:text-accent">
            Home
          </Link>
          <span className="px-2">/</span>
          <span className="text-muted">{hub.h1}</span>
        </nav>
        <header className="mt-6 max-w-4xl">
          <h1 className="font-display text-5xl font-bold text-fg">{hub.h1}</h1>
          <div className="mt-6 space-y-4 text-lg leading-8 text-muted">
            {hub.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </header>

        <section className="surface-card mt-10 p-8">
          <h2 className="font-display text-3xl font-semibold text-fg">{hub.h2}</h2>
          <div className="mt-5 space-y-4 text-muted">
            {hub.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-3xl font-semibold text-fg">Featured pages in this topic cluster</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link key={post.slug} to={getContentPath(post)} className="surface-card p-6 hover:-translate-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent2">{post.category}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-fg">{post.title}</h3>
                <p className="mt-3 text-sm text-muted">{post.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </>
  );
};
