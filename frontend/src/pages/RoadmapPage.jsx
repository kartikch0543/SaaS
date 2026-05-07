import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/client";
import { SeoHead } from "../components/seo/SeoHead";
import { Button } from "../components/common/Button";

export const RoadmapPage = () => {
  const [goal, setGoal] = useState("frontend roadmap for beginners");
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/api/ai/roadmap", { goal, durationWeeks: 8 });
      return response.data;
    }
  });

  return (
    <>
      <SeoHead
        title="Roadmap Generator"
        description="Create structured study roadmaps and interview preparation timelines."
        path="/roadmap-generator"
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-fg">Build a practical roadmap around your next milestone</h1>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <input
            className="field-input flex-1 rounded-full"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
          />
          <Button onClick={() => mutation.mutate()}>{mutation.isPending ? "Planning..." : "Generate roadmap"}</Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {mutation.data?.milestones?.map((milestone) => (
            <article key={milestone.week} className="surface-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent2">Week {milestone.week}</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">{milestone.focus}</h2>
              <ul className="mt-4 space-y-2 text-muted">
                {milestone.tasks.map((task) => (
                  <li key={task}>• {task}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};
