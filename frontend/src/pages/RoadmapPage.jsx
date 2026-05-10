import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient, { warmBackend } from "../api/client";
import { SeoHead } from "../components/seo/SeoHead";
import { Button } from "../components/common/Button";

export const RoadmapPage = () => {
  const [goal, setGoal] = useState("frontend roadmap for beginners");
  const [openWeek, setOpenWeek] = useState(1);

  const mutation = useMutation({
    mutationFn: async () => {
      await warmBackend();
      const payload = {
        goal,
        topic: goal,
        durationWeeks: 8
      };
      const response = await apiClient.post("/api/ai/roadmap", payload);
      return response.data;
    },
    onSuccess: () => setOpenWeek(1),
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message || "Roadmap generation failed.");
    }
  });

  const roadmap = mutation.data;

  return (
    <>
      <SeoHead
        title={roadmap?.seoTitle || "Roadmap Generator"}
        description={roadmap?.seoDescription || "Create realistic study roadmaps with projects, resources, interview prep, and SEO-ready structure."}
        keywords={roadmap?.seoKeywords || []}
        path="/roadmap-generator"
      />
      <section className="section-shell py-16">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-fg">Build a roadmap that feels like a real mentor wrote it</h1>
          <p className="mt-4 text-muted">
            Generate topic-aware weekly milestones with concrete technologies, realistic exercises, interview prep, portfolio ideas, and long-tail SEO structure.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <input
            className="field-input flex-1 rounded-full"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder="Try: frontend roadmap for beginners"
          />
          <Button onClick={() => mutation.mutate()}>{mutation.isPending ? "Planning..." : "Generate roadmap"}</Button>
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
            {mutation.error?.message || "The roadmap request did not complete."}
            <div className="mt-4">
              <Button variant="secondary" onClick={() => mutation.mutate()}>
                Retry generation
              </Button>
            </div>
          </div>
        ) : null}

        {roadmap ? (
          <>
            <div className="mt-10 surface-card p-8">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent2">AI roadmap</p>
                  {roadmap.category ? (
                    <span className="rounded-full border border-border/70 bg-panel px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-soft">
                      {roadmap.category}
                    </span>
                  ) : null}
                  {roadmap.difficulty ? (
                    <span className="rounded-full border border-border/70 bg-panel px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-soft">
                      {roadmap.difficulty}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-3 font-display text-3xl font-semibold text-fg">{roadmap.title}</h2>
                <p className="mt-4 text-muted">{roadmap.description}</p>
                <div className="mt-6 space-y-3">
                  {roadmap.overview?.map((point) => (
                    <p key={point} className="text-sm leading-7 text-muted">
                      {point}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-4 md:grid-cols-2">
              <div className="surface-card p-6">
                <h3 className="font-display text-xl font-semibold text-fg">Milestones</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {roadmap.milestones?.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="surface-card p-6">
                <h3 className="font-display text-xl font-semibold text-fg">Tools and platforms</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {roadmap.tools?.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="surface-card p-6">
                <h3 className="font-display text-xl font-semibold text-fg">Project path</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {roadmap.projects?.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="surface-card p-6">
                <h3 className="font-display text-xl font-semibold text-fg">Learning resources</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {roadmap.resources?.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="surface-card p-6">
                <h3 className="font-display text-xl font-semibold text-fg">Interview prep</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {roadmap.interviewPrep?.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 space-y-5">
              {roadmap.weeks?.map((week) => {
                const isOpen = openWeek === week.week;

                return (
                  <article key={week.week} className="surface-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenWeek(isOpen ? 0 : week.week)}
                      className="flex w-full items-center justify-between px-6 py-5 text-left"
                    >
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent2">Week {week.week}</p>
                        <h3 className="mt-2 font-display text-2xl font-semibold text-fg">{week.focus}</h3>
                      </div>
                      <span className="text-sm text-muted">{isOpen ? "Hide details" : "Show details"}</span>
                    </button>

                    {isOpen ? (
                      <div className="border-t border-border/70 px-6 py-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                          <div>
                            <h4 className="font-semibold text-fg">Topics</h4>
                            <ul className="mt-3 space-y-2 text-sm text-muted">
                              {week.topics?.map((topic) => (
                                <li key={topic}>- {topic}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-fg">Practical exercises</h4>
                            <ul className="mt-3 space-y-2 text-sm text-muted">
                              {week.exercises?.map((exercise) => (
                                <li key={exercise}>- {exercise}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-3">
                          <div className="surface-panel p-5">
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-soft">Mini project</p>
                            <p className="mt-3 text-sm leading-7 text-muted">{week.project}</p>
                          </div>

                          <div className="surface-panel p-5">
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-soft">Resources</p>
                            <ul className="mt-3 space-y-2 text-sm text-muted">
                              {week.resources?.map((resource) => (
                                <li key={resource}>- {resource}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="surface-panel p-5">
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-soft">Interview prep</p>
                            <ul className="mt-3 space-y-2 text-sm text-muted">
                              {week.interviewPrep?.map((item) => (
                                <li key={item}>- {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-6 rounded-3xl border border-border/70 bg-panel/80 p-5">
                          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-soft">Revision checkpoint</p>
                          <p className="mt-3 text-sm leading-7 text-muted">{week.revisionCheckpoint}</p>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="surface-card p-6">
                <h3 className="font-display text-2xl font-semibold text-fg">Portfolio ideas</h3>
                <ul className="mt-5 space-y-3 text-sm text-muted">
                  {roadmap.portfolioIdeas?.map((idea) => (
                    <li key={idea}>- {idea}</li>
                  ))}
                </ul>
              </div>

              <div className="surface-card p-6">
                <h3 className="font-display text-2xl font-semibold text-fg">Certifications and add-ons</h3>
                <ul className="mt-5 space-y-3 text-sm text-muted">
                  {roadmap.certifications?.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="surface-card p-6 lg:col-span-2">
                <h3 className="font-display text-2xl font-semibold text-fg">FAQ</h3>
                <div className="mt-5 space-y-5">
                  {roadmap.faq?.map((item) => (
                    <div key={item.question}>
                      <h4 className="font-semibold text-fg">{item.question}</h4>
                      <p className="mt-2 text-sm leading-7 text-muted">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </>
  );
};
