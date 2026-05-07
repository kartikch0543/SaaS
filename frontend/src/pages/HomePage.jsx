import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { SeoHead } from "../components/seo/SeoHead";
import { StatCard } from "../components/common/StatCard";

export const HomePage = () => (
  <>
    <SeoHead
      title="AI Study Platform for Viva, Roadmaps, and Revision"
      description="StudyForge AI helps college students prepare for viva, track learning streaks, and publish SEO-friendly study content."
      path="/"
    />
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div>
          <span className="inline-flex rounded-full bg-white/75 px-4 py-2 text-sm font-medium text-pine">
            Built for students who want real momentum
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-tight text-ink sm:text-6xl">
            Turn syllabus chaos into focused prep, proof of progress, and search-friendly study assets.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-700">
            StudyForge AI combines viva practice, roadmaps, revision notes, and analytics dashboards in one
            premium learning workspace designed like a startup product.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/dashboard">
              <Button>Open student dashboard</Button>
            </Link>
            <Link to="/dbms-viva-questions">
              <Button variant="secondary">Explore SEO content</Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          <StatCard label="Average quiz lift" value="+23%" hint="Practice loops that improve confidence fast." />
          <StatCard label="Keyword-ready pages" value="25+" hint="Structured for long-tail informational intent." />
          <StatCard label="Weekly planning window" value="8 weeks" hint="Roadmaps designed for semester pacing." />
        </div>
      </motion.div>
    </section>
  </>
);
