import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/client";
import { Button } from "../components/common/Button";
import { SeoHead } from "../components/seo/SeoHead";

export const VivaPrepPage = () => {
  const [subject, setSubject] = useState("dbms");
  const [topic, setTopic] = useState("DBMS normalization");

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/api/ai/viva", { subject, topic, level: "intermediate" });
      return response.data;
    }
  });

  const vivaPack = mutation.data;

  return (
    <>
      <SeoHead
        title="AI Viva Preparation"
        description="Generate topic-aware viva questions with answers, examples, follow-up prompts, and interview framing."
        path="/viva-prep"
      />
      <section className="section-shell py-16">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold text-fg">Generate focused viva practice in seconds</h1>
          <p className="mt-4 text-muted">
            Choose a subject, add a focused topic, and generate viva questions that feel specific, practical, and interview-aware.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[220px_1fr_auto]">
          <select
            className="rounded-full border border-border bg-elev px-5 py-3 text-fg"
            value={subject}
            onChange={(event) => {
              const nextSubject = event.target.value;
              setSubject(nextSubject);
              if (nextSubject === "dbms") setTopic("DBMS normalization");
              if (nextSubject === "oops") setTopic("OOPS polymorphism");
              if (nextSubject === "cn") setTopic("TCP vs UDP");
              if (nextSubject === "os") setTopic("Process vs thread");
            }}
          >
            <option value="dbms">DBMS</option>
            <option value="oops">OOPS</option>
            <option value="cn">Computer Networks</option>
            <option value="os">Operating Systems</option>
          </select>

          <input
            className="field-input rounded-full"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Try: DBMS normalization"
          />

          <Button onClick={() => mutation.mutate()}>{mutation.isPending ? "Generating..." : "Generate viva pack"}</Button>
        </div>

        {vivaPack ? (
          <>
            <div className="mt-10 grid gap-6 lg:grid-cols-[0.68fr_0.32fr]">
              <div className="surface-card p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent2">AI viva pack</p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-fg">{vivaPack.title}</h2>
                <p className="mt-4 text-muted">{vivaPack.description}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  {vivaPack.seoKeywords?.slice(0, 4).map((keyword) => (
                    <span key={keyword} className="rounded-full bg-panel px-4 py-2 text-muted">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="surface-card p-6">
                  <h3 className="font-display text-xl font-semibold text-fg">SEO snapshot</h3>
                  <p className="mt-4 text-sm text-muted">Slug</p>
                  <p className="mt-1 font-medium text-fg">/{vivaPack.slug}</p>
                  <p className="mt-4 text-sm text-muted">Meta description</p>
                  <p className="mt-1 text-sm leading-7 text-muted">{vivaPack.seoDescription}</p>
                </div>

                <div className="surface-card p-6">
                  <h3 className="font-display text-xl font-semibold text-fg">Internal link ideas</h3>
                  <ul className="mt-4 space-y-2 text-sm text-muted">
                    {vivaPack.internalLinks?.map((link) => (
                      <li key={link}>- {link}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-5">
              {vivaPack.items?.map((item, index) => (
                <article key={item.id || index} className="surface-card p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent2">Question {index + 1}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-fg">{item.question}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{item.answer}</p>

                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    <div className="surface-panel p-4">
                      <p className="text-sm font-semibold text-fg">Follow-up</p>
                      <p className="mt-2 text-sm leading-7 text-muted">{item.followUp}</p>
                    </div>

                    <div className="surface-panel p-4">
                      <p className="text-sm font-semibold text-fg">Practical example</p>
                      <p className="mt-2 text-sm leading-7 text-muted">{item.example}</p>
                    </div>

                    <div className="surface-panel p-4">
                      <p className="text-sm font-semibold text-fg">Interview angle</p>
                      <p className="mt-2 text-sm leading-7 text-muted">{item.interviewAngle}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 surface-card p-6">
              <h3 className="font-display text-2xl font-semibold text-fg">FAQ</h3>
              <div className="mt-5 space-y-5">
                {vivaPack.faq?.map((item) => (
                  <div key={item.question}>
                    <h4 className="font-semibold text-fg">{item.question}</h4>
                    <p className="mt-2 text-sm leading-7 text-muted">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section>
    </>
  );
};
