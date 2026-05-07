import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/common/Button";
import { SeoHead } from "../components/seo/SeoHead";
import { StatCard } from "../components/common/StatCard";
import apiClient from "../api/client";

export const HomePage = () => {
  const { data: posts } = useQuery({
    queryKey: ["featured-posts"],
    queryFn: async () => (await apiClient.get("/api/blogs")).data.items
  });

  return (
    <>
      <SeoHead
        title="AI Study Platform for Viva, Roadmaps, and Revision"
        description="StudyForge AI helps college students prepare for viva, track learning streaks, and publish SEO-friendly study content."
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
              Turn syllabus chaos into focused prep, proof of progress, and search-ready learning assets.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              StudyForge AI blends AI tools, structured notes, interview prep, and analytics dashboards into a polished student SaaS product that can also earn organic traffic.
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-soft">Why it ranks</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-fg">SEO is built into the product surface, not bolted on later.</h2>
            </div>
            <div className="text-muted">
              <p>Students can discover practical pages like DBMS viva questions, SQL joins explained, and OS short notes through organic search, then move into AI tools and dashboards through internal linking.</p>
            </div>
            <div className="text-muted">
              <p>That makes StudyForge AI useful for users and meaningful for recruiters because it demonstrates search intent mapping, conversion flow, and content-product alignment.</p>
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
            <Link key={post.slug} to={`/${post.slug}`} className="surface-card p-6 hover:-translate-y-1">
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
