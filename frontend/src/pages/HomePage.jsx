import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/common/Button";
import { SeoHead } from "../components/seo/SeoHead";
import { StatCard } from "../components/common/StatCard";
import apiClient from "../api/client";
import { getContentPath } from "../utils/contentPaths";

export const HomePage = () => {
  const { data: posts } = useQuery({
    queryKey: ["featured-posts"],
    queryFn: async () => (await apiClient.get("/api/blogs")).data.items
  });

  return (
    <>
      <SeoHead
        title="AI Study Platform for Viva, Roadmaps, and Revision"
        description="StudyForge AI helps students prepare for technical viva, build learning roadmaps, revise engineering topics, and improve placement preparation."
        path="/"
      />
      <section className="section-shell py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div>
            <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              Built for students who want real momentum
            </span>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-tight text-fg sm:text-6xl">
              Turn syllabus chaos into focused viva preparation, roadmap planning, and measurable study progress.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              StudyForge AI blends AI tools, structured notes, interview prep, and analytics dashboards into one student platform built for engineering revision, placement preparation, and practical learning momentum.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button>Open student dashboard</Button>
              </Link>
              <Link to="/how-to-prepare-for-technical-viva">
                <Button variant="secondary">Read the technical viva guide</Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            <StatCard label="Average quiz lift" value="+23%" hint="Practice loops that improve confidence fast." />
            <StatCard label="Ranking-focused pages" value="7" hint="Each page is aimed at long-tail educational search intent." />
            <StatCard label="Weekly planning window" value="8 weeks" hint="Roadmaps designed for semester pacing." />
          </div>
        </motion.div>
      </section>

      <section className="section-shell pb-16">
        <div className="surface-card p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-soft">Why students use it</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-fg">One product for viva prep, interview revision, and roadmap planning.</h2>
            </div>
            <div className="text-muted">
              <p>Students can move from topic guides like DBMS viva questions, SQL joins explained, and OS short notes into AI tools that help them build revision systems, roadmap plans, and better daily consistency.</p>
            </div>
            <div className="text-muted">
              <p>That makes StudyForge AI useful both as a learning system and as a recruiter-grade full-stack project because the content, product paths, and dashboards reinforce each other naturally.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface-card p-8">
            <h2 className="font-display text-3xl font-semibold text-fg">What you can do with StudyForge AI</h2>
            <div className="mt-5 space-y-4 text-muted">
              <p>Use the roadmap generator to plan frontend, backend, SDE, AI, or placement-focused study paths with milestones, projects, interview prep, and learning resources.</p>
              <p>Use the viva preparation tools to practice DBMS, OOPS, operating systems, networking, and other technical subjects using fresh questions, concise answers, and follow-up prompts.</p>
              <p>Use the content library to revise engineering topics through structured guides with internal links, FAQs, and related topic clusters.</p>
            </div>
          </div>
          <div className="surface-card p-8">
            <h2 className="font-display text-3xl font-semibold text-fg">Explore study hubs</h2>
            <div className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2">
              <Link to="/roadmap" className="rounded-2xl border border-border/70 bg-panel/70 px-4 py-3 hover:text-accent">
                Roadmap pages
              </Link>
              <Link to="/viva" className="rounded-2xl border border-border/70 bg-panel/70 px-4 py-3 hover:text-accent">
                Viva preparation guides
              </Link>
              <Link to="/interview-prep" className="rounded-2xl border border-border/70 bg-panel/70 px-4 py-3 hover:text-accent">
                Interview preparation hub
              </Link>
              <Link to="/blog" className="rounded-2xl border border-border/70 bg-panel/70 px-4 py-3 hover:text-accent">
                Blog and study notes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-soft">Popular guides</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-fg">Long-tail pages designed to win discoverability</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts?.slice(0, 6).map((post) => (
            <Link key={post.slug} to={getContentPath(post)} className="surface-card p-6 hover:-translate-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{post.intent}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-fg">{post.title}</h3>
              <p className="mt-3 text-sm text-muted">{post.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};
