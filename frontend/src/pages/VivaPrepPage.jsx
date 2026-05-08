import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient, { warmBackend } from "../api/client";
import { Button } from "../components/common/Button";
import { SeoHead } from "../components/seo/SeoHead";

export const VivaPrepPage = () => {
  const [subject, setSubject] = useState("dbms");
  const [topic, setTopic] = useState("DBMS normalization");

  const mutation = useMutation({
    mutationFn: async () => {
      await warmBackend();
      const response = await apiClient.post("/api/ai/viva", { subject, topic, level: "intermediate" });
      return response.data;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message || "Viva generation failed.");
    }
  });

  const vivaPack = mutation.data;

  return (
    <>
      <SeoHead
        title={vivaPack?.seoTitle || "AI Viva Preparation"}
        description={vivaPack?.seoDescription || "Generate topic-aware viva questions with answers, examples, follow-up prompts, and interview framing."}
        keywords={vivaPack?.seoKeywords || []}
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

        {mutation.isPending ? (
          <div className="mt-8 grid gap-4">
            <div className="surface-card animate-pulse p-6">
              <div className="h-4 w-32 rounded-full bg-panel" />
              <div className="mt-4 h-8 w-2/3 rounded-full bg-panel" />
              <div className="mt-4 h-4 w-full rounded-full bg-panel" />
              <div className="mt-2 h-4 w-5/6 rounded-full bg-panel" />
            </div>
            <div className="surface-card h-48 animate-pulse" />
          </div>
        ) : null}

        {mutation.isError ? (
          <div className="mt-8 rounded-3xl border border-danger/30 bg-danger/10 p-5 text-sm text-fg">
            The viva request did not complete. Check your backend env, OpenRouter key, and deployment logs. After this patch, the backend should fall back quickly instead of hanging for a long time.
            <div className="mt-4">
              <Button variant="secondary" onClick={() => mutation.mutate()}>
                Retry generation
              </Button>
            </div>
          </div>
        ) : null}

        {vivaPack ? (
          <>
            <div className="mt-10 surface-card p-8">
              <div className="max-w-4xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent2">AI viva pack</p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-fg">{vivaPack.title}</h2>
                <p className="mt-4 text-muted">{vivaPack.description}</p>
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
